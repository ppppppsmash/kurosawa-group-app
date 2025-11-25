import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { meetings, agendaItems, issues } from "@/lib/schema"
import { nanoid } from "nanoid"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  try {
    // すべてのミーティングを取得（新しい順）
    const allMeetings = await db.select().from(meetings).orderBy(desc(meetings.createdAt))

    // 各ミーティングのagendaItemsとissuesを取得
    const meetingsWithRelations = await Promise.all(
      allMeetings.map(async (meeting) => {
        const agenda = await db.select().from(agendaItems).where(eq(agendaItems.meetingId, meeting.id))
        const issuesList = await db.select().from(issues).where(eq(issues.meetingId, meeting.id))

        return {
          ...meeting,
          agenda: agenda.map((item) => ({
            id: item.id,
            title: item.title,
            duration: item.duration,
            completed: item.completed,
          })),
          issues: issuesList.map((issue) => ({
            id: issue.id,
            title: issue.title,
            status: issue.status,
            priority: issue.priority,
            assignee: issue.assignee || undefined,
          })),
          notes: meeting.notes || "",
        }
      })
    )

    return NextResponse.json(meetingsWithRelations)
  } catch (error) {
    console.error("ミーティング取得エラー:", error)
    return NextResponse.json(
      { error: "ミーティングの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, time, description } = body

    // バリデーション
    if (!title || !date || !time) {
      return NextResponse.json(
        { error: "タイトル、日付、時間は必須です" },
        { status: 400 }
      )
    }

    // IDを生成
    const id = nanoid()

    // データベースに保存
    const [newMeeting] = await db
      .insert(meetings)
      .values({
        id,
        title,
        date,
        time,
        description: description || "",
        notes: "",
      })
      .returning()

    return NextResponse.json(newMeeting, { status: 201 })
  } catch (error) {
    console.error("ミーティング作成エラー:", error)
    return NextResponse.json(
      { error: "ミーティングの作成に失敗しました" },
      { status: 500 }
    )
  }
}

