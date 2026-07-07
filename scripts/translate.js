#!/usr/bin/env node

/**
 * Auto-translate messages to all supported languages
 * Uses Google Translate (free, no API key needed)
 * Usage: node scripts/translate.js
 */

const fs = require("fs");
const path = require("path");

// Language codes from src/lib/i18n.ts
const LANGUAGES = {
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ar: "Arabic",
  pt: "Portuguese",
  ru: "Russian",
  hi: "Hindi",
  ko: "Korean",
  it: "Italian",
  id: "Indonesian",
  nl: "Dutch",
  tr: "Turkish",
};

// Free translation using Google's free service (no key required)
async function translateText(text, targetLang) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    console.warn(`Failed to translate: ${text}`);
    return text;
  } catch (error) {
    console.error(`Translation error for "${text}":`, error.message);
    return text;
  }
}

async function translateMessages() {
  const enPath = path.join(__dirname, "../public/messages/en.json");
  const messagesDir = path.dirname(enPath);

  // Load English messages
  const enMessages = JSON.parse(fs.readFileSync(enPath, "utf8"));
  console.log(`Loaded ${Object.keys(enMessages).length} English messages`);

  // Translate to each language
  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    console.log(`\nTranslating to ${langName} (${langCode})...`);
    const translated = {};
    let count = 0;

    for (const [key, value] of Object.entries(enMessages)) {
      const result = await translateText(value, langCode);
      translated[key] = result;
      count++;
      process.stdout.write(`\r  ${count}/${Object.keys(enMessages).length}`);
      // Rate limiting to avoid API abuse
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const outPath = path.join(messagesDir, `${langCode}.json`);
    fs.writeFileSync(outPath, JSON.stringify(translated, null, 2));
    console.log(`\n  ✓ Saved to ${outPath}`);
  }

  console.log(
    `\n✓ Translation complete! Generated ${Object.keys(LANGUAGES).length} language files.`
  );
}

translateMessages().catch((error) => {
  console.error("Translation failed:", error);
  process.exit(1);
});
