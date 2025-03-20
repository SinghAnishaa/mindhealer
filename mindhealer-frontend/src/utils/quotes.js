export const quotes = [
    "Self-care is not selfish. You deserve your love too. 💙",
    "It's okay to not be okay. Just take one step at a time. 🌱",
    "Your feelings are valid. Keep moving forward! 💪",
    "Healing is not linear. Be gentle with yourself. 🌼",
    "Take a deep breath. You are enough. 🌿",
    "Every day is a new beginning. Believe in yourself. ✨",
    "Mental health is just as important as physical health. Take care of both. ❤️",
    "You are stronger than your struggles. Keep pushing forward. 💪",
    "Rest when you need to. Your well-being matters. ☀️",
    "Surround yourself with positivity, and let go of what drains you. 🌸"
];

export const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)];
};
