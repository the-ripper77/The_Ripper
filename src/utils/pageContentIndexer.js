/**
 * Indexes all visible text content from the page for search
 * This scans the DOM and extracts searchable content
 */

/**
 * Extract text content from an element and its children
 * @param {HTMLElement} element - DOM element to extract text from
 * @returns {string} Extracted text content
 */
function extractTextContent(element) {
  if (!element) return '';
  
  // Clone to avoid modifying original
  const clone = element.cloneNode(true);
  
  // Remove script, style, and hidden elements
  const removals = clone.querySelectorAll('script, style, [hidden], .sr-only, [aria-hidden="true"]');
  removals.forEach(el => el.remove());
  
  return clone.textContent || clone.innerText || '';
}

/**
 * Get all searchable sections from the page
 * @returns {Array} Array of searchable content objects
 */
export function indexPageContent() {
  const searchableItems = [];
  
  // Selector for elements that should be searchable
  const searchableSelectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', // Headings
    'p', 'article', 'section',           // Content blocks
    '[data-searchable]',                  // Custom searchable elements
    '.content', '.post', '.article'       // Common content classes
  ];
  
  // Get all navigation links
  const navLinks = document.querySelectorAll('nav a, .nav-link, [role="navigation"] a');
  navLinks.forEach((link, index) => {
    const text = extractTextContent(link).trim();
    const href = link.getAttribute('href') || link.getAttribute('data-href') || '#';
    
    if (text && text.length > 0) {
      searchableItems.push({
        id: `nav-item-${index}`,
        title: text,
        type: 'Navigation',
        category: 'Page',
        content: `Navigate to ${text}`,
        href: href,
        keywords: text.toLowerCase().split(/\s+/),
        element: link
      });
    }
  });
  
  // Get headings and their associated content
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    const text = extractTextContent(heading).trim();
    
    if (text && text.length > 0) {
      // Get the section content after the heading
      let content = '';
      let nextElement = heading.nextElementSibling;
      let contentLimit = 200; // Limit content length
      
      while (nextElement && content.length < contentLimit) {
        const nextText = extractTextContent(nextElement).trim();
        if (nextText.length > 0) {
          content += nextText + ' ';
        }
        nextElement = nextElement.nextElementSibling;
        
        // Stop at next heading of same or higher level
        if (nextElement && /^h[1-6]$/i.test(nextElement.tagName)) {
          const currentLevel = parseInt(heading.tagName[1]);
          const nextLevel = parseInt(nextElement.tagName[1]);
          if (nextLevel <= currentLevel) break;
        }
      }
      
      // Get or create an ID for the heading
      let id = heading.id;
      if (!id) {
        id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`;
        heading.id = id;
      }
      
      searchableItems.push({
        id: id,
        title: text,
        type: 'Heading',
        category: heading.tagName.toUpperCase(),
        content: content.trim() || text,
        href: `#${id}`,
        keywords: text.toLowerCase().split(/\s+/),
        element: heading
      });
    }
  });
  
  // Get paragraphs and articles
  const paragraphs = document.querySelectorAll('p, article, section, .content > *, [data-searchable]');
  paragraphs.forEach((para, index) => {
    const text = extractTextContent(para).trim();
    
    // Skip if too short or already indexed as part of a heading
    if (text.length < 20) return;
    
    // Skip if it's already been included with a heading
    const isDuplicate = searchableItems.some(item => 
      item.content && item.content.includes(text.substring(0, 50))
    );
    
    if (!isDuplicate) {
      // Extract a title from first sentence or first few words
      const firstSentence = text.split(/[.!?]/)[0].trim();
      const title = firstSentence.length > 60 
        ? firstSentence.substring(0, 60) + '...'
        : firstSentence;
      
      searchableItems.push({
        id: `content-${index}`,
        title: title || `Content ${index + 1}`,
        type: 'Content',
        category: para.tagName,
        content: text,
        href: `#${para.id || `content-${index}`}`,
        keywords: text.toLowerCase().split(/\s+/).filter(word => word.length > 3),
        element: para
      });
    }
  });
  
  // Get sidebar content (profile, titles, etc.)
  const sidebarElements = document.querySelectorAll('#sidebar .site-title, #sidebar .site-subtitle, .profile-wrapper p');
  sidebarElements.forEach((el, index) => {
    const text = extractTextContent(el).trim();
    if (text && text.length > 0) {
      searchableItems.push({
        id: `sidebar-${index}`,
        title: text.length > 50 ? text.substring(0, 50) + '...' : text,
        type: 'Profile',
        category: 'Sidebar',
        content: text,
        href: '#sidebar',
        keywords: text.toLowerCase().split(/\s+/),
        element: el
      });
    }
  });
  
  // Get button text and labels
  const buttons = document.querySelectorAll('button[aria-label], button:not([aria-hidden="true"])');
  buttons.forEach((btn, index) => {
    const label = btn.getAttribute('aria-label') || extractTextContent(btn).trim();
    if (label && label.length > 0 && label.length < 50) {
      searchableItems.push({
        id: `button-${index}`,
        title: label,
        type: 'Button',
        category: 'UI Element',
        content: `Button: ${label}`,
        href: null,
        keywords: label.toLowerCase().split(/\s+/),
        element: btn
      });
    }
  });
  
  return searchableItems;
}

/**
 * Get static navigation items as fallback
 * @returns {Array} Static navigation items
 */
export function getStaticNavigationItems() {
  return [
    {
      id: 'nav-home',
      title: 'Home',
      type: 'Navigation',
      category: 'Page',
      content: 'Welcome to the home page',
      href: '#home',
      keywords: ['home', 'welcome', 'main', 'landing']
    },
    {
      id: 'nav-categories',
      title: 'Categories',
      type: 'Navigation',
      category: 'Page',
      content: 'Browse content by categories',
      href: '#categories',
      keywords: ['categories', 'browse', 'filter', 'topics']
    },
    {
      id: 'nav-archives',
      title: 'Archives',
      type: 'Navigation',
      category: 'Page',
      content: 'View archived posts and content',
      href: '#archives',
      keywords: ['archives', 'old', 'past', 'history', 'posts']
    },
    {
      id: 'nav-friends',
      title: 'Friends',
      type: 'Navigation',
      category: 'Page',
      content: 'Friends and connections',
      href: '#friends',
      keywords: ['friends', 'connections', 'network', 'community']
    },
    {
      id: 'nav-about',
      title: 'About',
      type: 'Navigation',
      category: 'Page',
      content: 'About page and information',
      href: '#about',
      keywords: ['about', 'bio', 'profile', 'information']
    }
  ];
}

/**
 * Get all searchable content (page content + static items)
 * @returns {Array} Combined searchable content
 */
export function getAllSearchableContent() {
  try {
    const pageContent = indexPageContent();
    const staticItems = getStaticNavigationItems();
    
    // Combine and deduplicate by title
    const combined = [...staticItems, ...pageContent];
    const unique = [];
    const seen = new Set();
    
    combined.forEach(item => {
      const key = item.title.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    });
    
    return unique;
  } catch (error) {
    console.warn('Error indexing page content, using static items only:', error);
    return getStaticNavigationItems();
  }
}

