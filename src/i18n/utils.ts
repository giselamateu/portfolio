import { ui, defaultLang, type Lang, type UIKey } from './ui';

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}` || '/';
}

export function getLang(url: URL): Lang {
  let path = url.pathname;
  if (base && path.startsWith(base)) path = path.slice(base.length);
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'es';
}

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

export function localePath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  if (lang === 'es') return withBase(clean ? `/${clean}` : '/');
  return withBase(clean ? `/en/${clean}` : '/en');
}

export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

export function switchLangPath(url: URL, target: Lang, projectSlug?: string): string {
  const current = getLang(url);
  if (target === current) return localePath(target);
  if (projectSlug) return localePath(target, target === 'es' ? `proyectos/${projectSlug}` : `projects/${projectSlug}`);
  return localePath(target);
}

export function projectCopy<T extends { i18n: Record<Lang, unknown> }>(project: T, lang: Lang) {
  return project.i18n[lang];
}
