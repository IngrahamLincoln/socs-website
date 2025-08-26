let allLessons = [];
let searchTimeoutId = null;

const searchState = {
    query: '',
    filters: {
        grade: [],
        subject: [],
        ctConcept: []
    },
    sortBy: 'lessonTitle',
    sortOrder: 'asc'
};

async function loadLessons() {
    const hitsContainer = document.getElementById('hits')
    if (hitsContainer) {
        hitsContainer.innerHTML = '<li class="loading-message">Loading lessons...</li>';
    }

    try {
        const response = await fetch('/api/lessons');
        const lessonsData = await response.json();

        // Pre-filter lessons to only include those that are ready to publish and have a valid link.
        allLessons = lessonsData.filter(lesson =>
            lesson.readyToPublish && lesson.linkToFolder && lesson.linkToFolder.trim() !== ''
        );

        searchAndRender(); // Perform initial render
    } catch (error) {
        console.error('Failed to load lessons:', error);
        if (hitsContainer) {
            hitsContainer.innerHTML = '<li class="error-message">Error loading lessons. Please try refreshing the page.</li>';
        }
    }
}

function debounce(func, delay) {
    return function(...args) {
        clearTimeout(searchTimeoutId);
        searchTimeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function searchAndRender() {
    updateStateFromDOM();

    let filteredLessons = [...allLessons];

    // 1. Apply Search Query
    if (searchState.query) {
        const query = searchState.query.toLowerCase();
        filteredLessons = filteredLessons.filter(lesson =>
            ['lessonTitle', 'originalAuthor', 'subject', 'ctConcept', 'grade'].some(field =>
                lesson[field]?.toLowerCase().includes(query)
            )
        );
    }

    // 2. Apply Filters
    Object.entries(searchState.filters).forEach(([facet, selectedValues]) => {
        if (selectedValues.length > 0) {
            const facetField = facet === 'ctConcept' ? 'ctConcept' : facet; // Map facet names to field names
            filteredLessons = filteredLessons.filter(lesson =>
                selectedValues.some(value => lesson[facetField]?.includes(value))
            );
        }
    });
  
    // 3. Apply Sorting
    const sortKey = searchState.sortBy;
    const sortOrder = searchState.sortOrder;
    
    filteredLessons.sort((a, b) => {
        let comparison;
        
        if (sortKey === 'grade') {
            // Custom grade sorting: K comes before numbers
            const gradeOrder = { 'K': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6 };
            
            // Handle complex grades like "1, 2" or "4, 5" by taking the first grade
            const getFirstGrade = (grade) => {
                const firstGrade = grade.split(',')[0].trim();
                return gradeOrder[firstGrade] !== undefined ? gradeOrder[firstGrade] : 999;
            };
            
            const gradeA = getFirstGrade(a.grade || '');
            const gradeB = getFirstGrade(b.grade || '');
            comparison = gradeA - gradeB;
        } else {
            // Default alphabetical sorting for other fields
            comparison = (a[sortKey] || '').localeCompare(b[sortKey] || '', undefined, { numeric: true });
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    renderLessons(filteredLessons);
    updateAllFacets();
    updateResultsCount(filteredLessons.length);
}

function renderLessons(lessonsToRender) {
  const container = document.getElementById('hits')
  if (!container) return
  
  if (lessonsToRender.length === 0) {
    container.innerHTML = '<li class="no-results">No lessons found</li>'
    return
  }
  
  container.innerHTML = lessonsToRender.map(lesson => {
    const highlightedTitle = highlightText(lesson.lessonTitle);
    return `
    <li class="ais-Hits-item">
      <div class="hit">
        <div class="hit-content">
          <div class="hit-header">
            <h2 class="hit-name">${highlightedTitle}</h2>
          </div>
          <p class="hit-category-breadcrumb">
            Grade ${lesson.grade} • ${lesson.subject}
          </p>
          <div class="hit-concepts">
            ${lesson.ctConcept.split(', ').map(concept => 
              `<span class="concept-tag">${concept}</span>`
            ).join('')}
          </div>
          
          <p class="hit-author">
            By ${lesson.originalAuthor}
            ${lesson.revisedBy ? ` • Revised by ${lesson.revisedBy}` : ''}
          </p>
          <div class="hit-footer">
            ${lesson.dateFinalized ? `<span class="hit-date">Finalized: ${lesson.dateFinalized}</span>` : ''}
          </div>
          <div class="hit-actions">
            <button onclick="handleLessonClick('${lesson.linkToFolder.replace(/'/g, "\\'")}')" class="btn-primary">
                View Lesson →
            </button>
          </div>
        </div>
      </div>
    </li>
  `}).join('')
}

function highlightText(text) {
  const query = searchState.query;
  if (!query) return text

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

function updateAllFacets() {
    const facets = ['grade', 'subject', 'ctConcept'];
    facets.forEach(facetToUpdate => {
        let tempFilteredLessons = [...allLessons];

        // Filter by search query
        if (searchState.query) {
            tempFilteredLessons = tempFilteredLessons.filter(lesson =>
                ['lessonTitle', 'originalAuthor', 'subject', 'ctConcept', 'grade'].some(field =>
                    lesson[field]?.toLowerCase().includes(searchState.query.toLowerCase())
                )
            );
        }

        // Filter by OTHER active facets
        facets.forEach(otherFacet => {
            if (otherFacet !== facetToUpdate && searchState.filters[otherFacet].length > 0) {
                tempFilteredLessons = tempFilteredLessons.filter(lesson =>
                    searchState.filters[otherFacet].some(value => lesson[otherFacet]?.includes(value))
                );
            }
        });

        // Now, get the counts for the facet we are currently updating
        const counts = getCountsForFacet(tempFilteredLessons, facetToUpdate);
        const facetElementId = facetToUpdate === 'ctConcept' ? 'concept-facet' : `${facetToUpdate}-facet`;
        renderFacet(facetElementId, counts, searchState.filters[facetToUpdate]);
    });
}


function getCountsForFacet(lessonsToCount, field) {
    const counts = new Map();
    lessonsToCount.forEach(lesson => {
        const values = lesson[field]?.split(',').map(v => v.trim()).filter(Boolean);
        if (values) {
            values.forEach(value => {
                counts.set(value, (counts.get(value) || 0) + 1);
            });
        }
    });
    return counts;
}

function renderFacet(elementId, counts, selectedValues) {
    const container = document.getElementById(elementId);
    if (!container) return;

    // Sort values alphabetically for consistent display
    const sortedValues = [...counts.keys()].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (sortedValues.length === 0) {
        container.innerHTML = '<li>No options available</li>';
        return;
    }

    container.innerHTML = sortedValues.map(value => {
        const count = counts.get(value);
        const isChecked = selectedValues.includes(value);
        return `
      <li>
        <label>
          <input type="checkbox" value="${value}" class="facet-checkbox" ${isChecked ? 'checked' : ''}>
          <span class="facet-value">${value}</span>
          <span class="facet-count">${count}</span>
        </label>
      </li>
    `;
    }).join('');
}

function updateResultsCount(count) {
    const element = document.getElementById('results-count');
    if (element) {
        element.textContent = `${count} ${count === 1 ? 'result' : 'results'}`;
    }
}

function clearFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    // Reset state and re-render
    searchAndRender();
}

function updateStateFromDOM() {
    const searchInput = document.getElementById('search-input');
    searchState.query = searchInput ? searchInput.value : '';

    searchState.filters.grade = Array.from(document.querySelectorAll('#grade-facet input:checked')).map(cb => cb.value);
    searchState.filters.subject = Array.from(document.querySelectorAll('#subject-facet input:checked')).map(cb => cb.value);
    searchState.filters.ctConcept = Array.from(document.querySelectorAll('#concept-facet input:checked')).map(cb => cb.value);

    const sortSelect = document.getElementById('sort-select');
    searchState.sortBy = sortSelect ? sortSelect.value : 'lessonTitle';

    const sortOrderToggle = document.getElementById('sort-order-toggle');
    searchState.sortOrder = sortOrderToggle ? sortOrderToggle.dataset.order : 'asc';
}

// Create debounced search function
const debouncedSearchAndRender = debounce(searchAndRender, 300);

function initializeSearch() {
    // Load lesson data first
    loadLessons();

    // Search input
    document.getElementById('search-input')?.addEventListener('input', debouncedSearchAndRender);

    // Prevent form submission which reloads the page
    document.querySelector('form[role="search"]')?.addEventListener('submit', (e) => e.preventDefault());

    // Sort select dropdown
    document.getElementById('sort-select')?.addEventListener('change', searchAndRender);

    // Sort order toggle button
    document.getElementById('sort-order-toggle')?.addEventListener('click', (e) => {
        const button = e.currentTarget;
        const newOrder = button.dataset.order === 'asc' ? 'desc' : 'asc';
        button.dataset.order = newOrder;
        button.textContent = newOrder === 'asc' ? 'Ascending' : 'Descending';
        searchAndRender();
    });

    // Filter checkboxes (delegated to the parent column)
    document.getElementById('left-column')?.addEventListener('change', (e) => {
        if (e.target.matches('.facet-checkbox')) {
            searchAndRender();
        }
    });

    // Clear filters button
    document.getElementById('clear-filters-btn')?.addEventListener('click', clearFilters);
}

// --- NEW CLERK.JS AUTHENTICATION LOGIC ---

let clerk = null; // This will hold the global Clerk instance

/**
 * This function is called once the Clerk.js script is fully loaded.
 * It initializes the Clerk instance and sets up listeners to keep the UI in sync.
 */
function startClerk() {
  clerk = window.Clerk;
  
  // Add a listener to automatically update the UI whenever the user signs in or out
  clerk.addListener(({ user }) => {
    updateAuthUI(user);
    checkRedirect(); // Check for a pending lesson redirect after auth state changes
  });
  
  // Initial UI setup and redirect check
  updateAuthUI(clerk.user);
  checkRedirect();
}

/**
 * Dynamically updates the header buttons based on the user's authentication state.
 * @param {object | null} user - The Clerk user object, or null if signed out.
 */
function updateAuthUI(user) {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    if (user) {
        // User is signed in: show a "Sign Out" button
        authContainer.innerHTML = `
            <button class="sign-in-btn" id="sign-out-btn">Sign Out</button>
        `;
        document.getElementById('sign-out-btn')?.addEventListener('click', () => {
            clerk?.signOut({ redirectUrl: '/' });
        });
    } else {
        // User is signed out: show a "Sign In / Sign Up" button
        authContainer.innerHTML = `
            <button class="sign-up-btn" id="sign-in-btn">Sign In / Sign Up</button>
        `;
        document.getElementById('sign-in-btn')?.addEventListener('click', () => {
            clerk?.openSignIn();
        });
    }
}

/**
 * Handles clicking on a "View Lesson" button.
 * If the user is signed in, it opens the lesson. If not, it opens the sign-in modal
 * and saves the lesson URL to be opened after a successful login.
 * @param {string} lessonUrl - The URL of the lesson to view.
 */
function handleLessonClick(lessonUrl) {
  if (clerk && clerk.user) {
    // User is signed in, open the lesson directly
    window.open(lessonUrl, '_blank', 'noopener,noreferrer');
  } else {
    // User is not signed in. Store the target URL and open the sign-in modal.
    localStorage.setItem('redirectAfterSignIn', lessonUrl);
    clerk?.openSignIn();
  }
}

/**
 * Checks if there is a pending lesson redirect in localStorage after a user signs in.
 * If found, it opens the lesson and clears the stored URL.
 */
function checkRedirect() {
    const redirectUrl = localStorage.getItem('redirectAfterSignIn');
    if (redirectUrl && clerk && clerk.user) {
        localStorage.removeItem('redirectAfterSignIn');
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    }
}

// --- SCRIPT EXECUTION ---

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeSearch();
        initializeClerk();
    });
} else {
    initializeSearch();
    initializeClerk();
}

function initializeClerk() {
    // Try to initialize Clerk if it's available
    if (window.Clerk) {
        window.Clerk.load().then(startClerk).catch((error) => {
            console.error('Failed to load Clerk:', error);
            // Fallback to basic auth buttons
            showFallbackAuth();
        });
    } else {
        // Wait for Clerk to be available
        let attempts = 0;
        const checkClerk = setInterval(() => {
            attempts++;
            if (window.Clerk) {
                clearInterval(checkClerk);
                window.Clerk.load().then(startClerk).catch((error) => {
                    console.error('Failed to load Clerk:', error);
                    showFallbackAuth();
                });
            } else if (attempts > 20) {
                // After 10 seconds, show fallback
                clearInterval(checkClerk);
                console.warn('Clerk not available, using fallback');
                showFallbackAuth();
            }
        }, 500);
    }
}

function showFallbackAuth() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;
    
    authContainer.innerHTML = `
        <button class="sign-up-btn" onclick="window.location.href='/sign-in'">Sign In</button>
    `;
}