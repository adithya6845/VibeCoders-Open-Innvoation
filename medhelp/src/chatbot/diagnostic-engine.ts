import { SYMPTOM_DATA, DISCLAIMER } from './symptom-data';

const CONFIG = {
  API_KEY: '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',
  MODEL: 'google/gemini-2.0-flash-lite-preview-02-05:free',
  BASE_URL: 'https://openrouter.ai/api/v1/chat/completions'
};

export interface ChatMessage {
  role: 'bot' | 'user' | 'system';
  text: string;
  quickReplies?: { label: string; value: string }[];
  isRedFlag?: boolean;
  disclaimer?: string;
}

let onMessageCb: (msg: ChatMessage) => void;
let conversationHistory: { role: string; content: string }[] = [];

export function initChatbot(onMessage: (msg: ChatMessage) => void) {
  onMessageCb = onMessage;
  
  setTimeout(() => {
    onMessageCb({
      role: 'bot',
      text: "Hello! I am your AI Medical Assistant (powered by AIDAR Clinical Engine). How can I help you today? Please describe your symptoms or situation.",
      disclaimer: DISCLAIMER
    });
  }, 500);
}

export async function handleUserInput(input: string) {
  // Echo user message
  onMessageCb({ role: 'user', text: input });
  conversationHistory.push({ role: 'user', content: input });

  try {
    const response = await fetch(CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
        'HTTP-Referer': 'https://medhelp.ai',
        'X-Title': 'aidAR Diagnostic Console',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a professional medical diagnostic AI for the aidAR platform. 
            Behavioral Guidelines:
            1. Analyze symptoms accurately but always include a clear medical disclaimer.
            2. If life-threatening symptoms are detected (chest pain, stroke signs, difficulty breathing), immediately recommend calling emergency services.
            3. Provide structured advice: Questions to consider, potential common causes, and recommended next steps (OTC, Home Care, or Doctor Visit).
            4. Keep responses concise and clinical.
            5. Current symptom database context for reference: ${JSON.stringify(SYMPTOM_DATA)}`
          },
          ...conversationHistory
        ],
        temperature: 0.7
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      const data = await response.json();
      const botReply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "No response content from AI.";
      conversationHistory.push({ role: 'assistant', content: botReply });
      
      onMessageCb({ 
        role: 'bot', 
        text: botReply,
        disclaimer: DISCLAIMER
      });
      return;
    } else {
      const errText = await response.text();
      console.error("OpenRouter API Error Response:", errText);
      onMessageCb({
          role: 'system',
          text: `[DEBUG] API Status: ${response.status}. Error: ${errText.substring(0, 150)}... falling back to local engine.`
      });
    }
  } catch (error: any) {
    console.error("AI API Error:", error);
    onMessageCb({
          role: 'system',
          text: `[DEBUG] Fetch Error: ${error.message}... falling back to local engine.`
      });
  }

  // FALLBACK: Local Diagnostic Logic (if API fails)
  const reply = getLocalDiagnosticResponse(input);
  setTimeout(() => {
    onMessageCb(reply);
  }, 600);
}

function getLocalDiagnosticResponse(input: string): ChatMessage {
  const lowerInput = input.toLowerCase();
  let bestMatch: any = null;
  let highestScore = 0;

  for (const key in SYMPTOM_DATA) {
    const category = SYMPTOM_DATA[key];
    let score = 0;
    
    // Make matching smarter (handle typos like "feaver" -> matches "fever" via partials)
    category.keywords.forEach(word => {
      const lowerWord = word.toLowerCase();
      // Exact match gets high score
      if (lowerInput.includes(lowerWord)) score += 3;
      // Partial match (e.g. 'feav' includes 'fev' mostly - let's check for stems)
      else if (lowerWord.length > 4 && lowerInput.includes(lowerWord.substring(0, 4))) score += 1;
    });
    
    // Custom spelling adjustments
    if (key === 'fever' && (lowerInput.includes('feav') || lowerInput.includes('temp'))) score += 3;
    if (key === 'pain' && (lowerInput.includes('hurts') || lowerInput.includes('ache') || lowerInput.includes('piles'))) score += 3;
    if (key === 'digestive' && (lowerInput.includes('stomach') || lowerInput.includes('belly') || lowerInput.includes('puke'))) score += 3;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = category;
    }
  }

  if (bestMatch && highestScore > 0) {
    let responseText = `### Analyzing symptoms for: **${bestMatch.name}** (Offline Mode)\n\n`;
    
    const foundRedFlags = bestMatch.redFlagCombinations.find((combo: string[]) => 
      combo.every(word => lowerInput.includes(word))
    );

    if (foundRedFlags) {
      return {
        role: 'bot',
        text: `⚠️ **CRITICAL ALERT**\n\n${bestMatch.recommendations.severe.action}`,
        isRedFlag: true,
        disclaimer: DISCLAIMER
      };
    }

    responseText += `It sounds like you're experiencing ${bestMatch.name.toLowerCase()}. Here are some clarifying questions:\n\n`;
    bestMatch.questions.forEach((q: string) => responseText += `• ${q}\n`);
    
    responseText += `\n**Recommendations:**\n`;
    responseText += `*   **Self-Care:** ${bestMatch.recommendations.mild.homeCare.join(', ')}\n`;
    responseText += `*   **OTC Relief:** ${bestMatch.recommendations.mild.otc.join(', ')}\n`;

    return {
      role: 'bot',
      text: responseText,
      disclaimer: DISCLAIMER,
      quickReplies: [
        { label: "Check another symptom", value: "I have other symptoms" },
        { label: "Talk to emergency contact", value: "Emergency" }
      ]
    };
  }

  return {
    role: 'bot',
    text: "I'm not exactly sure what's going on, but let's try to figure it out. Could you try using simpler words? Are you feeling any pain, fever, stomach issues, or difficulty breathing? (Connected to Offline Fallback Engine)",
    disclaimer: DISCLAIMER
  };
}
