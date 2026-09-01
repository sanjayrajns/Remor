import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Highlight } from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Eraser,
} from 'lucide-react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import TagBadge from './TagBadge';
import './NoteEditor.css';

/* ── Highlight color palette ─────────────────────────────── */
const HIGHLIGHT_COLORS = [
  { label: 'Sky',    value: '#DBEAFE', text: '#1E40AF' },
  { label: 'Lemon',  value: '#FEF9C3', text: '#854D0E' },
  { label: 'Beige',  value: '#FEF3C7', text: '#92400E' },
  { label: 'Sage',   value: '#D1FAE5', text: '#065F46' },
  { label: 'Blush',  value: '#FCE7F3', text: '#9D174D' },
  { label: 'Mist',   value: '#E0F2FE', text: '#0C4A6E' },
  { label: 'Lavender', value: '#EDE9FE', text: '#5B21B6' },
  { label: 'None',   value: null,      text: null },
];

/* ── Toolbar button ──────────────────────────────────────── */
function TBtn({ onClick, active, title, disabled, children }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        background: active ? 'var(--primary-subtle)' : 'transparent',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        border: active ? '1px solid var(--primary-subtle-hover)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'background 120ms ease, color 120ms ease',
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        fontWeight: 600,
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'var(--surface-hover)';
          e.currentTarget.style.borderColor = 'var(--border)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      {children}
    </button>
  );
}

/* ── Separator ───────────────────────────────────────────── */
function TSep() {
  return (
    <div style={{ width: '1px', height: '18px', background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />
  );
}

/* ── Main Note Editor Component ──────────────────────────── */
export default function NoteEditor() {
  const { activeNoteId, closeNote, items, updateItem, activeView } = useStore();
  const item = items.find(i => i.id === activeNoteId);
  const saveTimer = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Placeholder.configure({
        placeholder: 'Start writing your note… use the toolbar to format, highlight, and structure your thoughts.',
        emptyEditorClass: 'is-editor-empty',
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: item?.richContent || (item?.content
      ? `<p>${item.content.replace(/\n/g, '</p><p>')}</p>`
      : ''),
    onUpdate: ({ editor }) => {
      if (!item) return;
      // Debounced auto-save
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateItem(item.id, {
          richContent: editor.getHTML(),
          content: editor.getText(),
        });
      }, 600);
    },
    autofocus: false,
    editorProps: {
      attributes: {
        class: 'brainly-editor',
        spellcheck: 'true',
      },
    },
  }, [activeNoteId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(saveTimer.current);
  }, []);

  if (!item) return null;

  const setHighlight = (color) => {
    if (!color) {
      editor?.commands.unsetHighlight();
    } else {
      editor?.chain().focus().setHighlight({ color }).run();
    }
  };

  const isActive = (name, attrs) => editor?.isActive(name, attrs) ?? false;

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Top Navigation Bar ── */}
      <div
        style={{
          height: '52px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '16px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={closeNote}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            transition: 'color 120ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={15} />
          <span style={{ fontFamily: 'var(--font-sans)' }}>Back</span>
        </button>

        <div style={{ width: '1px', height: '18px', background: 'var(--border)' }} />

        {/* Breadcrumb */}
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Notes
        </span>
        <span style={{ color: 'var(--border-strong)', fontSize: '11px' }}>›</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title || 'Untitled'}
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Auto-save indicator */}
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Auto-saving
        </span>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {item.tags.slice(0, 3).map(t => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>

        {/* Date */}
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {format(new Date(item.updatedAt || item.createdAt), 'MMM d, yyyy')}
        </span>
      </div>

      {/* ── Formatting Toolbar ── */}
      <div
        style={{
          height: '46px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: '2px',
          flexShrink: 0,
          overflowX: 'auto',
        }}
      >
        {/* Headings */}
        <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={15} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={15} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={15} />
        </TBtn>

        <TSep />

        {/* Inline formatting */}
        <TBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={isActive('bold')} title="Bold (Ctrl+B)">
          <Bold size={14} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={isActive('italic')} title="Italic (Ctrl+I)">
          <Italic size={14} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={isActive('underline')} title="Underline (Ctrl+U)">
          <UnderlineIcon size={14} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleStrike().run()} active={isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleCode().run()} active={isActive('code')} title="Inline Code">
          <Code size={14} />
        </TBtn>

        <TSep />

        {/* Lists */}
        <TBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={isActive('bulletList')} title="Bullet List">
          <List size={15} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={isActive('orderedList')} title="Ordered List">
          <ListOrdered size={15} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleTaskList().run()} active={isActive('taskList')} title="Checklist">
          <CheckSquare size={14} />
        </TBtn>

        <TSep />

        {/* Block elements */}
        <TBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={isActive('blockquote')} title="Blockquote">
          <Quote size={14} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} active={false} title="Divider">
          <Minus size={14} />
        </TBtn>

        <TSep />

        {/* Highlight swatches */}
        <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '4px', letterSpacing: '0.06em' }}>HIGHLIGHT</span>
        {HIGHLIGHT_COLORS.map(({ label, value, text }) => (
          value ? (
            <button
              key={label}
              onMouseDown={(e) => { e.preventDefault(); setHighlight(value); }}
              title={label}
              style={{
                width: '22px',
                height: '22px',
                background: value,
                border: `1px solid ${text}44`,
                cursor: 'pointer',
                flexShrink: 0,
                position: 'relative',
              }}
            />
          ) : (
            <button
              key="none"
              onMouseDown={(e) => { e.preventDefault(); setHighlight(null); }}
              title="Remove highlight"
              style={{
                width: '22px',
                height: '22px',
                background: 'transparent',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Eraser size={11} color="var(--text-muted)" />
            </button>
          )
        ))}

        <TSep />

        {/* Clear formatting */}
        <TBtn
          onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
          active={false}
          title="Clear all formatting"
        >
          <span style={{ fontSize: '11px' }}>Tx</span>
        </TBtn>
      </div>

      {/* ── Editor Scroll Area ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 0 80px',
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            padding: '48px 40px 0',
          }}
        >
          {/* Editable title */}
          <input
            type="text"
            value={item.title}
            onChange={e => updateItem(item.id, { title: e.target.value })}
            placeholder="Untitled"
            style={{
              width: '100%',
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              padding: '0',
              marginBottom: '12px',
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
            }}
          />

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '36px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {format(new Date(item.createdAt), 'MMMM d, yyyy')}
            </span>
            {item.tags.length > 0 && (
              <>
                <div style={{ width: '1px', height: '12px', background: 'var(--border)' }} />
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {item.tags.map(t => <TagBadge key={t} tag={t} />)}
                </div>
              </>
            )}
          </div>

          {/* TipTap Editor */}
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
