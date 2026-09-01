import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Link as LinkIcon, FileText, CheckSquare, Lightbulb, BookOpen } from 'lucide-react';
import useStore from '../store/useStore';
import TagBadge from '../components/TagBadge';

export default function MobileCreateView() {
  const navigate = useNavigate();
  const { addItem, collections } = useStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('note');
  const [priority, setPriority] = useState('medium');
  const [collectionId, setCollectionId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const typeOptions = [
    { id: 'note', label: 'Note', icon: FileText, color: '#7C3AED' },
    { id: 'link', label: 'Link', icon: LinkIcon, color: '#0562EF' },
    { id: 'task', label: 'Task', icon: CheckSquare, color: '#059669' },
    { id: 'idea', label: 'Idea', icon: Lightbulb, color: '#D97706' },
    { id: 'reference', label: 'Ref', icon: BookOpen, color: '#6B7280' },
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);

    const now = new Date().toISOString();
    await addItem({
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

    navigate('/app');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: 'var(--bg)', overflowY: 'auto' }}>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          className="btn-icon"
          onClick={() => navigate('/app')}
          style={{ width: '32px', height: '32px' }}
        >
          <ArrowLeft size={18} />
        </button>

        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px' }}>
          Create New Asset
        </span>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleSubmit}
          disabled={!title.trim() || isSubmitting}
          style={{ padding: '6px 14px', borderRadius: '6px' }}
        >
          <Check size={14} /> Save
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        {/* Type Selector */}
        <div>
          <label className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '6px' }}>
            ASSET TYPE
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {typeOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = type === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? opt.color : 'var(--text-secondary)',
                    background: isSelected ? 'var(--primary-subtle)' : 'var(--surface)',
                    border: isSelected ? `1px solid ${opt.color}` : '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={14} color={opt.color} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '6px' }}>
            TITLE *
          </label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Design tokens documentation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: '16px', padding: '10px 12px', borderRadius: '6px' }}
            autoFocus
            required
          />
        </div>

        {/* URL Input (if type is link or optional) */}
        {(type === 'link' || type === 'note') && (
          <div>
            <label className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '6px' }}>
              URL (OPTIONAL)
            </label>
            <input
              type="url"
              className="input font-mono text-xs"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ fontSize: '14px', padding: '10px 12px', borderRadius: '6px' }}
            />
          </div>
        )}

        {/* Content / Excerpt */}
        <div>
          <label className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '6px' }}>
            CONTENT / NOTES
          </label>
          <textarea
            className="textarea"
            placeholder="Add details, notes, or descriptions..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            style={{ fontSize: '15px', padding: '10px 12px', borderRadius: '6px' }}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '6px' }}>
            TAGS
          </label>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {tags.map(t => (
              <TagBadge key={t} tag={t} onRemove={() => handleRemoveTag(t)} />
            ))}
          </div>
          <input
            type="text"
            className="input input-sm"
            placeholder="Type tag and press Enter..."
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag(tagsInput);
              }
            }}
            style={{ fontSize: '14px', padding: '8px 12px', borderRadius: '6px' }}
          />
        </div>

        {/* Meta Grid: Priority & Collection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '6px' }}>
              PRIORITY
            </label>
            <select
              className="select w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ height: '40px', borderRadius: '6px' }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '6px' }}>
              COLLECTION
            </label>
            <select
              className="select w-full"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              style={{ height: '40px', borderRadius: '6px' }}
            >
              <option value="">(No Collection)</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!title.trim() || isSubmitting}
          style={{ marginTop: '12px', padding: '14px', fontSize: '15px', justifyContent: 'center', borderRadius: '6px' }}
        >
          Create Asset
        </button>
      </form>
    </div>
  );
}
