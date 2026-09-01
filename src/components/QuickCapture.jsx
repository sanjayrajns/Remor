import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, Link as LinkIcon, FileText, CheckSquare, Lightbulb, BookOpen } from 'lucide-react';
import useStore from '../store/useStore';
import TagBadge from './TagBadge';

export default function QuickCapture({ isOpen, onClose }) {
  const { addItem, items, collections, showToast } = useStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('note');
  const [priority, setPriority] = useState('medium');
  const [collectionId, setCollectionId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState([]);
  const [dueDate, setDueDate] = useState('');

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setUrl('');
      setType('note');
      setPriority('medium');
      setCollectionId('');
      setTagsInput('');
      setTags([]);
      setDueDate('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto-detect URL in title/content or change type to link if URL present
  const handleUrlBlur = (val) => {
    if (val.startsWith('http://') || val.startsWith('https://')) {
      setType('link');
    }
  };

  // Duplicate Check
  const duplicate = items.find(i => {
    if (!title) return false;
    const cleanTitle = title.toLowerCase().trim();
    return i.title.toLowerCase().trim() === cleanTitle || (url && i.url === url);
  });

  const handleAddTag = (t) => {
    const clean = t.trim().toLowerCase().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagsInput('');
  };

  const handleRemoveTag = (t) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date().toISOString();
    const id = addItem({
      title: title.trim(),
      content: content.trim(),
      url: url.trim() || null,
      type,
      priority,
      collectionId: collectionId || null,
      tags,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status: 'inbox',
      createdAt: now,
      updatedAt: now,
    });

    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px' }}>
              Quick Capture
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Duplicate Warning */}
        {duplicate && (
          <div
            style={{
              background: 'var(--warning-subtle)',
              borderBottom: '1px solid #FDE68A',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--warning)',
            }}
          >
            <AlertTriangle size={14} />
            <span>Possible duplicate found: <strong>"{duplicate.title}"</strong></span>
          </div>
        )}

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Title */}
          <input
            type="text"
            className="input"
            style={{ fontSize: '16px', fontWeight: 600, height: '42px' }}
            placeholder="Title / Link / Thought / Task name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => handleUrlBlur(e.target.value)}
            autoFocus
          />

          {/* URL optional */}
          <input
            type="text"
            className="input input-sm font-mono"
            placeholder="URL (optional: https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={(e) => handleUrlBlur(e.target.value)}
          />

          {/* Content / Memo */}
          <textarea
            className="textarea"
            placeholder="Content, description, notes, or excerpt..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Tags */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
              {tags.map(t => (
                <TagBadge key={t} tag={t} onRemove={handleRemoveTag} />
              ))}
            </div>
            <input
              type="text"
              className="input input-sm"
              placeholder="Add tag and hit Enter..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(tagsInput);
                }
              }}
            />
          </div>

          {/* Controls Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>TYPE</label>
              <select className="select w-full" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="note">Note</option>
                <option value="link">Link</option>
                <option value="task">Task</option>
                <option value="idea">Idea</option>
                <option value="reference">Reference</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>PRIORITY</label>
              <select className="select w-full" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>COLLECTION</label>
              <select className="select w-full" value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
                <option value="">(None)</option>
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-muted" style={{ display: 'block', marginBottom: '4px' }}>DUE DATE</label>
              <input
                type="date"
                className="input input-sm w-full"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span className="text-xs text-muted font-mono">Press Ctrl+Enter to save</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!title.trim()}>
                Save to Remor
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
