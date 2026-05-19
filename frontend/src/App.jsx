import { useCallback, useEffect, useState } from 'react'
import CategoryFilter from './components/CategoryFilter'
import NewsCard from './components/NewsCard'
import SearchBar from './components/SearchBar'

const DEFAULT_CATEGORIES = ['general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment']

export default function App() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState([])
  const [digest, setDigest] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const params = new URLSearchParams({ category, page_size: 9, summarize: true })
      if (query) params.set('query', query)
      const res = await fetch(`/api/news?${params}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to fetch news')
      }
      const data = await res.json()
      setArticles(data.articles)
      setDigest(data.digest)
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
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>AI News Fetcher</h1>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Powered by NewsAPI + Claude AI</p>
            </div>
            <div style={{ marginLeft: 'auto', width: '340px' }}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <CategoryFilter categories={categories} active={activeCategory} onSelect={handleCategorySelect} />
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* AI Digest */}
        {digest && !loading && (
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            border: '1px solid #4338ca',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px' }}>✨</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Digest
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#c7d2fe', lineHeight: 1.6 }}>{digest}</p>
          </div>
        )}

        {/* State: loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'spin 1s linear infinite' }}>⟳</div>
            <p style={{ color: '#64748b' }}>Fetching & summarizing news with AI...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* State: error */}
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

        {/* Articles grid */}
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
                <NewsCard key={article.url || i} article={article} />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !error && articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p>No articles found. Try a different category or search term.</p>
          </div>
        )}
      </main>
    </div>
  )
}
