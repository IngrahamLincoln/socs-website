import { NextResponse } from 'next/server'

export async function GET() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SOCS4AI Lesson Search</title>
  <link rel="stylesheet" href="/search/style.css">
  <link rel="stylesheet" href="/search/custom-overrides.css">
  <style>
    .auth-buttons {
      display: flex;
      align-items: center;
    }
    .auth-buttons button {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s;
    }
    .auth-buttons button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .sign-in-btn {
      background-color: white;
      color: #333;
      border: 1px solid #ddd;
    }
    .sign-in-btn:hover {
      background-color: #f5f5f5;
    }
    .sign-up-btn {
      background-color: #0070f3;
      color: white;
    }
    .sign-up-btn:hover {
      background-color: #0051cc;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex: 1;
    }
  </style>
</head>
<body>
  <div class="instant-search-container">
    <header>
      <div class="header-left">
        <a href="/"><img src="/socs-wordmark.png" alt="SOCS For All" style="height: 50px;" /></a>
        <div id="search-input-container">
        <form action="" role="search">
          <input
            id="search-input"
            type="search"
            placeholder="Search for lessons..."
            class="ais-SearchBox-input"
          />
          <button type="submit" title="Submit your search query." class="ais-SearchBox-submit">
            <svg class="ais-SearchBox-submitIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 40 40">
              <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path>
            </svg>
          </button>
        </form>
      </div>
      </div>
      <div class="auth-buttons" id="auth-container">
        <!-- Auth buttons will be dynamically inserted here -->
      </div>
    </header>

    <main>
      <div id="left-column">
        <div class="facet">
          <div class="facet-name">Grade Level</div>
          <ul class="facet-values" id="grade-facet"></ul>
        </div>
        
        <div class="facet">
          <div class="facet-name">Subject</div>
          <ul class="facet-values" id="subject-facet"></ul>
        </div>
        
        <div class="facet">
          <div class="facet-name">CT Concepts</div>
          <ul class="facet-values" id="concept-facet"></ul>
        </div>
        
        
        <button class="clear-filters" id="clear-filters-btn">
          Clear all filters
        </button>
      </div>

      <div id="right-column">
        <div class="results-header">
          <span id="results-count"></span>
          <div id="sort-by-wrapper">
            <select id="sort-select">
              <option value="lessonTitle">Title</option>
              <option value="grade">Grade</option>
              <option value="subject">Subject</option>
              <option value="ctConcept">CT Concept</option>
            </select>
            <button id="sort-order-toggle" data-order="asc">Ascending</button>
          </div>
        </div>
        
        <ul class="ais-Hits-list" id="hits"></ul>
      </div>
    </main>

    <footer>
      <p>Powered by SOCS4AI</p>
    </footer>
  </div>
  
  <script src="/search.js"></script>
</body>
</html>
  `
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}