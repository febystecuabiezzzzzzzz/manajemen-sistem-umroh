import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DB_HOST || '127.0.0.1'
    const port = Number(process.env.DB_PORT || 3306)
    const database = process.env.DB_DATABASE || 'sistem_umroh_haji'
    const user = process.env.DB_USERNAME || 'root'
    const password = process.env.DB_PASSWORD || ''

    pool = mysql.createPool({
      host,
      port,
      database,
      user,
      password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      decimalNumbers: true,
    })
  }

  return pool
}

export const db = {
  async query<T = any>(sql: string, values: any[] = []): Promise<T[]> {
    const p = getDbPool()
    const [rows] = await p.execute(sql, values)
    return rows as T[]
  },
  async execute(sql: string, values: any[] = []): Promise<any> {
    const p = getDbPool()
    const [result] = await p.execute(sql, values)
    return result
  },
}
