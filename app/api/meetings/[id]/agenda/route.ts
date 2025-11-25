import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { agendaItems } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const meetingId = resolvedParams.id
    const body = await request.json()
    const { title, duration } = body

    if (!title || !duration) {
      return NextResponse.json(
        { error: "タイトルと時間は必須です" },
        { status: 400 }
      )
    }

    const id = nanoid()
    const [newAgenda] = await db
      .insert(agendaItems)
      .values({
        id,
        meetingId,
        title,
        duration: Number(duration),
        completed: false,
      })
      .returning()

    return NextResponse.json(newAgenda, { status: 201 })
  } catch (error) {
    console.error("アジェンダ追加エラー:", error)
    return NextResponse.json(
      { error: "アジェンダの追加に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const meetingId = resolvedParams.id
    const body = await request.json()
    const { agendaId, completed } = body

    if (agendaId === undefined || completed === undefined) {
      return NextResponse.json(
        { error: "アジェンダIDと完了状態は必須です" },
        { status: 400 }
      )
    }

    const [updatedAgenda] = await db
      .update(agendaItems)
      .set({ completed })
      .where(eq(agendaItems.id, agendaId))
      .returning()

    return NextResponse.json(updatedAgenda)
  } catch (error) {
    console.error("アジェンダ更新エラー:", error)
    return NextResponse.json(
      { error: "アジェンダの更新に失敗しました" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const meetingId = resolvedParams.id
    const { searchParams } = new URL(request.url)
    const agendaId = searchParams.get("agendaId")

    if (!agendaId) {
      return NextResponse.json(
        { error: "アジェンダIDは必須です" },
        { status: 400 }
      )
    }

    await db.delete(agendaItems).where(eq(agendaItems.id, agendaId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("アジェンダ削除エラー:", error)
    return NextResponse.json(
      { error: "アジェンダの削除に失敗しました" },
      { status: 500 }
    )
  }
}

