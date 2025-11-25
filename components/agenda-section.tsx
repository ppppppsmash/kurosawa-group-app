"use client"

import { useState } from "react"
import { Check, Clock, GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { nanoid } from "nanoid"
import type { Meeting, AgendaItem } from "@/app/page"

interface AgendaSectionProps {
  meeting: Meeting
  onUpdateMeeting: (meeting: Meeting) => void
}

export function AgendaSection({ meeting, onUpdateMeeting }: AgendaSectionProps) {
  const [newAgendaTitle, setNewAgendaTitle] = useState("")
  const [newAgendaDuration, setNewAgendaDuration] = useState(15)

  const handleAddAgenda = () => {
    if (!newAgendaTitle.trim()) return

    const newAgenda: AgendaItem = {
      id: nanoid(),
      title: newAgendaTitle,
      duration: newAgendaDuration,
      completed: false,
    }

    onUpdateMeeting({
      ...meeting,
      agenda: [...meeting.agenda, newAgenda],
    })

    setNewAgendaTitle("")
    setNewAgendaDuration(15)
  }

  const handleToggleAgenda = (agendaId: string) => {
    onUpdateMeeting({
      ...meeting,
      agenda: meeting.agenda.map((a) => (a.id === agendaId ? { ...a, completed: !a.completed } : a)),
    })
  }

  const handleDeleteAgenda = (agendaId: string) => {
    onUpdateMeeting({
      ...meeting,
      agenda: meeting.agenda.filter((a) => a.id !== agendaId),
    })
  }

  const totalDuration = meeting.agenda.reduce((sum, a) => sum + a.duration, 0)
  const completedDuration = meeting.agenda.filter((a) => a.completed).reduce((sum, a) => sum + a.duration, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">アジェンダ</h3>
        <div className="text-sm text-muted-foreground">
          合計: {totalDuration}分 / 完了: {completedDuration}分
        </div>
      </div>

      <div className="space-y-2">
        {meeting.agenda.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border border-border bg-card transition-colors",
              item.completed && "opacity-60",
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <button
              onClick={() => handleToggleAgenda(item.id)}
              className={cn(
                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                item.completed ? "bg-primary border-primary" : "border-border hover:border-primary",
              )}
            >
              {item.completed && <Check className="h-3 w-3 text-primary-foreground" />}
            </button>
            <span className="text-muted-foreground text-sm font-mono w-6">{index + 1}.</span>
            <span className={cn("flex-1 text-foreground", item.completed && "line-through")}>{item.title}</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {item.duration}分
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteAgenda(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-border bg-secondary/50">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="新しいアジェンダを追加..."
          className="flex-1 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
          value={newAgendaTitle}
          onChange={(e) => setNewAgendaTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddAgenda()}
        />
        <div className="flex items-center gap-1">
          <Input
            type="number"
            className="w-16 h-8 text-center bg-input border-border text-foreground"
            value={newAgendaDuration}
            onChange={(e) => setNewAgendaDuration(Number(e.target.value))}
            min={1}
          />
          <span className="text-sm text-muted-foreground">分</span>
        </div>
        <Button size="sm" onClick={handleAddAgenda} disabled={!newAgendaTitle.trim()}>
          追加
        </Button>
      </div>
    </div>
  )
}
