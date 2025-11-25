import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { issues } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const meetingId = resolvedParams.id
    const body = await request.json()
    const { title, priority, assignee } = body

    if (!title || !priority) {
      return NextResponse.json(
        { error: "タイトルと優先度は必須です" },
        { status: 400 }
      )
    }

    const id = nanoid()
    const [newIssue] = await db
      .insert(issues)
      .values({
        id,
        meetingId,
        title,
        status: "open",
        priority,
        assignee: assignee || null,
      })
      .returning()

    return NextResponse.json(newIssue, { status: 201 })
  } catch (error) {
    console.error("課題追加エラー:", error)
    return NextResponse.json(
      { error: "課題の追加に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const meetingId = resolvedParams.id
    const body = await request.json()
    const { issueId, status } = body

    if (issueId === undefined || status === undefined) {
      return NextResponse.json(
        { error: "課題IDとステータスは必須です" },
        { status: 400 }
      )
    }

    const [updatedIssue] = await db
      .update(issues)
      .set({ status })
      .where(eq(issues.id, issueId))
      .returning()

    return NextResponse.json(updatedIssue)
  } catch (error) {
    console.error("課題更新エラー:", error)
    return NextResponse.json(
      { error: "課題の更新に失敗しました" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const meetingId = resolvedParams.id
    const { searchParams } = new URL(request.url)
    const issueId = searchParams.get("issueId")

    if (!issueId) {
      return NextResponse.json(
        { error: "課題IDは必須です" },
        { status: 400 }
      )
    }

    await db.delete(issues).where(eq(issues.id, issueId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("課題削除エラー:", error)
    return NextResponse.json(
      { error: "課題の削除に失敗しました" },
      { status: 500 }
    )
  }
}

