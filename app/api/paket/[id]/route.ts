import { NextRequest, NextResponse } from 'next/server'
import { supabaseDb } from '@/lib/supabase-db'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await supabaseDb.delete('paket', id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = await supabaseDb.update('paket', id, body)
    return NextResponse.json({ success: true, data: Array.isArray(data) ? data[0] : data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
