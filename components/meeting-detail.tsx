"use client"

import { useState } from "react"
import { Calendar, Clock, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AgendaSection } from "@/components/agenda-section"
import { IssuesSection } from "@/components/issues-section"
import type { Meeting } from "@/app/page"

interface MeetingDetailProps {
  meeting: Meeting | undefined
  onUpdateMeeting: (meeting: Meeting) => void
  onDeleteMeeting: (id: string) => void
}

export function MeetingDetail({ meeting, onUpdateMeeting, onDeleteMeeting }: MeetingDetailProps) {
  const [activeTab, setActiveTab] = useState("agenda")

  if (!meeting) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-muted-foreground">ミーティングを選択してください</p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })
  }

  const handleNotesChange = (notes: string) => {
    onUpdateMeeting({ ...meeting, notes })
  }

  return (
    <div className="flex-1 bg-background flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{meeting.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(meeting.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {meeting.time}
              </span>
            </div>
            {meeting.description && <p className="mt-3 text-muted-foreground text-sm">{meeting.description}</p>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => onDeleteMeeting(meeting.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-4">
          <TabsList className="bg-secondary">
            <TabsTrigger
              value="agenda"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              アジェンダ
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              課題
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              メモ
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TabsContent value="agenda" className="mt-0 h-full">
            <AgendaSection meeting={meeting} onUpdateMeeting={onUpdateMeeting} />
          </TabsContent>

          <TabsContent value="issues" className="mt-0 h-full">
            <IssuesSection meeting={meeting} onUpdateMeeting={onUpdateMeeting} />
          </TabsContent>

          <TabsContent value="notes" className="mt-0 h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">ミーティングメモ</h3>
              </div>
              <Textarea
                placeholder="ミーティングのメモを入力..."
                className="min-h-[300px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                value={meeting.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
