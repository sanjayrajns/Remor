import React from 'react';
import ItemCard from './ItemCard';

/**
 * Renders a responsive vertical-scroll card grid.
 * Usage: <ItemGrid items={items} />
 */
export default function ItemGrid({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '16px',
        paddingTop: '4px',
        paddingBottom: '32px',
      }}
    >
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
