import React from 'react';

export default function TagBadge({ tag, active = false, onClick, onRemove, count }) {
  return (
    <span
      className={`tag ${active ? 'active' : ''}`}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(tag);
        }
      }}
    >
      #{tag}
      {count !== undefined && <span style={{ opacity: 0.6, marginLeft: '2px' }}>({count})</span>}
      {onRemove && (
        <button
          style={{ marginLeft: '4px', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontSize: '10px', opacity: 0.6 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
