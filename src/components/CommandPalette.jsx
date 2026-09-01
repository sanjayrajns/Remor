import React, { useState, useEffect, useRef } from 'react';
import { Search, Inbox, Calendar, Clock, Star, Layers, Brain, FileText, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

export default function CommandPalette({ isOpen, onClose }) {
  const { items, setActiveView, setActiveItem } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const views = [
    { type: 'view', id: 'inbox', label: 'Go to Inbox', icon: Inbox },
    { type: 'view', id: 'today', label: 'Go to Today', icon: Calendar },
    { type: 'view', id: 'upcoming', label: 'Go to Upcoming', icon: Clock },
    { type: 'view', id: 'starred', label: 'Go to Starred', icon: Star },
    { type: 'view', id: 'all', label: 'Go to All Items', icon: Layers },
    { type: 'view', id: 'insights', label: 'Go to AI Insights', icon: Brain },
  ];

  const matchingViews = views.filter(v => v.label.toLowerCase().includes(query.toLowerCase()));

  const matchingItems = query.trim()
    ? items
        .filter(i =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.content.toLowerCase().includes(query.toLowerCase()) ||
          i.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 8)
        .map(i => ({ type: 'item', id: i.id, label: i.title || 'Untitled', sub: i.tags.map(t => `#${t}`).join(' '), item: i }))
    : [];

  const results = [...matchingViews, ...matchingItems];

  const handleSelect = (result) => {
    if (!result) return;
    if (result.type === 'view') {
      setActiveView(result.id);
    } else if (result.type === 'item') {
      setActiveItem(result.id);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal animate-fade-in"
        style={{ maxWidth: '560px', marginTop: '40px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} className="text-muted" style={{ marginRight: '12px' }} />
          <input
            ref={inputRef}
            type="text"
            className="input"
            style={{ border: 'none', boxShadow: 'none', fontSize: '15px', padding: 0 }}
            placeholder="Type a command or search items..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <kbd style={{ marginLeft: 'auto' }}>ESC</kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px 0' }}>
          {results.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No matching commands or items found for "{query}"
            </div>
          ) : (
            results.map((res, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = res.icon || FileText;
              return (
                <div
                  key={`${res.type}-${res.id}`}
                  onClick={() => handleSelect(res)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    background: isSelected ? 'var(--primary-subtle)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={16} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 400, color: 'var(--text-primary)' }} className="truncate">
                      {res.label}
                    </div>
                    {res.sub && <div className="text-xs text-muted font-mono truncate">{res.sub}</div>}
                  </div>
                  {isSelected && <ArrowRight size={14} color="var(--primary)" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
