import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Trash2,
  Archive,
  ExternalLink,
  Calendar,
  Layers,
  Tag,
  Folder,
  Clock,
  Eye,
  CheckSquare,
  Link as LinkIcon,
  FileText,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import useStore from '../store/useStore';
import TagBadge from './TagBadge';
import { format } from 'date-fns';

export default function ItemDetail() {
  const {
    activeItemId,
    setActiveItem,
    items,
    updateItem,
    deleteItem,
    archiveItem,
    toggleStar,
    collections,
    getSimilarItems,
    getAllTags,
    showToast,
  } = useStore();

  const item = items.find(i => i.id === activeItemId);
  const [newTagInput, setNewTagInput] = useState('');

  if (!item) return null;

  const collection = collections.find(c => c.id === item.collectionId);
  const similarItems = getSimilarItems(item.id);
  const allTags = getAllTags().map(t => t.tag);

  const handleTagAdd = (tagToAdd) => {
    const trimmed = tagToAdd.trim().toLowerCase().replace(/^#/, '');
    if (!trimmed) return;
    if (!item.tags.includes(trimmed)) {
      updateItem(item.id, { tags: [...item.tags, trimmed] });
    }
    setNewTagInput('');
  };

  const handleTagRemove = (tagToRemove) => {
    updateItem(item.id, { tags: item.tags.filter(t => t !== tagToRemove) });
  };

  const suggestedTags = allTags.filter(t => !item.tags.includes(t) && t.includes(newTagInput.toLowerCase()));

  return (
    <div
      style={{
        width: 'var(--detail-width)',
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
      className="item-detail-drawer animate-slide-up"
    >
      {/* Top Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            className={`btn-icon ${item.starred ? 'active' : ''}`}
            onClick={() => toggleStar(item.id)}
            title="Star Item"
          >
            <Star size={16} fill={item.starred ? 'var(--primary)' : 'none'} />
          </button>
          <button
            className="btn-icon"
            onClick={() => archiveItem(item.id)}
            title="Archive Item"
          >
            <Archive size={16} />
          </button>
          <button
            className="btn-icon"
            onClick={() => deleteItem(item.id)}
            title="Delete Item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <button className="btn-icon" onClick={() => setActiveItem(null)}>
          <X size={18} />
        </button>
      </div>

      {/* Detail Body Form */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {/* Editable Title */}
        <input
          type="text"
          style={{
            fontSize: '18px',
            fontWeight: 600,
            border: 'none',
            borderBottom: '1px solid transparent',
            padding: '4px 0',
            fontFamily: 'var(--font-heading)',
          }}
          placeholder="Title..."
          value={item.title}
          onChange={(e) => updateItem(item.id, { title: e.target.value })}
        />

        {/* URL Field if link type or contains url */}
        {(item.type === 'link' || item.url !== null) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LinkIcon size={14} className="text-muted" />
            <input
              type="text"
              className="input input-sm"
              placeholder="https://example.com"
              value={item.url || ''}
              onChange={(e) => updateItem(item.id, { url: e.target.value })}
            />
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px' }}
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* Editable Content / Body */}
        <div>
          <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>
            CONTENT / MEMO
          </label>
          <textarea
            className="textarea"
            placeholder="Add detailed description, code snippet, summary, or thoughts..."
            rows={5}
            value={item.content}
            onChange={(e) => updateItem(item.id, { content: e.target.value })}
          />
        </div>

        {/* Properties Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--surface)', padding: '12px', border: '1px solid var(--border)' }}>
          <div>
            <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>TYPE</label>
            <select
              className="select w-full"
              value={item.type}
              onChange={(e) => updateItem(item.id, { type: e.target.value })}
            >
              <option value="link">Link</option>
              <option value="note">Note</option>
              <option value="task">Task</option>
              <option value="idea">Idea</option>
              <option value="reference">Reference</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>PRIORITY</label>
            <select
              className="select w-full"
              value={item.priority}
              onChange={(e) => updateItem(item.id, { priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>STATUS</label>
            <select
              className="select w-full"
              value={item.status}
              onChange={(e) => updateItem(item.id, { status: e.target.value })}
            >
              <option value="inbox">Inbox</option>
              <option value="active">Active</option>
              <option value="done">Completed</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>COLLECTION</label>
            <select
              className="select w-full"
              value={item.collectionId || ''}
              onChange={(e) => updateItem(item.id, { collectionId: e.target.value || null })}
            >
              <option value="">(None)</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date & Reminder */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>DUE DATE</label>
            <input
              type="date"
              className="input input-sm"
              value={item.dueDate ? item.dueDate.split('T')[0] : ''}
              onChange={(e) => updateItem(item.id, { dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>REMINDER</label>
            <input
              type="date"
              className="input input-sm"
              value={item.reminder ? item.reminder.split('T')[0] : ''}
              onChange={(e) => updateItem(item.id, { reminder: e.target.value ? new Date(e.target.value).toISOString() : null })}
            />
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '6px' }}>TAGS</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            {item.tags.map(t => (
              <TagBadge key={t} tag={t} onRemove={handleTagRemove} />
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input input-sm"
              placeholder="Add tag and press Enter..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd(newTagInput);
                }
              }}
            />
            {newTagInput && suggestedTags.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  zIndex: 10,
                  maxHeight: '120px',
                  overflowY: 'auto',
                }}
              >
                {suggestedTags.map(st => (
                  <div
                    key={st}
                    style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '12px' }}
                    onClick={() => handleTagAdd(st)}
                  >
                    #{st}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Similar Items */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Layers size={14} color="var(--primary)" />
            <span className="text-xs font-mono font-600 text-blue">SIMILAR ITEMS ({similarItems.length})</span>
          </div>

          {similarItems.length === 0 ? (
            <p className="text-xs text-muted">No similar items discovered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {similarItems.map(sim => (
                <div
                  key={sim.id}
                  onClick={() => setActiveItem(sim.id)}
                  style={{
                    padding: '8px 10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  className="hover:border-primary"
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
                    {sim.title || 'Untitled'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="truncate">
                    #{sim.tags.join(' #')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item Metadata Footer */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: 'auto' }} className="text-xs text-muted font-mono">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Created:</span>
            <span>{format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Views:</span>
            <span>{item.viewCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
