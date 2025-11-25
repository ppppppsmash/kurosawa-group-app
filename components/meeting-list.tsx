"use client"

import { Calendar, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Meeting } from "@/app/page"
import { useState } from "react"

interface MeetingListProps {
  meetings: Meeting[]
  selectedMeetingId: string | null
  onSelectMeeting: (id: string) => void
}

export function MeetingList({ meetings, selectedMeetingId, onSelectMeeting }: MeetingListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMeetings = meetings.filter((meeting) => meeting.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-3">ミーティング</h2>
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="検索..."
            className="pl-9 bg-input border-border text-foreground placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onSelectMeeting(meeting.id)}
            className={cn(
              "p-4 border-b border-border cursor-pointer transition-colors",
              selectedMeetingId === meeting.id ? "bg-accent/20 border-l-2 border-l-primary" : "hover:bg-secondary",
            )}
          >
            <h3 className="font-medium text-card-foreground mb-2 truncate">{meeting.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(meeting.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {meeting.time}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {meeting.agenda.length > 0 && (
                <span className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                  {meeting.agenda.length} アジェンダ
                </span>
              )}
              {meeting.issues.length > 0 && (
                <span className="text-xs bg-destructive/20 px-2 py-0.5 rounded text-destructive">
                  {meeting.issues.filter((i) => i.status !== "resolved").length} 課題
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
