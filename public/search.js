// Simple, elegant search implementation
let lessons = []
let searchTimeout = null

// Load lessons on page load
async function loadLessons() {
  try {
    // Show loading state
    const hitsContainer = document.getElementById('hits')
    if (hitsContainer) {
      hitsContainer.innerHTML = '<li class="loading-message">Loading lessons...</li>'
    }
    
    const response = await fetch('/api/lessons')
    lessons = await response.json()
    
    // Filter lessons immediately - only show ready to publish with folder links
    const readyLessons = lessons.filter(lesson => {
      return lesson.readyToPublish && lesson.linkToFolder && lesson.linkToFolder.trim() !== ''
    })
    
    renderLessons(readyLessons)
    updateFacets()
  } catch (error) {
    console.error('Failed to load lessons:', error)
    const hitsContainer = document.getElementById('hits')
    if (hitsContainer) {
      hitsContainer.innerHTML = '<li class="error-message">Error loading lessons</li>'
    }
  }
}

// Simple debounce function
function debounce(func, delay) {
  return function(...args) {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => func.apply(this, args), delay)
  }
}

// Search and filter
function searchLessons() {
  const query = document.getElementById('search-input')?.value?.toLowerCase() || ''
  
  // Get selected filters
  const selectedGrades = Array.from(document.querySelectorAll('#grade-facet input:checked')).map(cb => cb.value)
  const selectedSubjects = Array.from(document.querySelectorAll('#subject-facet input:checked')).map(cb => cb.value)
  const selectedConcepts = Array.from(document.querySelectorAll('#concept-facet input:checked')).map(cb => cb.value)
  const sortBy = document.getElementById('sort-select')?.value || 'relevance'
  
  // Filter lessons - only show ready to publish lessons with a link to folder
  let filtered = lessons.filter(lesson => {
    // Must be ready to publish
    if (!lesson.readyToPublish) {
      console.log('Filtering out lesson (not ready):', lesson.lessonTitle, 'readyToPublish:', lesson.readyToPublish)
      return false
    }
    
    // Must have a link to folder
    if (!lesson.linkToFolder || lesson.linkToFolder.trim() === '') {
      console.log('Filtering out lesson (no link):', lesson.lessonTitle, 'linkToFolder:', lesson.linkToFolder)
      return false
    }
    
    // Search query
    const matchesSearch = !query || 
      lesson.lessonTitle.toLowerCase().includes(query) ||
      lesson.originalAuthor.toLowerCase().includes(query) ||
      lesson.subject.toLowerCase().includes(query) ||
      lesson.ctConcept.toLowerCase().includes(query) ||
      lesson.grade.toLowerCase().includes(query)
    
    // Filters
    const matchesGrade = selectedGrades.length === 0 || 
      selectedGrades.some(g => lesson.grade.includes(g))
    
    const matchesSubject = selectedSubjects.length === 0 || 
      selectedSubjects.some(s => lesson.subject.includes(s))
    
    const matchesConcept = selectedConcepts.length === 0 || 
      selectedConcepts.some(c => lesson.ctConcept.includes(c))
    
    return matchesSearch && matchesGrade && matchesSubject && matchesConcept
  })
  
  // Sort
  if (sortBy === 'title') {
    filtered.sort((a, b) => a.lessonTitle.localeCompare(b.lessonTitle))
  } else if (sortBy === 'grade') {
    filtered.sort((a, b) => a.grade.localeCompare(b.grade))
  } else if (sortBy === 'lesson-number') {
    filtered.sort((a, b) => parseInt(a.lessonNumber || '0') - parseInt(b.lessonNumber || '0'))
  }
  
  renderLessons(filtered)
  updateResultsCount(filtered.length)
}

// Render lessons to DOM
function renderLessons(lessonsToRender) {
  const container = document.getElementById('hits')
  if (!container) return
  
  if (lessonsToRender.length === 0) {
    container.innerHTML = '<li class="no-results">No lessons found</li>'
    return
  }
  
  container.innerHTML = lessonsToRender.map(lesson => `
    <li class="ais-Hits-item">
      <div class="hit">
        <div class="hit-content">
          <div class="hit-header">
            <h2 class="hit-name">${highlightText(lesson.lessonTitle)}</h2>
            <div class="hit-status">
              ${lesson.readyToPublish 
                ? '<span class="badge badge-success">✓ Ready</span>' 
                : '<span class="badge badge-warning">In Progress</span>'}
            </div>
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
            ${lesson.linkToFolder ? `
              <a href="${lesson.linkToFolder}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                View Lesson →
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </li>
  `).join('')
}

// Highlight search terms
function highlightText(text) {
  const query = document.getElementById('search-input')?.value
  if (!query) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Update facets with counts
function updateFacets() {
  updateFacet('grade-facet', getUniqueValues('grade'))
  updateFacet('subject-facet', getUniqueValues('subject'))
  updateFacet('concept-facet', getUniqueValues('ctConcept'))
}

function getUniqueValues(field) {
  const counts = {}
  lessons.forEach(lesson => {
    const values = lesson[field].split(', ')
    values.forEach(value => {
      if (value) counts[value] = (counts[value] || 0) + 1
    })
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

function updateFacet(facetId, values) {
  const container = document.getElementById(facetId)
  if (!container) return
  
  container.innerHTML = values.slice(0, 10).map(([value, count]) => `
    <li>
      <label>
        <input type="checkbox" value="${value}" class="facet-checkbox">
        <span class="facet-value">${value}</span>
        <span class="facet-count">${count}</span>
      </label>
    </li>
  `).join('')
  
  // Attach event listeners to new checkboxes
  container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', searchLessons)
  })
}

function updateResultsCount(count) {
  const element = document.getElementById('results-count')
  if (element) {
    element.textContent = `${count} ${count === 1 ? 'result' : 'results'}`
  }
}

// Clear all filters
function clearFilters() {
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false)
  const searchInput = document.getElementById('search-input')
  if (searchInput) searchInput.value = ''
  searchLessons()
}

// Create debounced search function
const debouncedSearch = debounce(searchLessons, 300)

// Initialize and attach event listeners when DOM is ready
function initializeSearch() {
  // Load lessons
  loadLessons()
  
  // Attach event listeners
  const searchInput = document.getElementById('search-input')
  if (searchInput) {
    searchInput.addEventListener('input', debouncedSearch)
  }
  
  // Prevent form submission
  const searchForm = document.querySelector('form[role="search"]')
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault()
      searchLessons()
    })
  }
  
  // Sort select
  const sortSelect = document.getElementById('sort-select')
  if (sortSelect) {
    sortSelect.addEventListener('change', searchLessons)
  }
  
  // Clear filters button
  const clearButton = document.getElementById('clear-filters-btn')
  if (clearButton) {
    clearButton.addEventListener('click', clearFilters)
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSearch)
} else {
  initializeSearch()
}