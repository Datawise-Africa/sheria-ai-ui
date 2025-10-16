import { type ChatConfig } from '../stores/chatStore';
import {sheriaAPI} from "@/lib/axios.ts";

interface ChatResponse {
  message: string;
  caseReferences?: string[];
  confidence?: number;
}

export const chatService = {
  async sendMessage(message: string, config?: ChatConfig): Promise<ChatResponse> {
    // Simulate API delay
      const resp = await sheriaAPI.post<{response:string}>('gpt/sheria-ai/', {'query': message, config})
      console.log(resp.data)
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
        message: resp.data.response,
        caseReferences: ['Constitution of Kenya (2010)', 'Article 255 - Amendment of Constitution'],
        confidence: 0.95
      };
    }

    if (lowerMessage.includes('court') || lowerMessage.includes('judiciary')) {
//       let response = `${responseStyle}The Judiciary of Kenya is established under Chapter 10 of the Constitution. The court system includes:${languageNote}

// 1. **Supreme Court** - Highest court, handles constitutional matters and appeals
// 2. **Court of Appeal** - Hears appeals from High Court decisions  
// 3. **High Court** - Original jurisdiction over constitutional and civil matters
// 4. **Magistrate Courts** - Handle criminal and civil cases
// 5. **Specialized Courts** - Employment, Environment, Land, etc.`;

//       if (config?.includeProcedures) {
//         response += '\n\n**Court Procedures:**\n- File case through e-filing system\n- Pay required court fees\n- Serve documents to other parties\n- Attend pre-trial conferences';
//       }

//       return {
//         message: response,
//         caseReferences: ['Constitution Chapter 10', 'Judiciary Act 2011'],
//         confidence: 0.92
//       };
//     }

//     if (lowerMessage.includes('criminal') || lowerMessage.includes('offence')) {
//       let response = `${responseStyle}Criminal law in Kenya is primarily governed by the Penal Code (Cap. 63) and various statutes. Key aspects include:${languageNote}

// **General Principles:**
// - Presumption of innocence until proven guilty
// - Burden of proof lies with the prosecution
// - Right to legal representation
// - Right to remain silent`;

//       if (config?.includeExamples) {
//         response += '\n\n**Common Offences:**\n- Theft and robbery\n- Assault and bodily harm\n- Fraud and economic crimes\n- Drug-related offences';
//       }

//       if (config?.includeProcedures) {
//         response += '\n\n**Criminal Procedure:**\n1. Arrest and detention\n2. Charge and plea\n3. Trial and evidence\n4. Judgment and sentencing';
//       }

      return {
        message: resp.data.response,
        caseReferences: ['Penal Code Cap. 63', 'Criminal Procedure Code Cap. 75'],
        confidence: 0.89
      };
    }

    // Default response
//     let response = `${responseStyle}Thank you for your question about Kenyan law. I'm here to help you understand legal concepts, procedures, and find relevant information.${languageNote}

// To provide you with the most accurate and helpful response, could you please:
// 1. Be more specific about your legal question
// 2. Mention if you're looking for information about a particular area of law
// 3. Specify if you need information about court procedures, legal documents, or general legal principles`;

//     if (config?.includeExamples) {
//       response += '\n\n**I can help with topics like:**\n- Constitutional law and rights\n- Criminal law and procedure\n- Civil law and contracts\n- Family law and inheritance\n- Land law and property rights';
//     }

    return {
      message: resp.data.response,
      caseReferences: [],
      confidence: 0.75
    };
  }
};
