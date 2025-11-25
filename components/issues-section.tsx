"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Meeting, Issue } from "@/app/page"

interface IssuesSectionProps {
  meeting: Meeting
  onUpdateMeeting: (meeting: Meeting) => void
}

const statusConfig = {
  open: { label: "未着手", icon: Circle, color: "text-muted-foreground" },
  "in-progress": { label: "進行中", icon: AlertCircle, color: "text-chart-3" },
  resolved: { label: "解決済", icon: CheckCircle2, color: "text-primary" },
}

const priorityConfig = {
  low: { label: "低", color: "bg-muted text-muted-foreground" },
  medium: { label: "中", color: "bg-chart-3/20 text-chart-3" },
  high: { label: "高", color: "bg-destructive/20 text-destructive" },
}

export function IssuesSection({ meeting, onUpdateMeeting }: IssuesSectionProps) {
  const [newIssueTitle, setNewIssueTitle] = useState("")
  const [newIssuePriority, setNewIssuePriority] = useState<Issue["priority"]>("medium")
  const [newIssueAssignee, setNewIssueAssignee] = useState("")

  const handleAddIssue = () => {
    if (!newIssueTitle.trim()) return

    const newIssue: Issue = {
      id: Date.now().toString(),
      title: newIssueTitle,
      status: "open",
      priority: newIssuePriority,
      assignee: newIssueAssignee || undefined,
    }

    onUpdateMeeting({
      ...meeting,
      issues: [...meeting.issues, newIssue],
    })

    setNewIssueTitle("")
    setNewIssuePriority("medium")
    setNewIssueAssignee("")
  }

  const handleUpdateIssueStatus = (issueId: string, status: Issue["status"]) => {
    onUpdateMeeting({
      ...meeting,
      issues: meeting.issues.map((i) => (i.id === issueId ? { ...i, status } : i)),
    })
  }

  const handleDeleteIssue = (issueId: string) => {
    onUpdateMeeting({
      ...meeting,
      issues: meeting.issues.filter((i) => i.id !== issueId),
    })
  }

  const openIssues = meeting.issues.filter((i) => i.status !== "resolved").length
  const resolvedIssues = meeting.issues.filter((i) => i.status === "resolved").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">課題</h3>
        <div className="text-sm text-muted-foreground">
          未解決: {openIssues} / 解決済: {resolvedIssues}
        </div>
      </div>

      <div className="space-y-2">
        {meeting.issues.map((issue) => {
          const StatusIcon = statusConfig[issue.status].icon

          return (
            <div
              key={issue.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border border-border bg-card",
                issue.status === "resolved" && "opacity-60",
              )}
            >
              <Select
                value={issue.status}
                onValueChange={(value: Issue["status"]) => handleUpdateIssueStatus(issue.id, value)}
              >
                <SelectTrigger className="w-auto border-0 p-0 h-auto bg-transparent [&>svg]:hidden">
                  <StatusIcon className={cn("h-5 w-5", statusConfig[issue.status].color)} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="open">未着手</SelectItem>
                  <SelectItem value="in-progress">進行中</SelectItem>
                  <SelectItem value="resolved">解決済</SelectItem>
                </SelectContent>
              </Select>

              <span className={cn("flex-1 text-foreground", issue.status === "resolved" && "line-through")}>
                {issue.title}
              </span>

              {issue.assignee && (
                <span className="text-sm text-muted-foreground px-2 py-0.5 bg-secondary rounded">{issue.assignee}</span>
              )}

              <span className={cn("text-xs px-2 py-0.5 rounded", priorityConfig[issue.priority].color)}>
                {priorityConfig[issue.priority].label}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteIssue(issue.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </div>

      <div className="p-3 rounded-lg border border-dashed border-border bg-secondary/50 space-y-3">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="新しい課題を追加..."
            className="flex-1 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            value={newIssueTitle}
            onChange={(e) => setNewIssueTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddIssue()}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={newIssuePriority} onValueChange={(v: Issue["priority"]) => setNewIssuePriority(v)}>
            <SelectTrigger className="w-24 h-8 bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="担当者"
            className="w-32 h-8 bg-input border-border text-foreground placeholder:text-muted-foreground"
            value={newIssueAssignee}
            onChange={(e) => setNewIssueAssignee(e.target.value)}
          />
          <Button size="sm" onClick={handleAddIssue} disabled={!newIssueTitle.trim()}>
            追加
          </Button>
        </div>
      </div>
    </div>
  )
}
