const API_KEY = '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';
const MODEL = 'google/gemini-2.0-flash-lite-preview-02-05:free';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function test() {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://medhelp.ai',
        'X-Title': 'aidAR Diagnostic Console',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: 'test' }]
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.text();
    console.log("Response:", data);
  } catch(e) {
    console.error(e);
  }
}
test();
