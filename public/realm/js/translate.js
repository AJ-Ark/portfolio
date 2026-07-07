/**
 * Client-side translation for Realm HTML page
 * Detects browser language and applies translations from /messages/{lang}.json
 */

const DEFAULT_LANG = 'en';

// Detect browser language
function getBrowserLanguage() {
  const stored = localStorage.getItem('__realm_lang');
  if (stored) return stored;

  const lang = navigator.language.toLowerCase().split('-')[0];
  const supported = ['es', 'fr', 'de', 'zh', 'ja', 'ar', 'pt', 'ru', 'hi', 'ko', 'it', 'id', 'nl', 'tr', 'en'];

  return supported.includes(lang) ? lang : DEFAULT_LANG;
}

// Load translations
async function loadTranslations(lang) {
  try {
    const response = await fetch(`/messages/${lang}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return null;
  }
}

// Apply translations to HTML elements
function applyTranslations(messages) {
  if (!messages) return;

  // Find all elements with data-i18n attribute and replace text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (messages[key]) {
      el.textContent = messages[key];
    }
  });

  // Find all elements with data-i18n-html and replace HTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (messages[key]) {
      el.innerHTML = messages[key];
    }
  });

  // Set document language and dir for RTL languages
  const rtlLangs = ['ar', 'he'];
  const lang = getBrowserLanguage();
  document.documentElement.lang = lang;
  if (rtlLangs.includes(lang)) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
}

// Initialize translations when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const lang = getBrowserLanguage();
  const messages = await loadTranslations(lang);
  if (messages) {
    applyTranslations(messages);
  }
});
