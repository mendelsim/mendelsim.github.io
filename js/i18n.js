/**
 * MendelSim — Minimal i18n helper.
 * Keeps the static-site setup: dictionaries are plain scripts loaded before modules.
 */
(function (global) {
  const DEFAULT_LOCALE = 'es';
  const STORAGE_KEY = 'mendelsim.locale';
  const messages = global.MendelSimMessages || {};

  function detectLocale() {
    try {
      const queryLocale = new URLSearchParams(global.location.search).get('lang');
      if (queryLocale) {
        global.localStorage?.setItem(STORAGE_KEY, queryLocale);
        return queryLocale;
      }
      const storedLocale = global.localStorage?.getItem(STORAGE_KEY);
      if (storedLocale) return storedLocale;
    } catch (err) {
      // Keep the helper usable in restricted browser contexts.
    }
    return global.MendelSimLocale || DEFAULT_LOCALE;
  }

  let currentLocale = detectLocale();

  function format(template, params) {
    if (!params) return String(template);
    return String(template).replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(params, key) ? params[key] : match
    ));
  }

  function register(locale, entries) {
    messages[locale] = Object.assign(messages[locale] || {}, entries || {});
  }

  function setLocale(locale) {
    currentLocale = locale || DEFAULT_LOCALE;
    try {
      global.localStorage?.setItem(STORAGE_KEY, currentLocale);
    } catch (err) {
      // Ignore persistence failures; translations still work for this page load.
    }
  }

  function getLocale() {
    return currentLocale;
  }

  function t(key, fallback, params) {
    const localeMessages = messages[currentLocale] || {};
    const defaultMessages = messages[DEFAULT_LOCALE] || {};
    const value = localeMessages[key] ?? defaultMessages[key] ?? fallback ?? key;
    return format(value, params);
  }

  global.MendelSimMessages = messages;
  global.MendelSimI18n = { register, setLocale, getLocale, t };
  global.t = t;
})(window);
