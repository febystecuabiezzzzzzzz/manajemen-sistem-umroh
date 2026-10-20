import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Helper untuk mengekstrak Project Ref dari URL Supabase
function getProjectRef(url?: string): string {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname // xwqxoidpcfpbqllwccgc.supabase.co
    return hostname.split('.')[0] || ''
  } catch {
    return ''
  }
}

// Helper untuk mendapatkan Connection String
function resolveConnectionString(providedString?: string, providedPassword?: string): string {
  if (providedString && providedString.trim().length > 0) {
    return providedString.trim()
  }
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) {
    return process.env.DATABASE_URL.trim()
  }
  if (providedPassword && providedPassword.trim().length > 0) {
    const projectRef = getProjectRef(process.env.NEXT_PUBLIC_SUPABASE_URL)
    if (projectRef) {
      const encodedPassword = encodeURIComponent(providedPassword.trim())
      // Direct Postgres Supabase Connection
      return `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`
    }
  }
  return ''
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, query, connectionString, dbPassword } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const projectRef = getProjectRef(supabaseUrl)

    // ACTION: SIMPAN DATABASE_URL KE .env.local
    if (action === 'save-connection') {
      const newConnStr = resolveConnectionString(connectionString, dbPassword)
      if (!newConnStr) {
        return NextResponse.json({ success: false, error: 'Connection string atau password tidak valid.' }, { status: 400 })
      }

      try {
        const envPath = path.join(process.cwd(), '.env.local')
        let envContent = ''
        if (fs.existsSync(envPath)) {
          envContent = fs.readFileSync(envPath, 'utf8')
        }

        if (envContent.includes('DATABASE_URL=')) {
          envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${newConnStr}"`)
        } else {
          envContent += `\nDATABASE_URL="${newConnStr}"\n`
        }

        fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8')
        process.env.DATABASE_URL = newConnStr

        return NextResponse.json({ success: true, message: 'DATABASE_URL berhasil disimpan ke .env.local!' })
      } catch (err: any) {
        return NextResponse.json({ success: false, error: `Gagal menyimpan file .env.local: ${err.message}` }, { status: 500 })
      }
    }

    // ACTION: TEST CONNECTION
    if (action === 'test-connection') {
      let restConnected = false
      let restMessage = ''
      let pgConnected = false
      let pgMessage = ''
      let detectedTables: string[] = []

      // 1. Cek REST API Supabase
      if (supabaseUrl && supabaseAnonKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseAnonKey)
          // Coba query salah satu tabel atau cek auth health
          const { error } = await supabase.from('cabang').select('id').limit(1)
          if (!error) {
            restConnected = true
            restMessage = 'Terhubung ke Supabase REST API & Tabel siap.'
          } else if (error.code === 'PGRST205' || error.message.includes('relation') || error.message.includes('does not exist')) {
            restConnected = true
            restMessage = 'Terhubung ke Supabase REST API (Tabel belum dimigrasi).'
          } else {
            restConnected = true
            restMessage = `Terhubung ke Supabase REST API: ${error.message}`
          }
        } catch (e: any) {
          restMessage = `Gagal REST: ${e.message}`
        }
      } else {
        restMessage = 'NEXT_PUBLIC_SUPABASE_URL atau ANON_KEY belum disetel.'
      }

      // 2. Cek Direct PostgreSQL Connection
      const connStr = resolveConnectionString(connectionString, dbPassword)
      if (connStr) {
        const client = new Client({
          connectionString: connStr,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 5000,
        })

        try {
          await client.connect()
          const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name;
          `)
          detectedTables = res.rows.map(r => r.table_name)
          pgConnected = true
          pgMessage = `Berhasil terhubung ke PostgreSQL! Terdeteksi ${detectedTables.length} tabel.`
          await client.end()
        } catch (e: any) {
          pgMessage = `Koneksi PostgreSQL gagal: ${e.message}`
          try { await client.end() } catch {}
        }
      } else {
        pgMessage = 'DATABASE_URL atau Password PostgreSQL belum dikonfigurasi.'
      }

      return NextResponse.json({
        success: true,
        projectRef,
        supabaseUrl,
        restConnected,
        restMessage,
        pgConnected,
        pgMessage,
        detectedTables,
        hasEnvDatabaseUrl: Boolean(process.env.DATABASE_URL),
      })
    }

    // ACTION: EXECUTE SQL QUERY
    if (action === 'execute') {
      if (!query || query.trim().length === 0) {
        return NextResponse.json({ success: false, error: 'Query SQL tidak boleh kosong.' }, { status: 400 })
      }

      const connStr = resolveConnectionString(connectionString, dbPassword)

      // METODE 1: Jalankan lewat Direct PostgreSQL (pg client)
      if (connStr) {
        const client = new Client({
          connectionString: connStr,
          ssl: { rejectUnauthorized: false },
          query_timeout: 30000,
        })

        const startTime = Date.now()
        try {
          await client.connect()
          const rawResult = await client.query(query)
          const executionTimeMs = Date.now() - startTime
          await client.end()

          // Jika query multi-statement, rawResult berupa array dari Result
          if (Array.isArray(rawResult)) {
            const lastResult = rawResult[rawResult.length - 1]
            return NextResponse.json({
              success: true,
              mode: 'postgres',
              executionTimeMs,
              rowCount: rawResult.reduce((acc: number, curr: any) => acc + (curr.rowCount || 0), 0),
              command: lastResult.command,
              fields: lastResult.fields?.map((f: any) => f.name) || [],
              rows: lastResult.rows || [],
              multipleResults: rawResult.map((r: any) => ({
                command: r.command,
                rowCount: r.rowCount,
                rows: r.rows,
                fields: r.fields?.map((f: any) => f.name) || [],
              })),
              message: `Berhasil menjalankan ${rawResult.length} statement SQL dalam ${executionTimeMs}ms.`,
            })
          }

          return NextResponse.json({
            success: true,
            mode: 'postgres',
            executionTimeMs,
            rowCount: rawResult.rowCount ?? (rawResult.rows ? rawResult.rows.length : 0),
            command: rawResult.command,
            fields: rawResult.fields?.map((f: any) => f.name) || [],
            rows: rawResult.rows || [],
            message: `Query berhasil dieksekusi dalam ${executionTimeMs}ms. (${rawResult.rowCount ?? rawResult.rows.length} baris terpengaruh/ditemukan)`,
          })
        } catch (pgErr: any) {
          try { await client.end() } catch {}
          return NextResponse.json({
            success: false,
            error: pgErr.message || 'Error saat menjalankan query PostgreSQL.',
            hint: pgErr.hint || (pgErr.code === '28P01' ? 'Password database salah.' : undefined),
            position: pgErr.position,
            code: pgErr.code,
          }, { status: 400 })
        }
      }

      // METODE 2: Fallback ke Supabase RPC atau REST jika PostgreSQL direct belum diatur
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const startTime = Date.now()

        // Coba via stored procedure exec_sql jika ada
        const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', { query })
        if (!rpcError && rpcData) {
          const executionTimeMs = Date.now() - startTime
          const rows = Array.isArray(rpcData) ? rpcData : [rpcData]
          const fields = rows.length > 0 ? Object.keys(rows[0]) : []
          return NextResponse.json({
            success: true,
            mode: 'supabase-rpc',
            executionTimeMs,
            rowCount: rows.length,
            fields,
            rows,
            message: `Query dieksekusi via Supabase RPC dalam ${executionTimeMs}ms.`,
          })
        }

        // Coba jika query adalah SELECT sederhana: SELECT * FROM [table]
        const cleanQuery = query.trim().replace(/;+$/, '')
        const selectMatch = cleanQuery.match(/^SELECT\s+(.*?)\s+FROM\s+([a-zA-Z0-9_."]+)(?:\s+LIMIT\s+(\d+))?/i)
        if (selectMatch) {
          const tableName = selectMatch[2].replace(/^public\./, '').replace(/["']/g, '')
          const limit = selectMatch[3] ? parseInt(selectMatch[3], 10) : 50

          const { data, error } = await supabase.from(tableName).select('*').limit(limit)
          if (!error && data) {
            const executionTimeMs = Date.now() - startTime
            const fields = data.length > 0 ? Object.keys(data[0]) : []
            return NextResponse.json({
              success: true,
              mode: 'supabase-rest',
              executionTimeMs,
              rowCount: data.length,
              fields,
              rows: data,
              message: `Data dari tabel '${tableName}' diambil via REST dalam ${executionTimeMs}ms.`,
            })
          }
        }
      }

      // Jika belum ada connection string dan query adalah DDL/multi-statement
      return NextResponse.json({
        success: false,
        error: 'Koneksi PostgreSQL langsung belum terhubung.',
        needDirectConnection: true,
        projectRef,
        message: 'Untuk menjalankan query DDL (seperti CREATE TABLE, DROP, ALTER) atau script multi-baris langsung dari sini, silakan masukkan Password Database Supabase atau Connection String di tab Pengaturan Koneksi di atas. Atau salin query ini dan jalankan langsung di Supabase Studio Dashboard SQL Editor.',
      }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: 'Aksi tidak dikenali.' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Terjadi kesalahan server.' }, { status: 500 })
  }
}
