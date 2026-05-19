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
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
            {article.source} · {formatDate(article.published_at)}
          </span>
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.4, color: '#f1f5f9', marginBottom: '8px' }}>
          {article.title}
        </h3>

        {article.description && (
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
            {article.description}
          </p>
        )}
      </div>
    </a>
  )
}
