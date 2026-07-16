import { useEffect } from 'react';

const SITE = 'LaunchPoint';

/**
 * Sets the document title for a page. Pass a page name ("Launches") for
 * "Launches · LaunchPoint", or a full title with `{ full: true }` for pages
 * that want a descriptive standalone title (e.g. Home, for search results).
 */
export function usePageTitle(title, { full = false } = {}) {
  useEffect(() => {
    document.title = full ? title : `${title} · ${SITE}`;
  }, [title, full]);
}
