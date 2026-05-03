/**
 * MendelSim — Minimal i18n helper.
 * Keeps the static-site setup: dictionaries are plain scripts loaded before modules.
 */
(function (global) {
  const DEFAULT_LOCALE = 'es';
  const messages = global.MendelSimMessages || {};
  let currentLocale = global.MendelSimLocale || DEFAULT_LOCALE;

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
