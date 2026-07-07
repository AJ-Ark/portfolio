#!/usr/bin/env node

/**
 * Translate only NEW keys (ones not already in target language files)
 * This preserves existing translations while adding new ones
 */

const fs = require("fs");
const path = require("path");

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
    return text;
  } catch (error) {
    return text;
  }
}

async function updateTranslations() {
  const messagesDir = path.join(__dirname, "../public/messages");
  const enPath = path.join(messagesDir, "en.json");
  const enMessages = JSON.parse(fs.readFileSync(enPath, "utf8"));

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    const langPath = path.join(messagesDir, `${langCode}.json`);
    const existingMessages = fs.existsSync(langPath)
      ? JSON.parse(fs.readFileSync(langPath, "utf8"))
      : {};

    // Find new keys
    const newKeys = Object.keys(enMessages).filter(
      (key) => !(key in existingMessages)
    );

    if (newKeys.length === 0) {
      console.log(`${langName} (${langCode}): no new keys`);
      continue;
    }

    console.log(`\n${langName} (${langCode}): ${newKeys.length} new key(s)`);

    for (const key of newKeys) {
      const translated = await translateText(enMessages[key], langCode);
      existingMessages[key] = translated;
      process.stdout.write(`\r  ${newKeys.indexOf(key) + 1}/${newKeys.length}`);
      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    fs.writeFileSync(langPath, JSON.stringify(existingMessages, null, 2));
    console.log(`\n  ✓ Updated ${langCode}.json`);
  }

  console.log("\n✓ Translation update complete!");
}

updateTranslations().catch((error) => {
  console.error("Translation failed:", error);
  process.exit(1);
});
