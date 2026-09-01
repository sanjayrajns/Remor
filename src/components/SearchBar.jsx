import React from 'react';
import { Search, X, Filter, Tag } from 'lucide-react';
import useStore from '../store/useStore';
import TagBadge from './TagBadge';

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    toggleTagFilter,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    clearFilters,
    getAllTags,
  } = useStore();

  const allTags = getAllTags();
  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedType !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: '36px', paddingRight: searchQuery ? '36px' : '12px', height: '40px', fontSize: '14px' }}
            placeholder="Smart search (title, content, tags, links) or natural language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn-icon"
              style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setSearchQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            className="select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ height: '40px' }}
          >
            <option value="all">All Types</option>
            <option value="link">Links</option>
            <option value="note">Notes</option>
            <option value="task">Tasks</option>
            <option value="idea">Ideas</option>
            <option value="reference">References</option>
          </select>

          <select
            className="select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ height: '40px' }}
          >
            <option value="all">All Status</option>
            <option value="inbox">Inbox</option>
            <option value="active">Active</option>
            <option value="done">Completed</option>
          </select>

          <select
            className="select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ height: '40px' }}
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ height: '40px' }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span className="text-xs text-muted font-mono" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag size={12} /> Active tags:
          </span>
          {selectedTags.map(tag => (
            <TagBadge key={tag} tag={tag} active onRemove={toggleTagFilter} />
          ))}
        </div>
      )}
    </div>
  );
}
