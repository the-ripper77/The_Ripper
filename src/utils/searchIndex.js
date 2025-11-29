// Searchable content index for the website
// Now includes dynamic page content indexing

import { getAllSearchableContent, getStaticNavigationItems } from './pageContentIndexer';

/**
 * Get all searchable content (dynamic from page + static)
 */
export function getSearchableContent() {
  return getAllSearchableContent();
}

/**
 * Search through content using text matching
 * @param {string} query - Search query
 * @returns {Array} Filtered and ranked results
 */
export function searchContent(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const content = getSearchableContent();
  const searchTerm = query.toLowerCase().trim();
  const terms = searchTerm.split(/\s+/).filter(t => t.length > 0); // Split into individual words

  if (terms.length === 0) return [];

  // Score each item based on relevance
  const scoredResults = content.map(item => {
    let score = 0;
    const titleLower = (item.title || '').toLowerCase();
    const contentLower = (item.content || '').toLowerCase();
    const keywordsLower = (item.keywords || []).map(k => k.toLowerCase()).join(' ');

    terms.forEach(term => {
      // Exact title match (highest priority)
      if (titleLower === term) {
        score += 100;
      } else if (titleLower.includes(term)) {
        score += 50;
      }

      // Keyword match
      if (keywordsLower.includes(term)) {
        score += 30;
      }

      // Content match
      if (contentLower.includes(term)) {
        score += 10;
      }

      // Partial word match in title
      const titleWords = titleLower.split(/\s+/);
      titleWords.forEach(word => {
        if (word.startsWith(term)) {
          score += 25;
        }
        if (word.includes(term)) {
          score += 15;
        }
      });

      // Count occurrences in content
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const titleMatches = (titleLower.match(regex) || []).length;
      const contentMatches = (contentLower.match(regex) || []).length;
      score += titleMatches * 5;
      score += contentMatches * 1;
    });

    return { ...item, score };
  })
  .filter(item => item.score > 0) // Only include items with matches
  .sort((a, b) => b.score - a.score) // Sort by score descending
  .slice(0, 10); // Limit to top 10 results

  return scoredResults;
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches() {
  try {
    const recent = localStorage.getItem('searchRecent');
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
}

/**
 * Save a search to recent searches
 */
export function saveRecentSearch(query, result) {
  try {
    const recent = getRecentSearches();
    const newItem = {
      query,
      title: result.title,
      type: result.type,
      href: result.href,
      timestamp: Date.now()
    };

    // Remove duplicates
    const filtered = recent.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );

    // Add to beginning and limit to 5 most recent
    const updated = [newItem, ...filtered].slice(0, 5);
    localStorage.setItem('searchRecent', JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Get suggested searches (popular or common searches)
 */
export function getSuggestedSearches() {
  // Get suggestions from static navigation
  const navItems = getStaticNavigationItems();
  return navItems.slice(0, 2).map(item => ({
    id: item.id,
    title: item.title,
    type: item.type,
    href: item.href,
    keywords: item.keywords
  }));
}

/**
 * Remove a recent search item
 */
export function removeRecentSearch(timestamp) {
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(item => item.timestamp !== timestamp);
    localStorage.setItem('searchRecent', JSON.stringify(filtered));
    return filtered;
  } catch {
    return [];
  }
}
