import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import useStore from '../store/useStore';
import ItemGrid from '../components/ItemGrid';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

export default function TodayView({ onOpenQuickCapture }) {
  const { getTodayItems } = useStore();
  const items = getTodayItems();

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            Today
          </h1>
          <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>
            Items due today or set with reminders for today. Stay focused on current priorities.
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

      {items.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Nothing scheduled for today"
          description="You are all caught up for today! Add a reminder or set a due date on an item to see it here."
          actionLabel="Quick Capture (Ctrl+K)"
          onAction={onOpenQuickCapture}
        />
      ) : (
        <div>
          <div className="text-xs font-mono text-muted font-600" style={{ marginBottom: '16px' }}>
            DUE OR REMINDED TODAY ({items.length})
          </div>
          <ItemGrid items={items} />
        </div>
      )}
    </div>
  );
}
