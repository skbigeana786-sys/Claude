const SENTIMENT_COLORS = {
  Positive: { bg: '#14532d', text: '#86efac' },
  Negative: { bg: '#7f1d1d', text: '#fca5a5' },
  Neutral: { bg: '#1e3a5f', text: '#93c5fd' },
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function NewsCard({ article }) {
  const sentiment = article.sentiment || 'Neutral'
  const sc = SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS.Neutral

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        background: '#1e293b',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #334155',
        transition: 'transform 0.15s, border-color 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#6366f1'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = '#334155'
      }}
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          style={{ width: '100%', height: '180px', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
            {article.source} · {formatDate(article.published_at)}
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px',
            background: sc.bg, color: sc.text,
          }}>
            {sentiment}
          </span>
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.4, color: '#f1f5f9', marginBottom: '8px' }}>
          {article.title}
        </h3>

        {article.summary && (
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '10px' }}>
            {article.summary}
          </p>
        )}

        {article.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {article.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                background: '#0f172a', color: '#6366f1', border: '1px solid #312e81',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
