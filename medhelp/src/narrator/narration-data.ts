// ============================================
// Narration Text Data
// ============================================

export const NARRATION_DATA: Record<string, Record<string, string>> = {
  cpr: {
    begin: '🫀 **CPR Procedure Starting**\n\nWatch closely as we demonstrate the proper CPR technique. This is a life-saving skill everyone should know.',
    compressions: '👐 **Chest Compressions Active**\n\nNotice the rhythmic motion — push hard and fast at 100-120 compressions per minute. The depth should be at least 2 inches (5cm). Keep your arms straight and use your body weight.',
    halfway: '📊 **Halfway Point — 15 Compressions**\n\nExcellent rhythm! Note how the hands stay on the center of the chest (lower half of the sternum). Allow full chest recoil between compressions — don\'t lean on the chest.',
    headtilt: '🔄 **Head-Tilt / Chin-Lift Maneuver**\n\nAfter 30 compressions: open the airway. Place one hand on the forehead and gently tilt back. Lift the chin with fingertips of the other hand. Give 2 rescue breaths (1 second each).',
    cycle: '🔁 **New Compression Cycle**\n\nRepeating the cycle: 30 compressions → 2 breaths. Continue until AED arrives, emergency services take over, or the person starts breathing normally.',
    end: '⏹️ **CPR Demonstration Complete**\n\nKey takeaways:\n• Rate: 100-120/min\n• Depth: 2 inches\n• Ratio: 30:2\n• Allow full recoil\n• Minimize interruptions',
  },

  bleeding: {
    begin: '🩸 **Severe Bleeding Management**\n\nThis demonstration covers the 3-step approach to controlling severe hemorrhage: Direct Pressure → Elevation → Tourniquet.',
    pressure: '✋ **Step 1: Direct Pressure**\n\nWatch the pressure points illuminate in red. Apply firm, continuous pressure directly on the wound with a clean cloth. Do NOT remove the first bandage — stack additional material on top if blood soaks through.',
    elevation: '⬆️ **Step 2: Limb Elevation**\n\nThe left arm is being raised above heart level while maintaining pressure. Gravity helps reduce blood flow to the wound. This works for extremity wounds only — do NOT move suspected spinal injuries.',
    tourniquet: '🔶 **Step 3: Tourniquet Application**\n\nNotice the yellow tourniquet ring placed 2-3 inches ABOVE the wound — never directly on a joint. Tighten until bleeding stops. Critical: write the time of application on the tourniquet or the patient\'s skin.',
    cycle: '🔁 **Demonstration Restarting**\n\nPriority order: Direct Pressure first (most common), Elevation second, Tourniquet as last resort for life-threatening bleeding. Always call emergency services.',
    end: '⏹️ **Bleeding Management Complete**\n\nKey steps:\n• Apply firm direct pressure\n• Elevate above heart\n• Tourniquet 2-3" above wound\n• Note the time\n• Call 911',
  },
};

export const ROTATION_NARRATIONS: Record<string, string> = {
  front: '👁️ **Anterior (Front) View**\n\nYou\'re viewing the front of the body. Key landmarks: sternum (center chest), anterior deltoids (shoulders), and quadriceps (front thighs).',
  back: '👁️ **Posterior (Back) View**\n\nYou\'re viewing the back. Key areas: spine, scapulae (shoulder blades), and the posterior chain muscles. CPR should never be performed from this angle.',
  left: '👁️ **Left Lateral View**\n\nViewing the left side. Note the position of the left arm — important for practicing pressure point identification and tourniquet placement.',
  right: '👁️ **Right Lateral View**\n\nViewing the right side. From this angle, you can see the recovery position alignment and proper body mechanics for first-aid procedures.',
};

export const ZOOM_NARRATIONS = {
  close: '🔍 **Close-Up View**\n\nExcellent for examining specific body regions and observing animation details like compression depth and pressure point locations.',
  medium: '📐 **Standard View**\n\nOptimal viewing distance for full-body procedure demonstrations. You can see the complete motion range.',
  far: '🌐 **Wide View**\n\nPulled-back perspective showing the complete scene. Good for understanding overall body positioning during procedures.',
};
