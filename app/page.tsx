"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MeetingList } from "@/components/meeting-list"
import { MeetingDetail } from "@/components/meeting-detail"
import { CreateMeetingDialog } from "@/components/create-meeting-dialog"

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

const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "月次定例ミーティング",
    date: "2025-01-15",
    time: "10:00",
    description: "1月の月次定例ミーティングです。前月の振り返りと今月の目標設定を行います。",
    agenda: [
      { id: "a1", title: "前月の振り返り", duration: 15, completed: true },
      { id: "a2", title: "KPI進捗報告", duration: 20, completed: true },
      { id: "a3", title: "今月の目標設定", duration: 25, completed: false },
    ],
    issues: [
      { id: "i1", title: "プロジェクトAの遅延", status: "in-progress", priority: "high", assignee: "田中" },
      { id: "i2", title: "新規メンバーのオンボーディング", status: "open", priority: "medium", assignee: "佐藤" },
    ],
    notes: "次回までにプロジェクトAの進捗を確認すること。",
  },
  {
    id: "2",
    title: "プロジェクト進捗確認",
    date: "2025-01-22",
    time: "14:00",
    description: "各プロジェクトの進捗状況を確認します。",
    agenda: [
      { id: "a4", title: "プロジェクトA進捗", duration: 20, completed: false },
      { id: "a5", title: "プロジェクトB進捗", duration: 20, completed: false },
      { id: "a6", title: "リスク確認", duration: 15, completed: false },
    ],
    issues: [{ id: "i3", title: "リソース不足の対応", status: "open", priority: "high" }],
    notes: "",
  },
  {
    id: "3",
    title: "チームビルディング",
    date: "2025-02-01",
    time: "15:00",
    description: "チームの結束を高めるためのセッションです。",
    agenda: [
      { id: "a7", title: "アイスブレイク", duration: 10, completed: false },
      { id: "a8", title: "ワークショップ", duration: 45, completed: false },
      { id: "a9", title: "振り返り", duration: 15, completed: false },
    ],
    issues: [],
    notes: "",
  },
]

export default function MeetingApp() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(meetings[0]?.id || null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId)

  const handleCreateMeeting = (newMeeting: Omit<Meeting, "id" | "agenda" | "issues" | "notes">) => {
    const meeting: Meeting = {
      ...newMeeting,
      id: Date.now().toString(),
      agenda: [],
      issues: [],
      notes: "",
    }
    setMeetings([...meetings, meeting])
    setSelectedMeetingId(meeting.id)
    setIsCreateDialogOpen(false)
  }

  const handleUpdateMeeting = (updatedMeeting: Meeting) => {
    setMeetings(meetings.map((m) => (m.id === updatedMeeting.id ? updatedMeeting : m)))
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
      />
    </div>
  )
}
