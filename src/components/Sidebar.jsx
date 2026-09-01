import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Calendar,
  Clock,
  Star,
  Layers,
  FolderPlus,
  Tag,
  Plus,
  ChevronLeft,
  ChevronRight,
  Brain,
  Folder,
  BookOpen,
  X
} from 'lucide-react';
import useStore from '../store/useStore';
import TagBadge from './TagBadge';

export default function Sidebar({ onOpenQuickCapture, onOpenCommandPalette, onOpenHowToUse, isMobileOpen, onCloseMobile }) {
  const navigate = useNavigate();
  const {
    activeView,
    setActiveView,
    getInboxCount,
    getTodayItems,
    getUpcomingItems,
    items,
    collections,
    addCollection,
    getAllTags,
    selectedTags,
    toggleTagFilter,
    sidebarCollapsed,
    toggleSidebar,
  } = useStore();

  const [newCollectionName, setNewCollectionName] = useState('');
  const [showAddCollection, setShowAddCollection] = useState(false);

  const inboxCount = getInboxCount();
  const todayCount = getTodayItems().length;
  const upcomingCount = getUpcomingItems().length;
  const starredCount = items.filter(i => i.starred && i.status !== 'archived').length;
  const topTags = getAllTags().slice(0, 10);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    addCollection({ name: newCollectionName.trim() });
    setNewCollectionName('');
    setShowAddCollection(false);
  };

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: inboxCount },
    { id: 'today', label: 'Today', icon: Calendar, count: todayCount },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: upcomingCount },
    { id: 'starred', label: 'Starred', icon: Star, count: starredCount },
    { id: 'recent', label: 'Recently Viewed', icon: Clock },
    { id: 'all', label: 'All Items', icon: Layers, count: items.filter(i => i.status !== 'archived').length },
    { id: 'insights', label: 'AI Insights', icon: Brain, badge: 'AI' },
  ];

  return (
    <aside
      className={`mobile-sidebar-drawer ${isMobileOpen ? 'open' : ''}`}
      style={{
        width: sidebarCollapsed ? '64px' : 'var(--sidebar-width)',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width var(--transition-slow)',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Header / Logo */}
      <div
        style={{
          height: 'var(--header-height)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {!sidebarCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '26px',
                padding: '0 4px',
                background: '#0B1015',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                borderRadius: '4px',
              }}
            >
              Re
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
              Remor
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            className="btn-icon mobile-hide"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {onCloseMobile && (
            <button
              className="btn-icon"
              onClick={onCloseMobile}
              title="Close menu"
              style={{ width: '32px', height: '32px', borderRadius: '6px' }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Capture Button */}
      <div style={{ padding: '12px 16px' }}>
        <button
          className="btn btn-primary w-full"
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: sidebarCollapsed ? '8px' : '8px 12px' }}
          onClick={() => {
            onOpenQuickCapture();
            onCloseMobile?.();
          }}
          title="Quick Capture (Ctrl+K)"
        >
          <Plus size={16} />
          {!sidebarCollapsed && <span>Quick Capture</span>}
        </button>
      </div>

      {/* Primary Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onCloseMobile?.();
                  if (item.id === 'landing') {
                    navigate('/');
                  } else {
                    setActiveView(item.id);
                    navigate(item.id === 'inbox' ? '/app' : `/app/${item.id}`);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--primary-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background var(--transition), color var(--transition)',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary)' : 'var(--text-secondary)'} />
                {!sidebarCollapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="font-mono text-xs text-muted" style={{ background: 'var(--border)', padding: '1px 5px' }}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="font-mono text-xs text-blue" style={{ background: 'var(--primary-subtle)', padding: '1px 5px', fontWeight: 600 }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Collections Section */}
        {!sidebarCollapsed && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: '6px' }}>
              <span className="text-xs font-mono text-muted font-600">COLLECTIONS</span>
              <button
                className="btn-icon"
                style={{ width: '20px', height: '20px' }}
                onClick={() => setShowAddCollection(true)}
                title="Add Collection"
              >
                <Plus size={12} />
              </button>
            </div>

            {showAddCollection && (
              <form onSubmit={handleCreateCollection} style={{ padding: '4px 8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="input input-sm w-full"
                  placeholder="Collection name..."
                  autoFocus
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  onBlur={() => setShowAddCollection(false)}
                />
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {collections.map(col => {
                const count = items.filter(i => i.collectionId === col.id && i.status !== 'archived').length;
                const isActive = activeView === `col-${col.id}`;
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      onCloseMobile?.();
                      setActiveView(`col-${col.id}`);
                      navigate(`/app/collection/${col.id}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      fontSize: '13px',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--primary-subtle)' : 'transparent',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <span>{col.icon || '📁'}</span>
                    <span style={{ flex: 1 }} className="truncate">{col.name}</span>
                    <span className="font-mono text-xs text-muted">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Tags Cloud */}
        {!sidebarCollapsed && topTags.length > 0 && (
          <div style={{ padding: '0 8px', marginBottom: '16px' }}>
            <span className="text-xs font-mono text-muted font-600" style={{ display: 'block', marginBottom: '8px' }}>
              TOP TAGS
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {topTags.map(({ tag, count }) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  count={count}
                  active={selectedTags.includes(tag)}
                  onClick={() => toggleTagFilter(tag)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer shortcut helper & How to Use Guide button */}
      {!sidebarCollapsed && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <button
            onClick={onOpenHowToUse}
            style={{
              width: '100%',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--primary-subtle)',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={14} />
              <span>How to Use Guide</span>
            </div>
            <span className="font-mono text-xs" style={{ background: '#FFFFFF', border: '1px solid #BFDBFE', padding: '1px 5px', fontSize: '10px' }}>
              GUIDE
            </span>
          </button>

          <div style={{ padding: '12px 16px', fontSize: '11px', color: 'var(--text-muted)' }} className="font-mono">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Search / Command:</span>
              <kbd>Ctrl+P</kbd>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Quick Capture:</span>
              <kbd>Ctrl+K</kbd>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
