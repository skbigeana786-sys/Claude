import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Search news..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          flex: 1,
          padding: '10px 16px',
          borderRadius: '8px',
          border: '1px solid #334155',
          background: '#1e293b',
          color: '#e2e8f0',
          fontSize: '14px',
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          background: '#6366f1',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
          fontFamily: 'inherit',
        }}
      >
        Search
      </button>
      {value && (
        <button
          type="button"
          onClick={() => { setValue(''); onSearch('') }}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #334155',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          ✕
        </button>
      )}
    </form>
  )
}
