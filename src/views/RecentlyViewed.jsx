import React from 'react';
import { Clock, Plus } from 'lucide-react';
import useStore from '../store/useStore';
import ItemGrid from '../components/ItemGrid';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

export default function RecentlyViewedView({ onOpenQuickCapture }) {
  const { recentlyViewedIds, items } = useStore();

  const recentItems = recentlyViewedIds
    .map(id => items.find(i => i.id === id))
    .filter(Boolean);

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            Recently Viewed
          </h1>
          <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>
            Items you recently inspected or edited across your personal hub.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={onOpenQuickCapture}
          style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <Plus size={15} />
          <span>Add Item</span>
          <kbd style={{ marginLeft: '4px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', padding: '1px 5px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>Ctrl+K</kbd>
        </button>
      </div>

      <SearchBar />

      {recentItems.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No recent activity"
          description="Click on any item to open its details and track your browsing history."
          actionLabel="Quick Capture (Ctrl+K)"
          onAction={onOpenQuickCapture}
        />
      ) : (
        <div>
          <div className="text-xs font-mono text-muted font-600" style={{ marginBottom: '16px' }}>
            LAST ACCESSED ({recentItems.length})
          </div>
          <ItemGrid items={recentItems} />
        </div>
      )}
    </div>
  );
}
