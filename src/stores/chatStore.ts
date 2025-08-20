import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatConfig {
  responseStyle: 'formal' | 'casual' | 'academic' | 'practical';
  detailLevel: 'brief' | 'moderate' | 'comprehensive';
  includeExamples: boolean;
  includeCaseLaw: boolean;
  includeProcedures: boolean;
  language: 'english' | 'swahili' | 'bilingual';
  focusArea: 'constitutional' | 'criminal' | 'civil' | 'family' | 'land' | 'employment' | 'all';
  responseLength: 'short' | 'medium' | 'long';
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  caseReferences?: string[];
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadedAt: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  config: ChatConfig;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  config: ChatConfig;
  showSettings: boolean;
  searchQuery: string;
  
  // Actions
  createNewChat: () => string;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
  updateConfig: (config: Partial<ChatConfig>) => void;
  resetConfig: () => void;
  toggleSettings: () => void;
  addAttachment: (sessionId: string, messageId: string, attachment: FileAttachment) => void;
  removeAttachment: (sessionId: string, messageId: string, attachmentId: string) => void;
  setSearchQuery: (query: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
}

const defaultConfig: ChatConfig = {
  responseStyle: 'formal',
  detailLevel: 'moderate',
  includeExamples: true,
  includeCaseLaw: true,
  includeProcedures: true,
  language: 'english',
  focusArea: 'all',
  responseLength: 'medium'
};

// Helper function to convert dates safely
const convertDates = (session: ChatSession): ChatSession => ({
  ...session,
  createdAt: new Date(session.createdAt),
  updatedAt: new Date(session.updatedAt),
  messages: session.messages.map(msg => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
    attachments: msg.attachments?.map(att => ({
      ...att,
      uploadedAt: new Date(att.uploadedAt)
    }))
  }))
});

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      config: defaultConfig,
      showSettings: false,
      searchQuery: '',

      createNewChat: () => {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          config: { ...get().config }
        };
        
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentSessionId: newSession.id
        }));
        
        return newSession.id;
      },

      setCurrentSession: (sessionId) => 
        set({ currentSessionId: sessionId }),

      addMessage: (sessionId, message) => 
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, message],
                  updatedAt: new Date(),
                  title: session.messages.length === 0 && message.role === 'user' 
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : session.title
                }
              : session
          )
        })),

      setLoading: (loading) => 
        set({ isLoading: loading }),

      clearSession: (sessionId) => 
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, messages: [], updatedAt: new Date() }
              : session
          )
        })),

      deleteSession: (sessionId) => 
        set((state) => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId);
          const newCurrentSessionId = state.currentSessionId === sessionId 
            ? (newSessions.length > 0 ? newSessions[0].id : null)
            : state.currentSessionId;
          
          return {
            sessions: newSessions,
            currentSessionId: newCurrentSessionId
          };
        }),

      updateConfig: (newConfig) => 
        set((state) => ({ 
          config: { ...state.config, ...newConfig } 
        })),

      resetConfig: () => 
        set({ config: defaultConfig }),

      toggleSettings: () => 
        set((state) => ({ 
          showSettings: !state.showSettings 
        })),

      addAttachment: (sessionId, messageId, attachment) =>
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map(msg =>
                    msg.id === messageId
                      ? { ...msg, attachments: [...(msg.attachments || []), attachment] }
                      : msg
                  )
                }
              : session
          )
        })),

      removeAttachment: (sessionId, messageId, attachmentId) =>
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map(msg =>
                    msg.id === messageId
                      ? { ...msg, attachments: msg.attachments?.filter(att => att.id !== attachmentId) }
                      : msg
                  )
                }
              : session
          )
        })),

      setSearchQuery: (query) => 
        set({ searchQuery: query }),

      updateSessionTitle: (sessionId, title) =>
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, title }
              : session
          )
        })),

      renameSession: (sessionId, newTitle) =>
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, title: newTitle.trim() || 'Untitled Chat' }
              : session
          )
        })),
    }),
    {
      name: 'kenya-law-ai-chat',
      partialize: (state) => ({ 
        sessions: state.sessions, 
        config: state.config,
        currentSessionId: state.currentSessionId
      }),
    }
  )
);

// Selector functions for components to use
export const useCurrentSession = () => {
  const { sessions, currentSessionId } = useChatStore();
  const session = sessions.find(s => s.id === currentSessionId);
  return session ? convertDates(session) : null;
};

export const useFilteredSessions = () => {
  const { sessions, searchQuery } = useChatStore();
  if (!searchQuery.trim()) {
    return sessions.map(convertDates);
  }
  
  const query = searchQuery.toLowerCase();
  return sessions.filter(session =>
    session.title.toLowerCase().includes(query) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(query)
    )
  ).map(convertDates);
};

// More specific selectors to avoid unnecessary re-renders
export const useCurrentSessionId = () => useChatStore(state => state.currentSessionId);
export const useSessions = () => useChatStore(state => state.sessions);
export const useSearchQuery = () => useChatStore(state => state.searchQuery);
export const useIsLoading = () => useChatStore(state => state.isLoading);
export const useShowSettings = () => useChatStore(state => state.showSettings);
export const useConfig = () => useChatStore(state => state.config);

// Selector for current session messages count (for scroll effect)
export const useCurrentSessionMessagesCount = () => {
  const { sessions, currentSessionId } = useChatStore();
  const session = sessions.find(s => s.id === currentSessionId);
  return session?.messages.length || 0;
};

// Selector for current session messages (for display)
export const useCurrentSessionMessages = () => {
  const { sessions, currentSessionId } = useChatStore();
  const session = sessions.find(s => s.id === currentSessionId);
  if (!session) return [];
  
  return session.messages.map(msg => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
    attachments: msg.attachments?.map(att => ({
      ...att,
      uploadedAt: new Date(att.uploadedAt)
    }))
  }));
};
