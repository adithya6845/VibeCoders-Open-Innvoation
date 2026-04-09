import './style.css';
import { initChatbotUI } from './chatbot/chatbot-ui';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Chatbot UI controller
    // It looks for 'doctor-messages', 'doctor-input', 'doctor-send' in the DOM
    initChatbotUI();
    
    // Additional standalone initialization if needed
    console.log('AI Doctor Standalone Console Initialized');
});
