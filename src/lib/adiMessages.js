/**
 * Library of messages for Adi the Mascot.
 * Logic to select messages based on app state.
 */

const GENERAL_ENCOURAGEMENT = [
  "You're doing great! One day at a time.",
  "Adi is happy to see you today!",
  "Consistency is the secret sauce. Keep it up!",
  "Your health is an investment, not an expense.",
  "High five! You're making progress.",
];

const SHOT_DAY_MESSAGES = [
  "Today is the day! Ready for your shot?",
  "Nervous about today's shot? You've got this!",
  "Shot day! Don't forget to rotate your site.",
  "Ready to feed me some medicine?",
];

const POST_SHOT_MESSAGES = [
  "Great job logging that shot! Adi feels energized.",
  "Heroic effort! Make sure to drink some extra water today.",
  "You're all set for the week. Let's crush those goals!",
];

const SIDE_EFFECT_MESSAGES = {
  'Nausea': "Feeling a bit queasy? Small sips of ginger ale might help.",
  'Fatigue': "It's okay to rest. Your body is doing a lot of work!",
  'Headache': "Hydration is key! Try to drink a full glass of water.",
  'generic': "I'm sorry you're not feeling 100%. Hanging in there is a victory!",
};

const INVENTORY_MESSAGES = [
  "We're running low on pens! Time to call the pharmacy?",
  "Don't let our supply run dry. Time for a refill!",
];

const STREAK_MESSAGES = [
  "A 4-week streak? You're a legend!",
  "Look at that streak! Adi is so proud of you.",
  "We're building such a healthy habit together.",
];

/**
 * Logic to select the most relevant message for the user.
 */
export const getAdiMessage = ({ streaks, characterState, settings, injections = [], sideEffects = [] }) => {
  // 1. Check for Low Inventory
  if (settings.dosesOnHand <= settings.refillThreshold && settings.dosesOnHand > 0) {
    return INVENTORY_MESSAGES[Math.floor(Math.random() * INVENTORY_MESSAGES.length)];
  }

  // 2. Check for recent Side Effects
  if (sideEffects.length > 0) {
    const recentEffect = sideEffects[0];
    const hoursSinceLogged = (new Date() - new Date(recentEffect.logged_at)) / (1000 * 60 * 60);
    if (hoursSinceLogged < 24) {
      return SIDE_EFFECT_MESSAGES[recentEffect.symptom] || SIDE_EFFECT_MESSAGES.generic;
    }
  }

  // 3. Logic based on Character State (Mood)
  if (characterState === 'happy') {
    return POST_SHOT_MESSAGES[Math.floor(Math.random() * POST_SHOT_MESSAGES.length)];
  }

  if (characterState === 'neutral') {
    return SHOT_DAY_MESSAGES[Math.floor(Math.random() * SHOT_DAY_MESSAGES.length)];
  }

  // 4. Milestone/Streak celebration
  if (streaks.current > 0 && streaks.current % 4 === 0) {
    return STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
  }

  // 5. Default Encouragement
  return GENERAL_ENCOURAGEMENT[Math.floor(Math.random() * GENERAL_ENCOURAGEMENT.length)];
};
