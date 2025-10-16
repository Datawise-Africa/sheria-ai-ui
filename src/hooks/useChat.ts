/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';

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

interface ChatResponse {
  message: string;
  caseReferences?: string[];
  confidence?: number;
}

const STORAGE_KEY = 'kenya-law-ai-chat-history';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          attachments: msg.attachments?.map((att: any) => ({
            ...att,
            uploadedAt: new Date(att.uploadedAt)
          })) || []
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback(async (content: string, config?: ChatConfig, attachments?: File[]) => {
    if (!content.trim()) return;

    // Process attachments
    const processedAttachments: FileAttachment[] = attachments?.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date()
    })) || [];

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      attachments: processedAttachments
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Mock API call - replace with actual API endpoint
      const response = await mockChatAPI(content, config);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date(),
        caseReferences: response.caseReferences,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const exportHistory = useCallback(() => {
    const chatData = {
      exportDate: new Date().toISOString(),
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
        attachments: msg.attachments?.map(att => ({
          ...att,
          uploadedAt: att.uploadedAt.toISOString()
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kenya-law-ai-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages]);

  const removeAttachment = useCallback((messageId: string, attachmentId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, attachments: msg.attachments?.filter(att => att.id !== attachmentId) }
        : msg
    ));
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    clearHistory,
    exportHistory,
    removeAttachment,
  };
};

// Mock API function - replace with actual API call
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockChatAPI = async (message: string, _config?: ChatConfig): Promise<ChatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const lowerMessage = message.toLowerCase();
  
  // Apply configuration to responses
  // let responseStyle = '';
  // let detailLevel = '';
  // let languageNote = '';
  
  // if (config) {
  //   responseStyle = `[${config.responseStyle} style] `;
  //   detailLevel = `[${config.detailLevel} detail] `;
  //   if (config.language === 'swahili') {
  //     languageNote = '\n\n*Jibu hili limeandikwa kwa Kiswahili*';
  //   } else if (config.language === 'bilingual') {
  //     languageNote = '\n\n*This response is provided in both English and Swahili*';
  //   }
  // }
  
  if (lowerMessage.includes('constitution') || lowerMessage.includes('constitutional')) {
    // let response = `${responseStyle}The Constitution of Kenya (2010) is the supreme law of the Republic. It establishes the structure and powers of the government, guarantees fundamental rights and freedoms, and provides for the separation of powers between the Executive, Legislature, and Judiciary.${languageNote}`;

    // if (config?.includeExamples) {
    //   response += '\n\n**Examples of Constitutional Rights:**\n- Right to life and liberty\n- Freedom of expression and media\n- Right to fair trial\n- Protection from discrimination';
    // }

    // if (config?.includeCaseLaw) {
    //   response += '\n\n**Relevant Case Law:**\n- Republic v. Independent Electoral and Boundaries Commission (2017)\n- Katiba Institute v. President of Kenya (2017)';
    // }

    // if (config?.includeProcedures) {
    //   response += '\n\n**Constitutional Amendment Procedure:**\n1. Parliamentary approval (2/3 majority)\n2. Public participation\n3. Referendum (if affecting devolution or Bill of Rights)';
    // }

    return {
      message: '',
      caseReferences: ['Constitution of Kenya (2010)', 'Article 255 - Amendment of Constitution'],
      confidence: 0.95
    };
  }

//   if (lowerMessage.includes('court') || lowerMessage.includes('judiciary')) {
//     let response = `${responseStyle}The Judiciary of Kenya is established under Chapter 10 of the Constitution. The court system includes:${languageNote}

// 1. **Supreme Court** - Highest court, handles constitutional matters and appeals
// 2. **Court of Appeal** - Hears appeals from High Court decisions  
// 3. **High Court** - Original jurisdiction over constitutional and civil matters
// 4. **Magistrate Courts** - Handle criminal and civil cases
// 5. **Specialized Courts** - Employment, Environment, Land, etc.`;

//     if (config?.includeProcedures) {
//       response += '\n\n**Court Procedures:**\n- File case through e-filing system\n- Pay required court fees\n- Serve documents to other parties\n- Attend pre-trial conferences';
//     }

//     return {
//       message: response,
//       caseReferences: ['Constitution Chapter 10', 'Judiciary Act 2011'],
//       confidence: 0.92
//     };
//   }

//   if (lowerMessage.includes('criminal') || lowerMessage.includes('offence')) {
//     let response = `${responseStyle}Criminal law in Kenya is primarily governed by the Penal Code (Cap. 63) and various statutes. Key aspects include:${languageNote}

// **General Principles:**
// - Presumption of innocence until proven guilty
// - Burden of proof lies with the prosecution
// - Right to legal representation
// - Right to remain silent`;

//     if (config?.includeExamples) {
//       response += '\n\n**Common Offences:**\n- Theft and robbery\n- Assault and bodily harm\n- Fraud and economic crimes\n- Drug-related offences';
//     }

//     if (config?.includeProcedures) {
//       response += '\n\n**Criminal Procedure:**\n1. Arrest and detention\n2. Charge and plea\n3. Trial and evidence\n4. Judgment and sentencing';
//     }

//     return {
//       message: response,
//       caseReferences: ['Penal Code Cap. 63', 'Criminal Procedure Code Cap. 75'],
//       confidence: 0.89
//     };
//   }

//   // Default response
//   let response = `${responseStyle}Thank you for your question about Kenyan law. I'm here to help you understand legal concepts, procedures, and find relevant information.${languageNote}

// To provide you with the most accurate and helpful response, could you please:
// 1. Be more specific about your legal question
// 2. Mention if you're looking for information about a particular area of law
// 3. Specify if you need information about court procedures, legal documents, or general legal principles`;

//   if (config?.includeExamples) {
//     response += '\n\n**I can help with topics like:**\n- Constitutional law and rights\n- Criminal law and procedure\n- Civil law and contracts\n- Family law and inheritance\n- Land law and property rights';
//   }

  return {
    message: '',
    caseReferences: [],
    confidence: 0.75
  };
};
