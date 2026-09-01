import React from 'react';
import { Folder, Trash2, Plus } from 'lucide-react';
import useStore from '../store/useStore';
import ItemGrid from '../components/ItemGrid';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

export default function CollectionsView({ collectionId, onOpenQuickCapture }) {
  const { collections, getFilteredItems, deleteCollection, setActiveView } = useStore();

  const collection = collections.find(c => c.id === collectionId);
  const items = getFilteredItems().filter(i => i.collectionId === collectionId);

  if (!collection) {
    return (
      <div style={{ flex: 1, padding: '24px 32px' }}>
        <EmptyState title="Collection not found" description="This collection may have been removed." />
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`Delete collection "${collection.name}"? Items inside will not be deleted.`)) {
      deleteCollection(collection.id);
      setActiveView('inbox');
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>{collection.icon || '📁'}</span>
            <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
              {collection.name}
            </h1>
          </div>
          <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>
            Collection containing {items.length} items.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-ghost btn-sm text-danger" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </button>

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
      </div>

      <SearchBar />

      {items.length === 0 ? (
        <EmptyState
          icon={Folder}
          title="Collection is empty"
          description="Add items to this collection from the item details side panel or during Quick Capture."
          actionLabel="Quick Capture (Ctrl+K)"
          onAction={onOpenQuickCapture}
        />
      ) : (
        <div>
          <div className="text-xs font-mono text-muted font-600" style={{ marginBottom: '16px' }}>
            COLLECTION ITEMS ({items.length})
          </div>
          <ItemGrid items={items} />
        </div>
      )}
    </div>
  );
}
