// ============================================
// Symptom Knowledge Base
// ============================================

export interface SymptomCategory {
  name: string;
  keywords: string[];
  questions: string[];
  recommendations: {
    mild: { otc: string[]; homeCare: string[] };
    moderate: { otc: string[]; homeCare: string[]; warning: string };
    severe: { redFlag: string; action: string };
  };
  redFlagCombinations: string[][];
}

export const SYMPTOM_DATA: Record<string, SymptomCategory> = {
  fever: {
    name: 'Fever / Temperature',
    keywords: ['fever', 'temperature', 'hot', 'chills', 'sweating', 'warm', 'burning up'],
    questions: [
      'How long have you had the fever? (e.g., a few hours, 1-2 days, more than 3 days)',
      'What is your approximate temperature, if you\'ve measured it?',
      'Are you experiencing any other symptoms like a rash, stiff neck, or severe headache?',
      'Have you recently traveled or been in contact with someone who is ill?',
    ],
    recommendations: {
      mild: {
        otc: ['Acetaminophen (Tylenol) — 500mg every 6 hours', 'Ibuprofen (Advil) — 200-400mg every 6-8 hours'],
        homeCare: ['Stay hydrated — drink plenty of water, broth, or electrolyte drinks', 'Rest in a comfortable, cool environment', 'Use a lukewarm (not cold) compress on the forehead', 'Wear light clothing and keep room temperature comfortable'],
      },
      moderate: {
        otc: ['Acetaminophen 500mg every 6 hours (do not exceed 3000mg/day)', 'Ibuprofen 400mg every 6-8 hours with food'],
        homeCare: ['Monitor temperature every 4 hours', 'Increase fluid intake significantly', 'Take a lukewarm bath if temperature exceeds 102°F (39°C)', 'Watch for worsening symptoms'],
        warning: 'If fever persists beyond 3 days or exceeds 103°F (39.4°C), consult a healthcare provider.',
      },
      severe: {
        redFlag: '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
        action: 'Fever combined with stiff neck, severe headache, rash, confusion, difficulty breathing, or persistent vomiting requires emergency care. Call emergency services or go to the nearest ER immediately.',
      },
    },
    redFlagCombinations: [
      ['stiff neck', 'headache'],
      ['rash', 'confusion'],
      ['difficulty breathing'],
      ['seizure'],
      ['temperature above 104'],
    ],
  },

  pain: {
    name: 'Pain / Aches',
    keywords: ['pain', 'ache', 'sore', 'hurts', 'cramp', 'throbbing', 'sharp pain', 'dull pain'],
    questions: [
      'Where exactly is the pain located? (e.g., head, chest, abdomen, back, joints)',
      'How would you describe the pain? (sharp, dull, throbbing, burning, cramping)',
      'On a scale of 1-10, how severe is the pain?',
      'When did the pain start, and does anything make it better or worse?',
    ],
    recommendations: {
      mild: {
        otc: ['Ibuprofen (Advil) 200mg every 6-8 hours', 'Acetaminophen (Tylenol) 500mg every 6 hours', 'Topical pain relief cream for muscle aches'],
        homeCare: ['Apply ice pack for first 48 hours (20 min on, 20 min off)', 'Rest the affected area', 'Gentle stretching if musculoskeletal', 'Maintain good posture'],
      },
      moderate: {
        otc: ['Ibuprofen 400mg every 6-8 hours with food', 'Naproxen (Aleve) 220mg every 8-12 hours', 'Muscle relaxant cream for spasms'],
        homeCare: ['Alternate ice and heat therapy', 'Avoid activities that worsen pain', 'Consider over-the-counter pain patches', 'Keep a pain diary for your doctor'],
        warning: 'If pain is severe, sudden-onset, or accompanied by other symptoms, seek medical evaluation.',
      },
      severe: {
        redFlag: '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
        action: 'Sudden, severe chest pain (especially with arm/jaw pain), severe abdominal pain, worst headache of your life, or pain after trauma requires emergency care immediately.',
      },
    },
    redFlagCombinations: [
      ['chest', 'arm'],
      ['chest', 'jaw'],
      ['chest', 'breathing'],
      ['worst headache'],
      ['sudden severe'],
      ['abdomen', 'vomiting blood'],
    ],
  },

  breathing: {
    name: 'Breathing / Respiratory',
    keywords: ['breathing', 'breath', 'cough', 'wheeze', 'shortness of breath', 'congestion', 'stuffy', 'runny nose', 'sinus'],
    questions: [
      'Are you experiencing shortness of breath, or is it more of a cough/congestion?',
      'How long have you had these breathing symptoms?',
      'Do you have any known conditions like asthma, allergies, or COPD?',
      'Is the difficulty breathing worse when lying down, during exertion, or at rest?',
    ],
    recommendations: {
      mild: {
        otc: ['Guaifenesin (Mucinex) for congestion', 'Dextromethorphan for dry cough', 'Saline nasal spray for stuffy nose', 'Loratadine (Claritin) if allergy-related'],
        homeCare: ['Use a humidifier in your room', 'Inhale steam from a bowl of hot water (carefully)', 'Stay hydrated — warm liquids like honey-lemon tea help', 'Elevate your head when sleeping with an extra pillow'],
      },
      moderate: {
        otc: ['Pseudoephedrine (Sudafed) for severe congestion', 'Inhaler (if prescribed) — use as directed', 'Combination cold medicine for multiple symptoms'],
        homeCare: ['Monitor breathing rate — normal is 12-20 breaths/min', 'Avoid smoke, dust, and strong scents', 'Practice pursed-lip breathing technique', 'Track if symptoms worsen over time'],
        warning: 'If breathing difficulty increases, wheezing worsens, or lips/fingertips turn blue, seek immediate care.',
      },
      severe: {
        redFlag: '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
        action: 'Severe shortness of breath at rest, blue-tinged lips or fingertips (cyanosis), inability to speak full sentences, or choking requires emergency medical services NOW. Call 911.',
      },
    },
    redFlagCombinations: [
      ['blue lips'],
      ['cannot speak'],
      ['choking'],
      ['shortness of breath', 'chest pain'],
      ['wheezing', 'getting worse'],
    ],
  },

  injury: {
    name: 'Injury / Wound',
    keywords: ['cut', 'wound', 'bleeding', 'bruise', 'burn', 'sprain', 'fracture', 'broken', 'injury', 'fall', 'hit'],
    questions: [
      'What type of injury is it? (cut, burn, bruise, sprain, possible fracture)',
      'How did the injury happen?',
      'Is there active bleeding? If so, how much?',
      'Can you move the injured area? Is there visible deformity?',
    ],
    recommendations: {
      mild: {
        otc: ['Antibiotic ointment (Neosporin) for cuts', 'Adhesive bandages and sterile gauze', 'Ibuprofen for pain and inflammation', 'Hydrocortisone cream for minor burns'],
        homeCare: ['Clean the wound with mild soap and cool water', 'Apply direct pressure for minor bleeding', 'Use R.I.C.E. for sprains: Rest, Ice, Compression, Elevation', 'For minor burns: cool running water for 10 minutes, then aloe vera'],
      },
      moderate: {
        otc: ['Butterfly bandages for deeper cuts', 'Elastic bandage (ACE wrap) for sprains', 'Burn gel with lidocaine for pain relief'],
        homeCare: ['Keep wound clean and change dressing daily', 'Watch for signs of infection: redness, swelling, warmth, pus', 'For sprains: avoid weight-bearing for 24-48 hours', 'For burns: cover with non-stick sterile bandage'],
        warning: 'Deep wounds, burns larger than your palm, or possible fractures should be evaluated by a medical professional.',
      },
      severe: {
        redFlag: '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
        action: 'Uncontrollable bleeding, visible bone/tendon, severe burns, suspected spinal injury, or deep puncture wounds require emergency medical attention. Apply direct pressure and call 911.',
      },
    },
    redFlagCombinations: [
      ['uncontrollable bleeding'],
      ['visible bone'],
      ['cannot move'],
      ['deformity'],
      ['burn', 'large area'],
      ['head injury', 'confusion'],
    ],
  },

  digestive: {
    name: 'Digestive / Stomach',
    keywords: ['nausea', 'vomiting', 'diarrhea', 'stomach', 'appetite', 'bloating', 'heartburn', 'indigestion', 'constipation', 'abdominal'],
    questions: [
      'What symptoms are you experiencing? (nausea, vomiting, diarrhea, pain, bloating)',
      'How long have you had these digestive symptoms?',
      'Have you eaten anything unusual or potentially contaminated recently?',
      'Are you able to keep fluids down?',
    ],
    recommendations: {
      mild: {
        otc: ['Pepto-Bismol for nausea and stomach upset', 'Loperamide (Imodium) for diarrhea', 'Antacids (Tums, Maalox) for heartburn', 'Simethicone (Gas-X) for bloating'],
        homeCare: ['Follow the BRAT diet: Bananas, Rice, Applesauce, Toast', 'Sip clear fluids slowly — ginger ale, broth, or electrolyte drinks', 'Avoid dairy, fatty, and spicy foods temporarily', 'Rest and avoid strenuous activity'],
      },
      moderate: {
        otc: ['Omeprazole (Prilosec) for persistent heartburn', 'Oral rehydration solution (Pedialyte) for dehydration', 'Ondansetron (if prescribed) for severe nausea'],
        homeCare: ['Monitor for signs of dehydration: dark urine, dizziness, dry mouth', 'Gradually reintroduce solid foods after 24 hours', 'Keep a food diary to identify triggers', 'Avoid alcohol and caffeine'],
        warning: 'If vomiting or diarrhea persists beyond 48 hours, or you cannot keep fluids down for over 24 hours, seek medical care.',
      },
      severe: {
        redFlag: '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
        action: 'Blood in vomit or stool, severe abdominal pain, signs of severe dehydration (confusion, no urination for 8+ hours), or high fever with digestive symptoms requires emergency evaluation.',
      },
    },
    redFlagCombinations: [
      ['blood in vomit'],
      ['blood in stool'],
      ['severe abdominal pain'],
      ['cannot keep fluids'],
      ['fever', 'dehydration'],
    ],
  },

  skin: {
    name: 'Skin / Rash',
    keywords: ['rash', 'itch', 'hives', 'swelling', 'spot', 'pimple', 'red', 'bumps', 'allergic', 'reaction', 'skin'],
    questions: [
      'Can you describe the rash or skin issue? (red bumps, flat spots, blisters, hives)',
      'Where on the body is it located, and is it spreading?',
      'Did it start after exposure to something new? (food, medication, plants, chemicals)',
      'Are you experiencing any swelling, difficulty breathing, or throat tightness alongside the rash?',
    ],
    recommendations: {
      mild: {
        otc: ['Hydrocortisone cream (1%) for itching and redness', 'Diphenhydramine (Benadryl) 25mg for allergic reactions', 'Calamine lotion for irritation', 'Cetirizine (Zyrtec) for allergy-related rashes'],
        homeCare: ['Apply cool compresses to reduce itching', 'Avoid scratching — keep nails short', 'Use fragrance-free, gentle moisturizer', 'Wear loose, breathable cotton clothing over affected areas'],
      },
      moderate: {
        otc: ['Stronger antihistamines as directed', 'Oatmeal bath for widespread itching', 'Topical antifungal cream if fungal infection suspected'],
        homeCare: ['Take photos to track progression', 'Eliminate potential allergen exposure', 'Avoid hot showers — use lukewarm water', 'Consider keeping a symptom journal'],
        warning: 'Rashes that spread rapidly, blister, or are accompanied by fever should be evaluated by a healthcare provider.',
      },
      severe: {
        redFlag: '⚠️ SEEK IMMEDIATE MEDICAL ATTENTION',
        action: 'Rash with throat swelling, difficulty breathing, or tongue swelling may indicate anaphylaxis — USE EPINEPHRINE (EpiPen) IF AVAILABLE and call 911 immediately. Also seek care for rapidly spreading rashes with fever or blisters.',
      },
    },
    redFlagCombinations: [
      ['throat swelling'],
      ['difficulty breathing', 'rash'],
      ['tongue swelling'],
      ['blisters', 'spreading'],
      ['fever', 'rash', 'spreading'],
    ],
  },
};

export const GREETING_MESSAGE = `Hello! I'm your AI Medical Assistant. ✛

I'm here to help you assess your symptoms and provide guidance. Please remember, I'm not a substitute for professional medical care.

**How can I help you today?** You can describe your symptoms, or select one of the common categories:`;

export const SYMPTOM_CATEGORIES_DISPLAY = [
  { label: '◆ Fever', key: 'fever' },
  { label: '◈ Pain', key: 'pain' },
  { label: '◎ Breathing', key: 'breathing' },
  { label: '✛ Injury', key: 'injury' },
  { label: '○ Digestive', key: 'digestive' },
  { label: '◉ Skin/Rash', key: 'skin' },
];

export const DISCLAIMER = '[!] Disclaimer: This is an AI-assisted tool for informational purposes only. It does NOT provide medical diagnoses. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.';
