import React, { useState } from 'react';
import {
  Link as LinkIcon,
  FileText,
  CheckSquare,
  Lightbulb,
  BookOpen,
  Star,
  Check,
  Archive,
  Trash2,
  Calendar,
  ExternalLink,
  Copy,
  Folder,
  Globe,
  Edit3,
  Pencil,
} from 'lucide-react';
import useStore from '../store/useStore';
import TagBadge from './TagBadge';
import { formatDistanceToNow, format } from 'date-fns';

/* ── Type metadata ──────────────────────────────────────────── */
const TYPE_ICONS = {
  link:      LinkIcon,
  note:      FileText,
  task:      CheckSquare,
  idea:      Lightbulb,
  reference: BookOpen,
};

const TYPE_PREVIEW_STYLES = {
  link:      { bg: '#EAF2FF', accent: '#0562EF', label: 'LINK' },
  note:      { bg: '#F3F0FF', accent: '#7C3AED', label: 'NOTE' },
  task:      { bg: '#ECFDF5', accent: '#059669', label: 'TASK' },
  idea:      { bg: '#FFFBEB', accent: '#D97706', label: 'IDEA' },
  reference: { bg: '#F1F5F9', accent: '#475569', label: 'REF' },
};

/* ── Helpers ────────────────────────────────────────────────── */
function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

/* ── Preview area at top of card ─────────────────────────────── */
function CardPreview({ item }) {
  const style = TYPE_PREVIEW_STYLES[item.type] || TYPE_PREVIEW_STYLES.note;
  const TypeIcon = TYPE_ICONS[item.type] || FileText;
  const [imgError, setImgError] = useState(false);
  const faviconUrl = item.url ? getFaviconUrl(item.url) : null;

  return (
    <div
      style={{
        height: '132px',
        background: style.bg,
        borderBottom: `1px solid ${style.accent}22`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${style.accent}14 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
          pointerEvents: 'none',
        }}
      />

      {/* Link type: favicon + domain */}
      {item.type === 'link' && item.url && !imgError ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 1 }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#fff',
              border: `1px solid ${style.accent}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 1px 8px ${style.accent}18`,
            }}
          >
            <img
              src={faviconUrl}
              alt=""
              width={28}
              height={28}
              style={{ display: 'block' }}
              onError={() => setImgError(true)}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: style.accent,
              fontWeight: 500,
              letterSpacing: '0.03em',
              maxWidth: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {getDomain(item.url)}
          </span>
        </div>
      ) : item.type === 'note' && item.content ? (
        /* Note type: content typography preview */
        <div
          style={{
            zIndex: 1,
            padding: '0 20px',
            width: '100%',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: style.accent,
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              opacity: 0.85,
              margin: 0,
            }}
          >
            {item.content}
          </p>
        </div>
      ) : (
        /* Default: large icon */
        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#fff',
              border: `1px solid ${style.accent}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TypeIcon size={22} color={style.accent} strokeWidth={1.5} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: style.accent,
              fontWeight: 600,
              letterSpacing: '0.08em',
            }}
          >
            {style.label}
          </span>
        </div>
      )}

      {/* Type badge — top left */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#fff',
          border: `1px solid ${style.accent}33`,
          padding: '2px 7px',
          zIndex: 2,
        }}
      >
        <TypeIcon size={11} color={style.accent} />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 600,
            color: style.accent,
            letterSpacing: '0.08em',
          }}
        >
          {style.label}
        </span>
      </div>

      {/* External link — top right for links */}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '26px',
            height: '26px',
            background: '#fff',
            border: `1px solid ${style.accent}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            color: style.accent,
          }}
          title="Open link"
        >
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

/* ── Main Card ───────────────────────────────────────────────── */
export default function ItemCard({ item }) {
  const {
    activeItemId,
    setActiveItem,
    openNote,
    toggleStar,
    markDone,
    archiveItem,
    deleteItem,
    duplicateItem,
    collections,
    toggleTagFilter,
    selectedTags,
  } = useStore();

  const [hovered, setHovered] = useState(false);
  const isSelected = activeItemId === item.id;
  const collection = collections.find(c => c.id === item.collectionId);
  const style = TYPE_PREVIEW_STYLES[item.type] || TYPE_PREVIEW_STYLES.note;

  const getPriorityColor = () => {
    switch (item.priority) {
      case 'urgent': return 'var(--priority-urgent)';
      case 'high':   return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      default:       return 'transparent';
    }
  };

  /* ── Primary Action on Card Click ──────────────────────────── */
  const handleCardClick = (e) => {
    // If user clicked an internal link, tag, or button, don't trigger card click
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.tag')) {
      return;
    }

    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (item.type === 'note') {
      openNote(item.id);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      openNote(item.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: isSelected ? 'var(--primary-subtle)' : 'var(--bg)',
        border: `1px solid ${isSelected ? 'var(--primary)' : hovered ? 'var(--border-strong)' : 'var(--border)'}`,
        cursor: 'pointer',
        transition: 'border-color 120ms ease',
        position: 'relative',
        animation: 'fadeIn 200ms ease forwards',
      }}
    >
      {/* Priority top stripe */}
      {item.priority !== 'low' && (
        <div
          style={{
            height: '2px',
            background: getPriorityColor(),
            flexShrink: 0,
          }}
        />
      )}

      {/* Image / Visual preview */}
      <CardPreview item={item} />

      {/* Card body */}
      <div style={{ padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {/* Title */}
        <h4
          style={{
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-primary)',
            lineHeight: 1.35,
            textDecoration: item.status === 'done' ? 'line-through' : 'none',
            opacity: item.status === 'done' ? 0.55 : 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
          }}
        >
          {item.title || 'Untitled'}
        </h4>

        {/* Content preview — only for non-note (note shows it in preview area) */}
        {item.content && item.type !== 'note' && (
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              margin: 0,
            }}
          >
            {item.content}
          </p>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {item.tags.slice(0, 3).map(t => (
              <TagBadge
                key={t}
                tag={t}
                active={selectedTags.includes(t)}
                onClick={() => toggleTagFilter(t)}
              />
            ))}
            {item.tags.length > 3 && (
              <span className="tag text-muted">+{item.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '8px',
            borderTop: '1px solid var(--border)',
          }}
        >
          {/* Date + collection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            {item.dueDate ? (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: new Date(item.dueDate) < new Date() ? 'var(--danger)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Calendar size={10} />
                {format(new Date(item.dueDate), 'MMM d')}
              </span>
            ) : (
              <span
                className="font-mono"
                style={{ fontSize: '10px', color: 'var(--text-muted)' }}
                title={item.createdAt ? format(new Date(item.createdAt), 'EEEE, MMMM d, yyyy · h:mm a') : ''}
              >
                {item.createdAt ? format(new Date(item.createdAt), 'MMM d, h:mm a') : 'Just now'}
              </span>
            )}
            {collection && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Folder size={10} />
                {collection.name}
              </span>
            )}
          </div>

          {/* Quick actions — always visible, minimal */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0px', flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.type === 'task' && (
              <button
                className={`btn-icon ${item.status === 'done' ? 'active' : ''}`}
                title={item.status === 'done' ? 'Mark incomplete' : 'Mark done'}
                onClick={() => markDone(item.id)}
                style={{ width: '24px', height: '24px' }}
              >
                <Check size={13} />
              </button>
            )}
            <button
              className={`btn-icon ${item.starred ? 'active' : ''}`}
              title={item.starred ? 'Unstar' : 'Star'}
              onClick={() => toggleStar(item.id)}
              style={{ width: '24px', height: '24px' }}
            >
              <Star size={13} fill={item.starred ? 'var(--primary)' : 'none'} />
            </button>
            <button
              className="btn-icon"
              title="Edit Details"
              onClick={() => setActiveItem(item.id)}
              style={{ width: '24px', height: '24px' }}
            >
              <Pencil size={12} />
            </button>
            {hovered && (
              <>
                <button
                  className="btn-icon"
                  title="Archive"
                  onClick={() => archiveItem(item.id)}
                  style={{ width: '24px', height: '24px' }}
                >
                  <Archive size={12} />
                </button>
                <button
                  className="btn-icon"
                  title="Delete"
                  onClick={() => deleteItem(item.id)}
                  style={{ width: '24px', height: '24px' }}
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
