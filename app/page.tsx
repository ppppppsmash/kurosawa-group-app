"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { MeetingList } from "@/components/meeting-list"
import { MeetingDetail } from "@/components/meeting-detail"
import { CreateMeetingDialog } from "@/components/create-meeting-dialog"
import { toast } from "sonner"

export type AgendaItem = {
  id: string
  title: string
  duration: number
  completed: boolean
}

export type Issue = {
  id: string
  title: string
  status: "open" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  assignee?: string
}

export type Meeting = {
  id: string
  title: string
  date: string
  time: string
  description: string
  agenda: AgendaItem[]
  issues: Issue[]
  notes: string
}

export default function MeetingApp() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId)

  // 初期ロード時にミーティング一覧を取得
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/meetings")

        if (!response.ok) {
          throw new Error("ミーティングの取得に失敗しました")
        }

        const data = await response.json()
        setMeetings(data)

        // 最初のミーティングを選択
        if (data.length > 0 && !selectedMeetingId) {
          setSelectedMeetingId(data[0].id)
        }
      } catch (error) {
        console.error("ミーティング取得エラー:", error)
        toast.error(error instanceof Error ? error.message : "ミーティングの取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  const handleCreateMeeting = async (newMeeting: Omit<Meeting, "id" | "agenda" | "issues" | "notes">) => {
    setIsCreating(true)
    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMeeting),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "ミーティングの作成に失敗しました")
      }

      const createdMeeting = await response.json()
      
      // データベースから返されたMeetingをフロントエンドの型に変換
      const meeting: Meeting = {
        ...createdMeeting,
        agenda: createdMeeting.agenda || [],
        issues: createdMeeting.issues || [],
        notes: createdMeeting.notes || "",
      }

      setMeetings([...meetings, meeting])
      setSelectedMeetingId(meeting.id)
      setIsCreateDialogOpen(false)
      toast.success("ミーティングを作成しました")
    } catch (error) {
      console.error("ミーティング作成エラー:", error)
      toast.error(error instanceof Error ? error.message : "ミーティングの作成に失敗しました")
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateMeeting = async (updatedMeeting: Meeting) => {
    try {
      console.log("handleUpdateMeeting呼び出し:", updatedMeeting)
      
      // ローカルステートを即座に更新（楽観的更新）
      setMeetings((prevMeetings) => prevMeetings.map((m) => (m.id === updatedMeeting.id ? updatedMeeting : m)))

      // データベースに保存
      const requestBody = {
        notes: updatedMeeting.notes,
        agenda: updatedMeeting.agenda,
        issues: updatedMeeting.issues,
      }
      console.log("APIリクエスト送信:", requestBody)
      console.log("アジェンダの詳細:", {
        agenda: updatedMeeting.agenda,
        agendaLength: updatedMeeting.agenda?.length,
        agendaType: typeof updatedMeeting.agenda,
        isArray: Array.isArray(updatedMeeting.agenda),
      })

      const response = await fetch(`/api/meetings/${updatedMeeting.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("APIエラーレスポンス:", error)
        throw new Error(error.error || "ミーティングの更新に失敗しました")
      }

      const updatedData = await response.json()
      console.log("APIレスポンス:", updatedData)
      
      // データベースから返されたデータでステートを更新
      const meeting: Meeting = {
        ...updatedData,
        agenda: updatedData.agenda || [],
        issues: updatedData.issues || [],
        notes: updatedData.notes || "",
      }

      setMeetings((prevMeetings) => prevMeetings.map((m) => (m.id === meeting.id ? meeting : m)))
      toast.success("更新しました")
    } catch (error) {
      console.error("ミーティング更新エラー:", error)
      toast.error(error instanceof Error ? error.message : "ミーティングの更新に失敗しました")
      
      // エラー時はデータを再取得
      try {
        const response = await fetch("/api/meetings")
        if (response.ok) {
          const data = await response.json()
          setMeetings(data)
        }
      } catch (fetchError) {
        console.error("データ再取得エラー:", fetchError)
      }
    }
  }

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter((m) => m.id !== id))
    if (selectedMeetingId === id) {
      setSelectedMeetingId(meetings[0]?.id || null)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onCreateMeeting={() => setIsCreateDialogOpen(true)} />
      <MeetingList meetings={meetings} selectedMeetingId={selectedMeetingId} onSelectMeeting={setSelectedMeetingId} />
      <MeetingDetail
        meeting={selectedMeeting}
        onUpdateMeeting={handleUpdateMeeting}
        onDeleteMeeting={handleDeleteMeeting}
      />
      <CreateMeetingDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateMeeting={handleCreateMeeting}
        isLoading={isCreating}
      />
    </div>
  )
}
