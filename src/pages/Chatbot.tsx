import React, { useState, useRef, useEffect } from 'react';
import { Settings, Send, Paperclip, X, Download, Trash2, Edit3, Menu, MessageSquare } from 'lucide-react';
import Navigation from '../components/Navigation';
import ChatSidebar from '../components/ChatSidebar';
import ChatSettings from '../components/ChatSettings';
import { 
  useChatStore, 
  useCurrentSession, 
  useCurrentSessionMessagesCount,
  useCurrentSessionMessages,
  useIsLoading,
  useShowSettings
} from '../stores/chatStore';
import { chatService } from '../services/chatService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const Chatbot: React.FC = () => {
  const { 
    addMessage, 
    setLoading, 
    toggleSettings,
    clearSession,
    renameSession
  } = useChatStore();

  // Get specific values using optimized selectors
  const currentSession = useCurrentSession();
  const messagesCount = useCurrentSessionMessagesCount();
  const messages = useCurrentSessionMessages();
  const isLoading = useIsLoading();
  const showSettings = useShowSettings();

  const [inputValue, setInputValue] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Use messagesCount instead of currentSession?.messages for dependency
  useEffect(() => {
    scrollToBottom();
  }, [messagesCount]);

  useEffect(() => {
    if (currentSession && currentSession.messages.length === 0) {
      setInputValue('');
      setAttachments([]);
    }
  }, [currentSession?.id]); // Only depend on session ID, not the entire session object

  // Focus rename input when dialog opens
  useEffect(() => {
    if (showRenameDialog && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [showRenameDialog]);

  // Close mobile sidebar when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartRename = () => {
    if (currentSession) {
      setRenameValue(currentSession.title);
      setShowRenameDialog(true);
    }
  };

  const handleSaveRename = () => {
    if (currentSession && renameValue.trim()) {
      renameSession(currentSession.id, renameValue.trim());
      setShowRenameDialog(false);
      setRenameValue('');
    }
  };

  const handleCancelRename = () => {
    setShowRenameDialog(false);
    setRenameValue('');
  };

  const handleDeleteConfirm = () => {
    if (currentSession) {
      clearSession(currentSession.id);
      setShowDeleteDialog(false);
    }
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentSession) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user' as const,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date()
      })) : undefined
    };

    addMessage(currentSession.id, userMessage);
    setInputValue('');
    setAttachments([]);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage.content, currentSession.config);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant' as const,
        timestamp: new Date(),
        caseReferences: response.caseReferences
      };
      addMessage(currentSession.id, aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant' as const,
        timestamp: new Date()
      };
      addMessage(currentSession.id, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleExportChat = () => {
    if (!currentSession || messages.length === 0) return;
    
    const chatData = {
      title: currentSession.title,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        attachments: msg.attachments
      }))
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chat.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Welcome to Kenya Law AI
            </h2>
            <p className="text-muted-foreground mb-4">
              Start a new chat to begin asking legal questions
            </p>
            <Button onClick={() => useChatStore.getState().createNewChat()}>
              Start New Chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Desktop Sidebar - Hidden on mobile, toggleable on tablet */}
        {showSidebar && (
          <div className="hidden md:block">
            <ChatSidebar />
          </div>
        )}
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-card/50 backdrop-blur-xl border-b border-border px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileSidebar}
                  className="md:hidden h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Menu className="h-4 w-4" />
                </Button>
                
                {/* Desktop Sidebar Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hidden md:block text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
                    {currentSession.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {messagesCount} messages
                  </p>
                </div>
              </div>
              
              {/* Action Buttons - Responsive layout */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Mobile: Only essential buttons */}
                <div className="flex md:hidden space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSettings}
                    className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Desktop: All buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportChat}
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Clear</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartRename}
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Rename</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSettings}
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-background/50">
            <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-border">
                    <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <p className="text-base sm:text-lg font-medium text-foreground">Start a conversation</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask me about Kenyan law, court procedures, or specific cases
                  </p>
                  
                  {/* Mobile Quick Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <Button 
                      onClick={() => useChatStore.getState().createNewChat()}
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start New Chat
                    </Button>
                    
                    {/* Mobile: Show button to open sidebar */}
                    <Button 
                      variant="outline"
                      onClick={toggleMobileSidebar}
                      className="w-full sm:w-auto md:hidden border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Menu className="h-4 w-4 mr-2" />
                      View Past Chats
                    </Button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-foreground rounded-full flex items-center justify-center">
                            <span className="text-primary text-xs sm:text-sm font-semibold">U</span>
                          </div>
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted-foreground rounded-full flex items-center justify-center">
                            <span className="text-foreground text-xs sm:text-sm font-semibold">AI</span>
                          </div>
                        )}
                      </div>
                      
                      <div
                        className={`rounded-lg px-3 py-2 sm:px-4 sm:py-2 max-w-full ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card/50 backdrop-blur-xl border border-border text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-opacity-20 border-current">
                            <p className="text-xs opacity-70 mb-1">Attachments:</p>
                            <div className="space-y-1">
                              {message.attachments.map((att) => (
                                <div key={att.id} className="flex items-center space-x-2 text-xs">
                                  <Paperclip className="h-3 w-3" />
                                  <span className="truncate">{att.name}</span>
                                  <span className="opacity-50 flex-shrink-0">({(att.size / 1024).toFixed(1)}KB)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Case References */}
                        {message.caseReferences && message.caseReferences.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-opacity-20 border-current">
                            <p className="text-xs opacity-70 mb-1">Referenced cases:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.caseReferences.map((ref, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-primary/20 px-2 py-1 rounded"
                                >
                                  {ref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs opacity-50 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-muted-foreground rounded-full flex items-center justify-center">
                        <span className="text-foreground text-xs sm:text-sm font-semibold">AI</span>
                      </div>
                    </div>
                    <div className="bg-card/50 backdrop-blur-xl rounded-lg px-3 py-2 sm:px-4 sm:py-2 border border-border">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-muted-foreground border-t-primary rounded-full animate-spin"></div>
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-card/50 backdrop-blur-xl border-t border-border p-3 sm:p-6">
            {/* File Attachments */}
            {attachments.length > 0 && (
              <div className="mb-3 p-2 sm:p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Attachments:</p>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded border border-border">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">({(file.size / 1024).toFixed(1)}KB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="h-6 w-6 p-0 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
              <div className="flex-1 flex space-x-1 sm:space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Kenyan law, court cases, or legal procedures..."
                  disabled={isLoading}
                  className="flex-1 text-sm sm:text-base bg-background/50 border-border text-foreground placeholder-muted-foreground focus:border-primary"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="h-10 w-10 p-0 flex-shrink-0 border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="h-10 px-3 sm:px-6 flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={toggleMobileSidebar}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-xl transform transition-transform duration-300 ease-in-out border-r border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Chats</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileSidebar}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ChatSidebar />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && <ChatSettings onClose={toggleSettings} />}

      {/* Rename Dialog */}
      {showRenameDialog && (
        <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Rename Chat</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Change the name of your chat session.
              </DialogDescription>
            </DialogHeader>
            <Input
              ref={renameInputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyPress={handleRenameKeyPress}
              placeholder="Enter new chat name"
              className="mb-4 bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelRename} className="border-border text-muted-foreground hover:bg-accent hover:text-foreground">Cancel</Button>
              <Button onClick={handleSaveRename} className="bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Clear Chat</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to clear all messages from this chat? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Clear Chat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Chatbot;
