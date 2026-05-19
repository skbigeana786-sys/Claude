import { useEffect, useState } from 'react'

export default function ArticleModal({ article, onClose }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setContent('')

    fetch(`/api/article?url=${encodeURIComponent(article.url)}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Could not load article')
        return r.json()
      })
      .then((data) => {
        if (data.content) {
          setContent(data.content)
        } else {
          setError('This site does not allow content to be read inline.')
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [article.url])

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          border: '1px solid #334155',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
              {article.source}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4 }}>
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#334155', border: 'none', color: '#94a3b8',
              borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
              fontSize: '16px', flexShrink: 0, fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              style={{ width: '100%', borderRadius: '10px', marginBottom: '20px', maxHeight: '320px', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>⟳</div>
              <p>Loading article...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#94a3b8', marginBottom: '16px' }}>{error}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block', padding: '10px 20px',
                  background: '#6366f1', color: '#fff', borderRadius: '8px',
                  fontWeight: 600, fontSize: '14px',
                }}
              >
                Open Original →
              </a>
            </div>
          )}

          {content && !loading && (
            <div>
              {content.split('\n\n').map((para, i) => (
                <p key={i} style={{
                  fontSize: '15px', color: '#cbd5e1', lineHeight: 1.8,
                  marginBottom: '16px',
                }}>
                  {para}
                </p>
              ))}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '13px', color: '#6366f1' }}
                >
                  View original article →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
