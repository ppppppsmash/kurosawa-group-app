import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { meetings, agendaItems, issues } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const meetingId = resolvedParams.id
    const body = await request.json()
    const { notes, agenda, issues: issuesList } = body

    console.log("ミーティング更新リクエスト:", { meetingId, notes, agenda, issues: issuesList })

    // メモの更新
    if (notes !== undefined) {
      await db.update(meetings).set({ notes: notes || "" }).where(eq(meetings.id, meetingId))
    }

    // アジェンダの更新（既存を削除して新規追加）
    // agendaがundefinedでない場合（nullや空配列も含む）は処理する
    if (agenda !== undefined) {
      console.log("アジェンダ更新開始:", { agenda, type: typeof agenda, isArray: Array.isArray(agenda), length: agenda?.length })
      
      try {
        // 既存のアジェンダを削除
        const deleteResult = await db.delete(agendaItems).where(eq(agendaItems.meetingId, meetingId))
        console.log("既存アジェンダ削除完了:", deleteResult)
        
        // 新しいアジェンダを追加
        if (Array.isArray(agenda) && agenda.length > 0) {
          const agendaValues = agenda.map((item: any) => {
            const mapped = {
              id: String(item.id),
              meetingId: String(meetingId),
              title: String(item.title),
              duration: Number(item.duration),
              completed: Boolean(item.completed),
            }
            console.log("アジェンダアイテムマッピング:", { original: item, mapped })
            return mapped
          })
          console.log("アジェンダ追加値（全件）:", JSON.stringify(agendaValues, null, 2))
          
          try {
            const result = await db.insert(agendaItems).values(agendaValues).returning()
            console.log("アジェンダ追加成功:", result)
          } catch (insertError: any) {
            console.error("アジェンダ挿入エラー詳細:", {
              message: insertError?.message,
              code: insertError?.code,
              detail: insertError?.detail,
              constraint: insertError?.constraint,
              stack: insertError?.stack,
            })
            throw insertError
          }
        } else {
          console.log("アジェンダが空配列または配列ではない - 追加スキップ")
        }
      } catch (agendaError: any) {
        console.error("アジェンダ保存エラー詳細:", {
          message: agendaError?.message,
          code: agendaError?.code,
          detail: agendaError?.detail,
          constraint: agendaError?.constraint,
          stack: agendaError?.stack,
        })
        throw agendaError
      }
    } else {
      console.log("agendaがundefined - アジェンダ更新スキップ")
    }

    // 課題の更新（既存を削除して新規追加）
    if (issuesList !== undefined) {
      console.log("課題更新:", issuesList)
      // 既存の課題を削除
      await db.delete(issues).where(eq(issues.meetingId, meetingId))
      
      // 新しい課題を追加
      if (issuesList.length > 0) {
        const issueValues = issuesList.map((item: { id: string; title: string; status: string; priority: string; assignee?: string }) => ({
          id: item.id,
          meetingId,
          title: item.title,
          status: item.status,
          priority: item.priority,
          assignee: item.assignee || null,
        }))
        console.log("課題追加値:", issueValues)
        await db.insert(issues).values(issueValues)
      }
    }

    // 更新されたミーティングを取得
    const [updatedMeeting] = await db.select().from(meetings).where(eq(meetings.id, meetingId))
    const agendaData = await db.select().from(agendaItems).where(eq(agendaItems.meetingId, meetingId))
    const issuesData = await db.select().from(issues).where(eq(issues.meetingId, meetingId))

    const result = {
      ...updatedMeeting,
      agenda: agendaData.map((item) => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        completed: item.completed,
      })),
      issues: issuesData.map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status,
        priority: item.priority,
        assignee: item.assignee || undefined,
      })),
      notes: updatedMeeting.notes || "",
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("ミーティング更新エラー:", error)
    return NextResponse.json(
      { error: "ミーティングの更新に失敗しました" },
      { status: 500 }
    )
  }
}

