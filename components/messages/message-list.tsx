"use client";

import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Archive, Trash2, ArchiveRestore } from "lucide-react";
import type { Conversation } from "@/types/messages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MessageListProps {
  conversations: Conversation[];
  selectedId?: string | null;
  onSelect: (conversation: Conversation) => void;
  onDelete: (conversationId: string) => void;
  onArchive: (conversationId: string) => void;
  isDeleting?: boolean;
}

export function MessageList({
  conversations,
  selectedId,
  onSelect,
  onDelete,
  onArchive,
  isDeleting = false,
}: MessageListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      onDelete(conversationToDelete);
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const handleArchiveClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(conversationId);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground">No conversations found</div>
          <div className="text-sm text-muted-foreground">
            Start a conversation to see it here
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {conversations.map((conversation) => {
            const isSelected = conversation.id === selectedId;
            const isArchived = conversation.status === "archived";

            return (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors group",
                  isSelected && "bg-muted",
                  isArchived && "opacity-60"
                )}
                onClick={() => onSelect(conversation)}
              >
                {/* Avatar */}
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage
                    src={conversation.customer.avatar || "/placeholder.svg"}
                    alt={conversation.customer.name}
                  />
                  <AvatarFallback>
                    {conversation.customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">
                      {conversation.customer.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {conversation.unreadCount > 0 && (
                        <Badge
                          variant="default"
                          className="h-5 min-w-5 text-xs"
                        >
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      {isArchived && (
                        <Archive className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          conversation.lastMessage.timestamp,
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        "text-sm truncate",
                        conversation.unreadCount > 0
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {conversation.lastMessage.content}
                    </p>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) =>
                            handleArchiveClick(conversation.id, e)
                          }
                        >
                          {isArchived ? (
                            <>
                              <ArchiveRestore className="h-4 w-4 mr-2" />
                              Unarchive
                            </>
                          ) : (
                            <>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteClick(conversation.id, e)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
