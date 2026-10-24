import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLanguage = "auto", targetLanguage, style = "professional" } = req.body || {};
    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Bitte gib zuerst einen Text ein. / يرجى إدخال نص أولاً." });
    }
    if (text.length > 20000) {
      return res.status(413).json({ error: "Der Text ist zu lang. Bitte maximal 20.000 Zeichen senden." });
    }
    if (!["German", "Arabic"].includes(targetLanguage)) {
      return res.status(400).json({ error: "Ungültige Zielsprache." });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "Der Übersetzungsdienst ist noch nicht eingerichtet. Trage OPENAI_API_KEY in die .env-Datei ein und starte den Server neu."
      });
    }

    const styleGuide = {
      professional: "Professionell und natürlich; Sinn, Kontext, Ton und Register präzise bewahren.",
      formal: "Formell und höflich, geeignet für Behörden, Beruf und Geschäftskorrespondenz.",
      everyday: "Natürlich und alltagstauglich, wie von einem Muttersprachler formuliert.",
      academic: "Akademisch, präzise und terminologisch konsistent.",
      literary: "Literarisch und stilistisch nuanciert; Bilder und Redewendungen sinngemäß übertragen."
    }[style] || "Professionell und natürlich; Sinn, Kontext, Ton und Register präzise bewahren.";

    const sourceLabel = sourceLanguage === "auto" ? "automatisch erkennen (Arabisch oder Deutsch)" :
      sourceLanguage === "Arabic" ? "Arabisch" : "Deutsch";
    const targetLabel = targetLanguage === "Arabic" ? "Arabisch" : "Deutsch";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `Du bist ein professioneller Übersetzer für Arabisch und Deutsch. Übersetze ausschließlich in die Zielsprache ${targetLabel}. Ausgangssprache: ${sourceLabel}. Stil: ${styleGuide}
Regeln:
- Übersetze sinngemäß, nicht mechanisch Wort für Wort.
- Bewahre Bedeutung, Kontext, Sprecherabsicht, Ton und Textsorte.
- Verwende korrekte Grammatik, Orthografie und etablierte Fachbegriffe.
- Übertrage Redewendungen kulturell passend.
- Bewahre Absätze, Überschriften, Listen und Nummerierungen.
- Füge keine Erklärungen, Einleitungen oder Anführungszeichen hinzu.
- Wenn der Ausgangstext bereits in der Zielsprache ist, verbessere ihn nicht eigenmächtig, sondern gib eine passende Übersetzung in die Zielsprache nur dann aus, wenn dies sinnvoll ist. Bei unklaren Texten übersetze den erkennbaren Inhalt bestmöglich.`
          },
          { role: "user", content: text.trim() }
        ]
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || `Übersetzungsdienst antwortete mit HTTP ${response.status}.`;
      return res.status(502).json({ error: message });
    }
    const translation = data?.choices?.[0]?.message?.content?.trim();
    if (!translation) return res.status(502).json({ error: "Es wurde keine Übersetzung zurückgegeben." });
    res.json({ translation, model: process.env.OPENAI_MODEL || "gpt-4.1-mini" });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Verbindungsfehler. Bitte prüfe deine Internetverbindung und versuche es erneut." });
  }
});

app.listen(PORT, () => {
  console.log(`Arabic-German Translator läuft auf http://localhost:${PORT}`);
});