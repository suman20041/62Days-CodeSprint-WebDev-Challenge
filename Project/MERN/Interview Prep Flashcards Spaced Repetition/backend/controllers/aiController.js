const { TOPICS } = require('../models/Card');

const AI_ENABLED = () => Boolean(process.env.GEMINI_API_KEY?.trim());

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY.trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI request failed: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  return text.trim();
}

function extractJson(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fence ? fence[1].trim() : text.trim();
  return JSON.parse(raw);
}

const status = (_req, res) => {
  res.json({
    enabled: AI_ENABLED(),
    message: AI_ENABLED()
      ? 'AI features are available.'
      : 'Set GEMINI_API_KEY in backend/.env to enable AI.',
  });
};

const generateCards = async (req, res) => {
  try {
    if (!AI_ENABLED()) {
      return res.status(503).json({
        message:
          'AI is not configured. Add GEMINI_API_KEY to backend/.env (optional).',
      });
    }

    const { topic = 'javascript', count = 3 } = req.body;
    const t = String(topic).toLowerCase();
    if (!TOPICS.includes(t)) {
      return res.status(400).json({ message: 'Unsupported topic.' });
    }

    const n = Math.min(8, Math.max(1, Number(count) || 3));

    const prompt = `Generate ${n} interview prep flashcards for the topic "${t}".
Return ONLY valid JSON (no markdown) as an array of objects with keys:
"front" (question), "back" (concise answer), "hint" (short optional hint).
Keep answers practical for coding interviews.`;

    const text = await callGemini(prompt);
    let cards;
    try {
      cards = extractJson(text);
    } catch {
      return res.status(502).json({
        message: 'AI returned an unexpected format. Try again.',
        raw: text.slice(0, 400),
      });
    }

    if (!Array.isArray(cards)) {
      return res.status(502).json({ message: 'AI response was not a list.' });
    }

    const normalized = cards.slice(0, n).map((c) => ({
      front: String(c.front || '').trim(),
      back: String(c.back || '').trim(),
      hint: String(c.hint || '').trim(),
      topic: t,
    })).filter((c) => c.front && c.back);

    res.json({ cards: normalized, topic: t });
  } catch (error) {
    res.status(500).json({ message: error.message || 'AI generation failed.' });
  }
};

const generateHint = async (req, res) => {
  try {
    if (!AI_ENABLED()) {
      return res.status(503).json({
        message:
          'AI is not configured. Add GEMINI_API_KEY to backend/.env (optional).',
      });
    }

    const { front, back, topic = 'general' } = req.body;
    if (!front) {
      return res.status(400).json({ message: 'Front (question) is required.' });
    }

    const prompt = `You help with interview prep. Give ONE short study hint (max 25 words) for this flashcard.
Do NOT reveal the full answer. Topic: ${topic}
Question: ${front}
${back ? `Answer (for context only, do not repeat): ${back}` : ''}
Return plain text only.`;

    const hint = await callGemini(prompt);
    res.json({ hint });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Hint generation failed.' });
  }
};

module.exports = { status, generateCards, generateHint };
