"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Meeting } from "@/app/page"

interface CreateMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateMeeting: (meeting: Omit<Meeting, "id" | "agenda" | "issues" | "notes">) => Promise<void>
  isLoading?: boolean
}

export function CreateMeetingDialog({ open, onOpenChange, onCreateMeeting, isLoading = false }: CreateMeetingDialogProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date || !time || isLoading) return

    await onCreateMeeting({ title, date, time, description })
    setTitle("")
    setDate("")
    setTime("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle>新規登録</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {/* ミーティングの詳細を入力してください。 */}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              タイトル
            </Label>
            <Input
              id="title"
              placeholder="タイトルを入力..."
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">
                日付
              </Label>
              <Input
                id="date"
                type="date"
                className="bg-input border-border text-foreground"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-foreground">
                時間
              </Label>
              <Input
                id="time"
                type="time"
                className="bg-input border-border text-foreground"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              説明
            </Label>
            <Textarea
              id="description"
              placeholder="説明（任意）"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "作成中..." : "作成"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
