import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  Edit3,
  Check,
  X,
  Home,
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useChatStore, useFilteredSessions } from '../stores/chatStore';

const ChatSidebar: React.FC = () => {
  const { 
    currentSessionId, 
    createNewChat, 
    setCurrentSession, 
    deleteSession,
    renameSession,
    searchQuery,
    setSearchQuery
  } = useChatStore();

  const filteredSessions = useFilteredSessions();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleNewChat = () => {
    const sessionId = createNewChat();
    console.log('New chat created with ID:', sessionId);
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    setShowDeleteConfirm(null);
  };

  const handleStartRename = (session: { id: string; title: string }) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editTitle.trim()) {
      renameSession(sessionId, editTitle.trim());
    }
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  const formatTimeAgo = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Unknown';
      }
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - dateObj.getTime());
      const diffSeconds = Math.floor(diffTime / 1000);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      
      if (diffSeconds < 60) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffWeeks < 4) return `${diffWeeks}w ago`;
      if (diffMonths < 12) return `${diffMonths}mo ago`;
      return `${diffYears}y ago`;
    } catch (error) {
      console.error('Error formatting time ago:', error, date);
      return 'Unknown';
    }
  };

  const formatLastMessage = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Unknown time';
      }
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - dateObj.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return dateObj.toLocaleDateString([], { weekday: 'short' });
      } else {
        return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting last message time:', error, date);
      return 'Unknown';
    }
  };

  return (
    <div className="w-full md:w-80 bg-background border-r border-border flex flex-col h-full">
      {/* Homepage Link */}
      <div className="p-3 border-b border-border">
        <Link to="/">
          <Button 
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/80 hover:bg-accent"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Homepage
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="p-3 border-b border-border">
        <Button 
          onClick={handleNewChat}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Chat</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm bg-background/50 border-border text-foreground placeholder-muted-foreground focus:border-primary"
          />
        </div>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto p-1">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground px-2">
            {searchQuery ? (
              <>
                <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats found matching "{searchQuery}"</p>
              </>
            ) : (
              <>
                <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs text-muted-foreground">Start a new conversation to get started</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSessions.map((session) => (
              <Card
                key={session.id}
                className={`cursor-pointer transition-colors hover:bg-accent/50 group ${
                  currentSessionId === session.id ? 'bg-accent border-primary/50' : 'bg-card/30 border-border/50'
                }`}
                onClick={() => handleSessionSelect(session.id)}
              >
                <CardContent className="p-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Title - Editable when editing */}
                      {editingSessionId === session.id ? (
                        <div className="flex items-center space-x-1">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveRename(session.id);
                              } else if (e.key === 'Escape') {
                                handleCancelRename();
                              }
                            }}
                            className="h-6 text-xs bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-primary hover:text-primary/80 hover:bg-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveRename(session.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelRename();
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm truncate flex-1 text-foreground">
                            {session.title}
                          </h4>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatLastMessage(session.updatedAt)}
                          </span>
                        </div>
                      )}
                      
                      {/* Message count and time ago */}
                      {editingSessionId !== session.id && (
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>{session.messages.length} message{session.messages.length !== 1 ? 's' : ''}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(session.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons - Always visible on mobile, hover on desktop */}
                    <div className="flex items-center space-x-1 ml-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(session);
                        }}
                        title="Rename chat"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive/80 hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(session.id);
                        }}
                        title="Delete chat"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sticky User Profile */}
      <div className="border-t border-border bg-background p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto text-muted-foreground hover:text-foreground hover:bg-accent">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">Premium Plan</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-card border-border" align="end" alignOffset={11}>
            <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Subscription</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Chat</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
              className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteConfirm && handleDeleteSession(showDeleteConfirm)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSidebar;
