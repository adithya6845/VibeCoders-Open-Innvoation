// ============================================
// Chatbot UI Controller
// ============================================
import { initChatbot, handleUserInput, type ChatMessage } from './diagnostic-engine';

let messagesContainer: HTMLElement;
let inputField: HTMLInputElement;
let sendButton: HTMLElement;

export function initChatbotUI() {
  messagesContainer = document.getElementById('doctor-messages')!;
  inputField = document.getElementById('doctor-input') as HTMLInputElement;
  sendButton = document.getElementById('doctor-send')!;

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Initialize chatbot engine
  initChatbot(renderMessage);
}

function sendMessage() {
  const text = inputField.value.trim();
  if (!text) return;
  inputField.value = '';
  handleUserInput(text);
}

function renderMessage(msg: ChatMessage) {
  appendMessage(msg);
}



function appendMessage(msg: ChatMessage) {
  const div = document.createElement('div');

  if (msg.role === 'system') {
    div.className = 'msg system';
    div.innerHTML = `<span class="ai-badge">SYSTEM</span>${formatText(msg.text)}`;
  } else if (msg.role === 'bot') {
    div.className = 'msg ai';
    let html = `<span class="ai-badge">MED-AI v2</span>${formatText(msg.text)}`;

    if (msg.disclaimer) {
      html += `<div class="msg-disclaimer" style="margin-top:8px;font-size:0.7rem;color:rgba(255,255,255,0.4)">${msg.disclaimer}</div>`;
    }
    if (msg.isRedFlag) {
       div.style.border = '1px solid rgba(231,76,60,0.5)';
       div.style.boxShadow = '0 0 15px rgba(231,76,60,0.2)';
    }

    div.innerHTML = html;
  } else {
    div.className = 'msg user';
    div.textContent = msg.text;
  }

  messagesContainer.appendChild(div);

  // Quick replies
  if (msg.quickReplies && msg.quickReplies.length > 0) {
    const qrDiv = document.createElement('div');
    qrDiv.className = 'quick-replies';
    msg.quickReplies.forEach((qr) => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = qr.label;
      btn.addEventListener('click', () => {
        // Remove the quick-reply buttons
        qrDiv.remove();
        handleUserInput(qr.value);
      });
      qrDiv.appendChild(btn);
    });
    messagesContainer.appendChild(qrDiv);
  }

  scrollToBottom();
}

function formatText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '&bull; ');
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}
