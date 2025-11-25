"use client"

import { Calendar, LayoutDashboard, Plus, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  onCreateMeeting: () => void
}

export function Sidebar({ onCreateMeeting }: SidebarProps) {
  return (
    <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-2">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4">
        <span className="text-primary-foreground font-bold text-lg">M</span>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={onCreateMeeting}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>新規ミーティング</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10 text-primary bg-sidebar-accent">
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>ダッシュボード</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10 text-sidebar-foreground hover:bg-sidebar-accent">
              <Calendar className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>カレンダー</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10 text-sidebar-foreground hover:bg-sidebar-accent">
              <Users className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>メンバー</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 text-sidebar-foreground hover:bg-sidebar-accent">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>設定</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
