const ICONS = {
  general: '🌐',
  business: '💼',
  technology: '💻',
  science: '🔬',
  health: '🏥',
  sports: '⚽',
  entertainment: '🎬',
}

export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '0 0 8px' }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: active === cat ? '#6366f1' : '#334155',
            background: active === cat ? '#6366f1' : 'transparent',
            color: active === cat ? '#fff' : '#94a3b8',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'all 0.15s',
            textTransform: 'capitalize',
          }}
        >
          {ICONS[cat]} {cat}
        </button>
      ))}
    </div>
  )
}
