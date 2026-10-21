import resource, {
  getDefaultLanguageTag,
  isBuiltInLanguageTag,
  type LocalePhrase,
} from '@logto/phrases-experience';
import type { LanguageInfo } from '@logto/schemas';
import { isObject } from '@silverhand/essentials';
import type { Resource } from 'i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { getPhrases as getPhrasesApi } from '@/apis/settings';
import { searchKeys } from '@/shared/utils/search-parameters';

type PhraseNode = string | { readonly [key: string]: PhraseNode };

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  isObject(value) && !Array.isArray(value);

const isPhraseRecord = (value: unknown): value is Record<string, PhraseNode> =>
  isPlainRecord(value);

const mergePhraseRecord = (
  base: Record<string, PhraseNode>,
  override: Record<string, PhraseNode>
): Record<string, PhraseNode> =>
  Object.fromEntries(
    [...new Set([...Object.keys(base), ...Object.keys(override)])].flatMap((key) => {
      const baseValue = base[key];
      const overrideValue = override[key];

      if (overrideValue === undefined) {
        return baseValue === undefined ? [] : [[key, baseValue]];
      }

      if (isPhraseRecord(baseValue) && isPhraseRecord(overrideValue)) {
        return [[key, mergePhraseRecord(baseValue, overrideValue)]];
      }

      return [[key, overrideValue]];
    })
  );

/**
 * Remote phrases win. Built-in phrases fill keys the auth server does not have yet,
 * and English remains the fallback language for any key still missing.
 */
export const mergePhraseValue = (base: unknown, override: unknown): unknown => {
  if (!isPhraseRecord(base) || !isPhraseRecord(override)) {
    return override === undefined ? base : override;
  }

  return mergePhraseRecord(base, override);
};

const withBuiltInFallback = (lng: string, phrases: LocalePhrase): Resource => {
  const languageTag = getDefaultLanguageTag(lng);
  const builtIn = isBuiltInLanguageTag(languageTag) ? resource[languageTag] : resource.en;
  const merged = mergePhraseValue(builtIn, phrases);

  if (!isPhraseRecord(merged) || lng === 'en') {
    return { en: isPhraseRecord(merged) ? merged : resource.en };
  }

  return {
    en: resource.en,
    [lng]: merged,
  };
};

const getPhrases = async (language?: string) => {
  const uiLocales = sessionStorage.getItem(searchKeys.uiLocales) ?? undefined;
  const uiLocalesFirst = uiLocales?.trim().split(/\s+/)[0];
  const preferredLanguage = language ?? uiLocales;

  if (
    isObject(logtoSsr) &&
    (!preferredLanguage || logtoSsr.phrases.lng === (language ?? uiLocalesFirst))
  ) {
    return { phrases: logtoSsr.phrases.data, lng: logtoSsr.phrases.lng };
  }

  const detectedLanguage = detectLanguage();
  const response = await getPhrasesApi({
    localLanguage: Array.isArray(detectedLanguage) ? detectedLanguage.join(' ') : detectedLanguage,
    language: preferredLanguage,
  });

  const remotePhrases = await response.json<LocalePhrase>();
  const lng = response.headers.get('Content-Language');

  if (!lng) {
    throw new Error('lng not found');
  }

  return { phrases: remotePhrases, lng };
};

export const getI18nResource = async (
  language?: string
): Promise<{ resources: Resource; lng: string }> => {
  try {
    const { phrases, lng } = await getPhrases(language);

    return {
      resources: withBuiltInFallback(lng, phrases),
      lng,
    };
  } catch {
    // Fallback to build in en
    return {
      resources: { en: resource.en },
      lng: 'en',
    };
  }
};

const storageKey = 'i18nextLogtoUiLng';

export const detectLanguage = (languageSettings?: LanguageInfo) => {
  if (languageSettings?.autoDetect === false) {
    return languageSettings.fallbackLanguage;
  }

  const languageDetector = new LanguageDetector();
  languageDetector.init(
    // Pass in a empty i18n languageUtils server instance to bypass the [languageDetector detection](https://github.com/i18next/i18next-browser-languageDetector/blob/master/src/index.js#L70)
    { languageUtils: {} },
    {
      lookupLocalStorage: storageKey,
      lookupSessionStorage: storageKey,
    }
  );

  return languageDetector.detect();
};

// Must be called after i18n's initialization
export const changeLanguage = async (language: string) => {
  const { resources, lng } = await getI18nResource(language);

  for (const [bundleLanguage, bundle] of Object.entries(resources)) {
    for (const [namespace, namespaceResource] of Object.entries(bundle)) {
      i18next.addResourceBundle(bundleLanguage, namespace, namespaceResource, true, true);
    }
  }

  await i18next.changeLanguage(lng);
};
