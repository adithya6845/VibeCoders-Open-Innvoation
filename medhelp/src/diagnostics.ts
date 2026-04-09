// ============================================
// Brain.ai & Skin.ai Diagnostic Engine
// ============================================

const CONFIG = {
  API_KEY: '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',
  MODEL: 'google/gemini-2.0-flash-lite-preview-02-05:free',
  BASE_URL: 'https://openrouter.ai/api/v1/chat/completions'
};

interface DiagnosticData {
  image: string | null;
  type: string | null;
}

const session: { [key: string]: DiagnosticData } = {
  brain: { image: null, type: null },
  skin: { image: null, type: null }
};

export function initDiagnostics() {
  setupModule('brain');
  setupModule('skin');
}

function setupModule(mode: 'brain' | 'skin') {
  const uploadZone = document.getElementById(`${mode}-upload`)!;
  const fileInput = document.getElementById(`${mode}-file-input`) as HTMLInputElement;
  const preview = document.getElementById(`${mode}-preview`) as HTMLImageElement;
  const analyzeBtn = document.getElementById(`analyze-${mode}-btn`) as HTMLButtonElement;

  uploadZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      session[mode].image = base64;
      session[mode].type = file.type;

      preview.src = event.target?.result as string;
      preview.style.display = 'block';
      uploadZone.querySelector('p')!.textContent = file.name;
    };
    reader.readAsDataURL(file);
  });

  analyzeBtn.addEventListener('click', () => runAnalysis(mode));
}

async function runAnalysis(mode: 'brain' | 'skin') {
  if (!session[mode].image) {
    alert('Please upload an image first.');
    return;
  }

  const resultsArea = document.getElementById(`${mode}-results`)!;
  const btn = document.getElementById(`analyze-${mode}-btn`) as HTMLButtonElement;

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'ANALYZING...';

  resultsArea.innerHTML = `
    <div class="empty-results">
        <p style="color: var(--lcd-green);">AIDAR Engine is processing multimodal data... Please wait.</p>
    </div>
  `;

  const prompt = getPrompt(mode);

  try {
    const response = await fetch(CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
        'HTTP-Referer': 'https://medhelp.ai',
        'X-Title': 'MedHelp AI',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${session[mode].type};base64,${session[mode].image}`
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    renderReport(mode, result);

  } catch (error: any) {
    console.error(error);
    resultsArea.innerHTML = `
      <div class="empty-results">
        <p style="color: var(--red-alert);">Analysis Failed: ${error.message}</p>
      </div>
    `;
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function getPrompt(mode: 'brain' | 'skin') {
  if (mode === 'brain') {
    const age = (document.getElementById('brain-age') as HTMLInputElement).value || 'Unknown';
    const sex = (document.getElementById('brain-sex') as HTMLSelectElement).value;
    const notes = (document.getElementById('brain-notes') as HTMLTextAreaElement).value || 'None';
    
    return `As a specialist neurologist, analyze this Brain MRI scan. 
      Patient: ${age}yo ${sex}. Clinical Notes: ${notes}.
      Respond ONLY in JSON format with the following keys:
      - risk_level: "Low", "Moderate", or "High"
      - summary: Executive summary (2 sentences)
      - findings: Detailed imaging observations
      - features: Array of key features identified (e.g. "Hippocampal atrophy")
      - next_steps: Array of recommendations
      - confidence: Percentage confidence string`;
  } else {
    const loc = (document.getElementById('skin-loc') as HTMLInputElement).value || 'Unknown';
    const notes = (document.getElementById('skin-notes') as HTMLTextAreaElement).value || 'None';
    
    return `As a specialist dermatologist, analyze this skin lesion image using ABCDE criteria.
      Location: ${loc}. Patient Notes: ${notes}.
      Respond ONLY in JSON format with the following keys:
      - risk_level: "Low", "Moderate", or "High"
      - summary: Overall assessment
      - analysis: Breakdown of Asymmetry, Borders, Color, Diameter
      - features: Array of morphological features (e.g. "Irregular borders")
      - next_steps: Array of clinical recommendations
      - confidence: Percentage confidence string`;
  }
}

function renderReport(mode: string, data: any) {
  const container = document.getElementById(`${mode}-results`)!;
  const riskClass = `risk-${data.risk_level.toLowerCase()}`;
  
  const extraSection = mode === 'skin' 
    ? `<h4>ABCDE Analysis</h4><p class="report-content">${data.analysis}</p>`
    : `<h4>Imaging Findings</h4><p class="report-content">${data.findings}</p>`;

  container.innerHTML = `
    <div class="report-card">
      <div class="report-header">
        <div>
          <h3 style="font-family: inherit; font-size: 1.2rem; margin-bottom: 0.2rem;">${mode.toUpperCase()} AI REPORT</h3>
          <p style="font-size: 0.75rem; color: var(--text-muted); font-family: 'DM Mono', monospace;">ID: AID-${Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
        </div>
        <div class="risk-tag ${riskClass}">${data.risk_level} Risk</div>
      </div>

      <div class="report-section">
        <h4>Assessment Summary</h4>
        <p class="report-content" style="font-size: 1.1rem; color: var(--text-primary);">${data.summary}</p>
      </div>

      <div class="report-section">
        ${extraSection}
      </div>

      <div class="report-section">
        <h4>Identified Features</h4>
        <div class="tag-cloud">
          ${(data.features || []).map((f: string) => `<span class="report-tag">${f}</span>`).join('')}
        </div>
      </div>

      <div class="report-section">
        <h4>Recommended Next Steps</h4>
        <ul style="padding-left: 1rem; font-size: 0.9rem;">
          ${(data.next_steps || []).map((s: string) => `<li style="margin-bottom: 0.4rem;">${s}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-top: 2rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.7rem; color: var(--text-muted);">
        <strong>Disclaimer:</strong> This is a decision-support AI tool (gpt-4o-mini). Accuracy: ${data.confidence}. Consultation with a licensed professional is required for medical diagnosis.
      </div>
    </div>
  `;
}
