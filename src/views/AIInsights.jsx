import React from 'react';
import { Brain, AlertCircle, Tag, FolderPlus, Clock, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import useStore from '../store/useStore';

export default function AIInsightsView() {
  const { items, updateItem, addCollection, showToast, setActiveItem } = useStore();

  const activeItems = items.filter(i => i.status !== 'archived');
  const inboxItems = items.filter(i => i.status === 'inbox');
  const untaggedItems = activeItems.filter(i => !i.tags || i.tags.length === 0);

  // Forgotten items: saved > 7 days ago, viewed <= 1 time
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const forgottenItems = activeItems.filter(i => {
    const created = new Date(i.createdAt);
    return created < sevenDaysAgo && (i.viewCount || 0) <= 1;
  });

  // Duplicate candidates
  const duplicates = [];
  for (let i = 0; i < activeItems.length; i++) {
    for (let j = i + 1; j < activeItems.length; j++) {
      const a = activeItems[i];
      const b = activeItems[j];
      if (a.title && b.title && a.title.toLowerCase().trim() === b.title.toLowerCase().trim()) {
        duplicates.push({ a, b, reason: 'Identical Title' });
      } else if (a.url && b.url && a.url === b.url) {
        duplicates.push({ a, b, reason: 'Matching URL' });
      }
    }
  }

  // Tag Suggestions for untagged items
  const handleAutoTag = (item) => {
    const suggested = [];
    const lower = (item.title + ' ' + item.content).toLowerCase();
    if (lower.includes('design') || lower.includes('css') || lower.includes('ui')) suggested.push('design');
    if (lower.includes('code') || lower.includes('db') || lower.includes('engineering') || lower.includes('react')) suggested.push('engineering');
    if (lower.includes('meeting') || lower.includes('roadmap') || lower.includes('strategy')) suggested.push('work');
    if (lower.includes('read') || lower.includes('book') || lower.includes('article')) suggested.push('reading');

    const finalTags = suggested.length > 0 ? suggested : ['uncategorized'];
    updateItem(item.id, { tags: finalTags });
    showToast(`Added tags: #${finalTags.join(' #')}`, 'success');
  };

  return (
    <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Brain size={24} color="var(--primary)" />
          <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
            AI Insights & Hygiene
          </h1>
        </div>
        <p className="text-secondary text-sm">
          Intelligent analysis of your knowledge graph: surface forgotten wisdom, auto-tag items, clean duplicates, and optimize structure.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="text-xs font-mono text-muted">TOTAL ACTIVE KNOWLEDGE</div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            {activeItems.length}
          </div>
        </div>

        <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="text-xs font-mono text-muted">UNPROCESSED INBOX</div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '4px', color: inboxItems.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
            {inboxItems.length}
          </div>
        </div>

        <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="text-xs font-mono text-muted font-600">DUPLICATES DETECTED</div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '4px', color: duplicates.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {duplicates.length}
          </div>
        </div>

        <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div className="text-xs font-mono text-muted font-600">FORGOTTEN ITEMS</div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '4px', color: 'var(--primary)' }}>
            {forgottenItems.length}
          </div>
        </div>
      </div>

      {/* Section 1: Duplicate Detection */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldAlert size={18} color="var(--danger)" />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Duplicate & Overlap Detection</h2>
        </div>

        {duplicates.length === 0 ? (
          <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--success-subtle)', color: 'var(--success)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> No duplicate items found in your library.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {duplicates.map(({ a, b, reason }, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #FCA5A5',
                  background: 'var(--danger-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <span className="text-xs font-mono text-danger font-600">REASON: {reason.toUpperCase()}</span>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>
                    1) "{a.title}" vs 2) "{b.title}"
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveItem(a.id)}>Inspect Item 1</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveItem(b.id)}>Inspect Item 2</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Forgotten Knowledge Surface */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Clock size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Rediscover Forgotten Knowledge</h2>
        </div>
        <p className="text-secondary text-sm" style={{ marginBottom: '12px' }}>
          Items saved over a week ago that you haven't revisited. Bring them back into focus.
        </p>

        {forgottenItems.length === 0 ? (
          <p className="text-xs text-muted">No dormant items found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {forgottenItems.slice(0, 6).map(item => (
              <div
                key={item.id}
                style={{
                  padding: '14px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  cursor: 'pointer',
                }}
                className="hover:border-primary"
                onClick={() => setActiveItem(item.id)}
              >
                <div style={{ fontWeight: 600, fontSize: '14px' }} className="truncate">{item.title}</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }} className="truncate">{item.content || 'No content preview'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span className="text-xs text-muted font-mono">Saved {item.createdAt.split('T')[0]}</span>
                  <span className="text-xs text-blue font-500">Revisit →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Untagged Items & Auto-Tag Suggestions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Tag size={18} color="var(--warning)" />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Untagged Items ({untaggedItems.length})</h2>
        </div>

        {untaggedItems.length === 0 ? (
          <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            All items in your library have tags assigned!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {untaggedItems.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '10px 16px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: 500, fontSize: '13px' }} className="truncate">{item.title}</span>
                <button className="btn btn-primary btn-sm" onClick={() => handleAutoTag(item)}>
                  <Tag size={12} /> Auto-suggest Tag
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
