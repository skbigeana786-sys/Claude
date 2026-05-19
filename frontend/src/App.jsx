import { useCallback, useEffect, useState } from 'react'
import ArticleModal from './components/ArticleModal'
import CategoryFilter from './components/CategoryFilter'
import NewsCard from './components/NewsCard'
import SearchBar from './components/SearchBar'

const DEFAULT_CATEGORIES = ['general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment']

export default function App() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories))
      .catch(() => {})
  }, [])

  const loadNews = useCallback(async (category, query) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ category, page_size: 9 })
      if (query) params.set('query', query)
      const res = await fetch(`/api/news?${params}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to fetch news')
      }
      const data = await res.json()
      setArticles(data.articles)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNews(activeCategory, searchQuery)
  }, [activeCategory, loadNews])

  const handleSearch = (q) => {
    setSearchQuery(q)
    loadNews(activeCategory, q)
  }

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat)
    setSearchQuery('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <header style={{
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>📰</span>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>News Fetcher</h1>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Powered by NewsAPI</p>
            </div>
            <div style={{ marginLeft: 'auto', width: '340px' }}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <CategoryFilter categories={categories} active={activeCategory} onSelect={handleCategorySelect} />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'spin 1s linear infinite' }}>⟳</div>
            <p style={{ color: '#64748b' }}>Fetching latest news...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {error && !loading && (
          <div style={{
            background: '#450a0a', border: '1px solid #7f1d1d',
            borderRadius: '12px', padding: '20px', textAlign: 'center',
          }}>
            <p style={{ color: '#fca5a5', marginBottom: '12px' }}>⚠ {error}</p>
            <button
              onClick={() => loadNews(activeCategory, searchQuery)}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: '#6366f1', color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <div style={{ marginBottom: '16px', color: '#64748b', fontSize: '13px' }}>
              {searchQuery
                ? `${articles.length} results for "${searchQuery}" in ${activeCategory}`
                : `${articles.length} top ${activeCategory} stories`}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}>
              {articles.map((article, i) => (
                <NewsCard
                  key={article.url || i}
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          </>
        )}

        {!loading && !error && articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p>No articles found. Try a different category or search term.</p>
          </div>
        )}
      </main>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  )
}
