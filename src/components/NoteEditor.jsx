import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Highlight } from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
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
  Palette,
  Highlighter,
  ChevronDown,
  X,
  Type,
} from 'lucide-react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import TagBadge from './TagBadge';
import './NoteEditor.css';

/* ── Audio Engine ───────────────────────────────────────────── */
const AudioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

function playClick(type = 'soft') {
  if (!AudioCtx) return;
  try {
    const osc = AudioCtx.createOscillator();
    const gain = AudioCtx.createGain();
    osc.connect(gain);
    gain.connect(AudioCtx.destination);

    if (type === 'soft') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, AudioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, AudioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.06, AudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, AudioCtx.currentTime + 0.06);
      osc.start(AudioCtx.currentTime);
      osc.stop(AudioCtx.currentTime + 0.06);
    } else if (type === 'pop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, AudioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, AudioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, AudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, AudioCtx.currentTime + 0.08);
      osc.start(AudioCtx.currentTime);
      osc.stop(AudioCtx.currentTime + 0.08);
    } else if (type === 'heading') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, AudioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, AudioCtx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(440, AudioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.07, AudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, AudioCtx.currentTime + 0.1);
      osc.start(AudioCtx.currentTime);
      osc.stop(AudioCtx.currentTime + 0.1);
    } else if (type === 'color') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, AudioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, AudioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.05, AudioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, AudioCtx.currentTime + 0.07);
      osc.start(AudioCtx.currentTime);
      osc.stop(AudioCtx.currentTime + 0.07);
    }
  } catch (_) {}
}

/* ── Highlight color palette ─────────────────────────────── */
const HIGHLIGHT_COLORS = [
  { label: 'Sky',      value: '#BFDBFE', text: '#1E40AF' },
  { label: 'Lemon',    value: '#FEF08A', text: '#854D0E' },
  { label: 'Sage',     value: '#BBF7D0', text: '#065F46' },
  { label: 'Blush',    value: '#FBCFE8', text: '#9D174D' },
  { label: 'Lavender', value: '#DDD6FE', text: '#5B21B6' },
  { label: 'Peach',    value: '#FED7AA', text: '#9A3412' },
  { label: 'Mint',     value: '#A7F3D0', text: '#065F46' },
  { label: 'Rose',     value: '#FECACA', text: '#991B1B' },
];

/* ── Text color palette ──────────────────────────────────── */
const TEXT_COLORS = [
  { label: 'Default',  value: null,      preview: 'var(--text-primary)' },
  { label: 'Purple',   value: '#7C3AED', preview: '#7C3AED' },
  { label: 'Blue',     value: '#2563EB', preview: '#2563EB' },
  { label: 'Cyan',     value: '#0891B2', preview: '#0891B2' },
  { label: 'Green',    value: '#16A34A', preview: '#16A34A' },
  { label: 'Yellow',   value: '#CA8A04', preview: '#CA8A04' },
  { label: 'Orange',   value: '#EA580C', preview: '#EA580C' },
  { label: 'Red',      value: '#DC2626', preview: '#DC2626' },
  { label: 'Pink',     value: '#DB2777', preview: '#DB2777' },
  { label: 'Gray',     value: '#6B7280', preview: '#6B7280' },
];

/* ── Slash command map ───────────────────────────────────── */
const SLASH_COMMANDS = {
  '/h1': (editor) => { playClick('heading'); editor.chain().focus().toggleHeading({ level: 1 }).run(); },
  '/h2': (editor) => { playClick('heading'); editor.chain().focus().toggleHeading({ level: 2 }).run(); },
  '/h3': (editor) => { playClick('heading'); editor.chain().focus().toggleHeading({ level: 3 }).run(); },
  '/h4': (editor) => { playClick('heading'); editor.chain().focus().toggleHeading({ level: 4 }).run(); },
  '/h5': (editor) => { playClick('heading'); editor.chain().focus().toggleHeading({ level: 5 }).run(); },
  '/h6': (editor) => { playClick('heading'); editor.chain().focus().toggleHeading({ level: 6 }).run(); },
  '/bold': (editor) => { playClick('pop'); editor.chain().focus().toggleBold().run(); },
  '/italic': (editor) => { playClick('soft'); editor.chain().focus().toggleItalic().run(); },
  '/ul': (editor) => { playClick('pop'); editor.chain().focus().toggleBulletList().run(); },
  '/ol': (editor) => { playClick('pop'); editor.chain().focus().toggleOrderedList().run(); },
  '/todo': (editor) => { playClick('pop'); editor.chain().focus().toggleTaskList().run(); },
  '/quote': (editor) => { playClick('soft'); editor.chain().focus().toggleBlockquote().run(); },
  '/divider': (editor) => { playClick('soft'); editor.chain().focus().setHorizontalRule().run(); },
  '/code': (editor) => { playClick('soft'); editor.chain().focus().toggleCode().run(); },
  // text colors
  '/red':    (editor) => { playClick('color'); editor.chain().focus().setColor('#DC2626').run(); },
  '/blue':   (editor) => { playClick('color'); editor.chain().focus().setColor('#2563EB').run(); },
  '/green':  (editor) => { playClick('color'); editor.chain().focus().setColor('#16A34A').run(); },
  '/purple': (editor) => { playClick('color'); editor.chain().focus().setColor('#7C3AED').run(); },
  '/orange': (editor) => { playClick('color'); editor.chain().focus().setColor('#EA580C').run(); },
  '/pink':   (editor) => { playClick('color'); editor.chain().focus().setColor('#DB2777').run(); },
  '/yellow': (editor) => { playClick('color'); editor.chain().focus().setColor('#CA8A04').run(); },
  '/gray':   (editor) => { playClick('color'); editor.chain().focus().setColor('#6B7280').run(); },
  '/cyan':   (editor) => { playClick('color'); editor.chain().focus().setColor('#0891B2').run(); },
  '/default':(editor) => { playClick('soft'); editor.chain().focus().unsetColor().run(); },
  // highlights
  '/sky':      (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#BFDBFE' }).run(); },
  '/lemon':    (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#FEF08A' }).run(); },
  '/sage':     (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#BBF7D0' }).run(); },
  '/blush':    (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#FBCFE8' }).run(); },
  '/lavender': (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#DDD6FE' }).run(); },
  '/peach':    (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#FED7AA' }).run(); },
  '/mint':     (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#A7F3D0' }).run(); },
  '/rose':     (editor) => { playClick('color'); editor.chain().focus().setHighlight({ color: '#FECACA' }).run(); },
  '/clear':    (editor) => { playClick('soft'); editor.chain().focus().unsetHighlight().run(); },
};

/* ── Slash Command Extension ─────────────────────────────── */
const SlashCommandExtension = Extension.create({
  name: 'slashCommands',
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state, view } = this.editor;
        const { selection, doc } = state;
        const { from } = selection;
        // Get text from start of current block to cursor
        const $from = state.doc.resolve(from);
        const blockStart = $from.start();
        const textBefore = doc.textBetween(blockStart, from, '');
        const trimmed = textBefore.trim().toLowerCase();

        if (trimmed.startsWith('/') && SLASH_COMMANDS[trimmed]) {
          // Delete the slash command text in the block
          const tr = state.tr.deleteRange(blockStart, from);
          view.dispatch(tr);
          // Run the command
          SLASH_COMMANDS[trimmed](this.editor);
          return true;
        }
        return false;
      },
    };
  },
});

/* ── Slash Command Suggestion Popup ──────────────────────── */
const COMMAND_SUGGESTIONS = [
  { cmd: '/h1',      label: 'Heading 1',    icon: 'H1',  group: 'Headings' },
  { cmd: '/h2',      label: 'Heading 2',    icon: 'H2',  group: 'Headings' },
  { cmd: '/h3',      label: 'Heading 3',    icon: 'H3',  group: 'Headings' },
  { cmd: '/ul',      label: 'Bullet List',  icon: '•—',  group: 'Lists' },
  { cmd: '/ol',      label: 'Ordered List', icon: '1.',  group: 'Lists' },
  { cmd: '/todo',    label: 'Checklist',    icon: '☑',   group: 'Lists' },
  { cmd: '/quote',   label: 'Blockquote',   icon: '"',   group: 'Blocks' },
  { cmd: '/divider', label: 'Divider',      icon: '—',   group: 'Blocks' },
  { cmd: '/code',    label: 'Inline Code',  icon: '<>',  group: 'Blocks' },
  { cmd: '/bold',    label: 'Bold',         icon: 'B',   group: 'Format' },
  { cmd: '/italic',  label: 'Italic',       icon: 'I',   group: 'Format' },
  { cmd: '/red',     label: 'Red text',     icon: '🔴',  group: 'Colors' },
  { cmd: '/blue',    label: 'Blue text',    icon: '🔵',  group: 'Colors' },
  { cmd: '/green',   label: 'Green text',   icon: '🟢',  group: 'Colors' },
  { cmd: '/purple',  label: 'Purple text',  icon: '🟣',  group: 'Colors' },
  { cmd: '/orange',  label: 'Orange text',  icon: '🟠',  group: 'Colors' },
  { cmd: '/pink',    label: 'Pink text',    icon: '🩷',  group: 'Colors' },
  { cmd: '/sky',     label: 'Sky highlight',   icon: '✦', group: 'Highlight' },
  { cmd: '/lemon',   label: 'Lemon highlight', icon: '✦', group: 'Highlight' },
  { cmd: '/sage',    label: 'Sage highlight',  icon: '✦', group: 'Highlight' },
  { cmd: '/clear',   label: 'Clear highlight', icon: '✕', group: 'Highlight' },
  { cmd: '/default', label: 'Default color',   icon: 'Tx', group: 'Colors' },
];

/* ── Toolbar button ──────────────────────────────────────── */
function TBtn({ onClick, active, title, disabled, children, sound = 'soft' }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        playClick(sound);
        onClick();
      }}
      title={title}
      disabled={disabled}
      className={`tbar-btn${active ? ' tbar-btn--active' : ''}`}
    >
      {children}
    </button>
  );
}

/* ── Separator ───────────────────────────────────────────── */
function TSep() {
  return <div className="tbar-sep" />;
}

/* ── Dropdown Panel ──────────────────────────────────────── */
function DropPanel({ label, icon: Icon, children, title }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          playClick('soft');
          setOpen(o => !o);
        }}
        title={title}
        className={`tbar-btn tbar-drop${open ? ' tbar-btn--active' : ''}`}
      >
        {Icon && <Icon size={14} />}
        {label && <span style={{ fontSize: '11px', fontWeight: 600, marginLeft: 2 }}>{label}</span>}
        <ChevronDown size={10} style={{ marginLeft: 1, opacity: 0.6 }} />
      </button>
      {open && (
        <div className="drop-panel" onMouseDown={e => e.preventDefault()}>
          {children}
          <button
            className="drop-close"
            onMouseDown={(e) => { e.preventDefault(); setOpen(false); }}
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Note Editor Component ──────────────────────────── */
export default function NoteEditor() {
  const { activeNoteId, closeNote, items, updateItem } = useStore();
  const item = items.find(i => i.id === activeNoteId);
  const saveTimer = useRef(null);
  const [slashQuery, setSlashQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const editorWrapRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Start writing… or type / for commands',
        emptyEditorClass: 'is-editor-empty',
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      SlashCommandExtension,
    ],
    content: item?.richContent || (item?.content
      ? `<p>${item.content.replace(/\n/g, '</p><p>')}</p>`
      : ''),
    onUpdate: ({ editor }) => {
      if (!item) return;

      // Live slash command detection
      const { state } = editor;
      const { selection, doc } = state;
      const { from } = selection;
      const $from = state.doc.resolve(from);
      const blockStart = $from.start();
      const textBefore = doc.textBetween(blockStart, from, '');
      const match = textBefore.match(/(\/[\w]*)$/);

      if (match && match[1].length >= 1) {
        const query = match[1].toLowerCase();
        setSlashQuery(query);
        setSelectedSuggestion(0);

        // Position suggestion popup near cursor
        const coords = editor.view.coordsAtPos(from);
        if (editorWrapRef.current) {
          const rect = editorWrapRef.current.getBoundingClientRect();
          setSuggestionPos({
            top: coords.bottom - rect.top + 8,
            left: Math.min(coords.left - rect.left, rect.width - 260),
          });
        }
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        setSlashQuery('');
      }

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

  // Keyboard navigation for slash suggestions
  useEffect(() => {
    if (!showSuggestions) return;
    function handleKey(e) {
      const filtered = COMMAND_SUGGESTIONS.filter(s =>
        s.cmd.startsWith(slashQuery) || s.label.toLowerCase().includes(slashQuery.slice(1))
      );
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(i => Math.max(i - 1, 0));
      } else if (e.key === 'Tab' && filtered.length > 0) {
        e.preventDefault();
        applySuggestion(filtered[selectedSuggestion]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [showSuggestions, slashQuery, selectedSuggestion]);

  const applySuggestion = useCallback((suggestion) => {
    if (!editor || !suggestion) return;
    setShowSuggestions(false);
    // Delete slash text
    const { state, view } = editor;
    const { from } = state.selection;
    const $from = state.doc.resolve(from);
    const blockStart = $from.start();
    const text = state.doc.textBetween(blockStart, from, '');
    const match = text.match(/(\/[\w]*)$/);
    if (match) {
      const tr = state.tr.deleteRange(from - match[1].length, from);
      view.dispatch(tr);
    }
    const fn = SLASH_COMMANDS[suggestion.cmd];
    if (fn) fn(editor);
  }, [editor]);

  if (!item) return null;

  const setHighlight = (color) => {
    playClick('color');
    if (!color) {
      editor?.commands.unsetHighlight();
    } else {
      editor?.chain().focus().setHighlight({ color }).run();
    }
  };

  const setTextColor = (color) => {
    playClick('color');
    if (!color) {
      editor?.chain().focus().unsetColor().run();
    } else {
      editor?.chain().focus().setColor(color).run();
    }
  };

  const isActive = (name, attrs) => editor?.isActive(name, attrs) ?? false;

  const filteredSuggestions = COMMAND_SUGGESTIONS.filter(s =>
    s.cmd.startsWith(slashQuery) || s.label.toLowerCase().includes(slashQuery.slice(1))
  );

  // Group suggestions
  const grouped = filteredSuggestions.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <div className="note-editor-root">
      {/* ── Top Navigation Bar ── */}
      <div className="note-topbar">
        <button
          onClick={() => { playClick('soft'); closeNote(); }}
          className="note-back-btn"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>

        <div className="tbar-sep" style={{ height: '18px' }} />

        <span className="font-mono note-breadcrumb-root">Notes</span>
        <span className="note-breadcrumb-arrow">›</span>
        <span className="note-breadcrumb-title">
          {item.title || 'Untitled'}
        </span>

        <div style={{ flex: 1 }} />

        <span className="font-mono note-autosave">Auto-saving</span>

        <div style={{ display: 'flex', gap: '4px' }}>
          {item.tags.slice(0, 3).map(t => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>

        <span className="font-mono note-autosave">
          {format(new Date(item.updatedAt || item.createdAt), 'MMM d, yyyy')}
        </span>
      </div>

      {/* ── Formatting Toolbar ── */}
      <div className="note-toolbar">
        {/* Headings group */}
        <TBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          active={isActive('heading', { level: 1 })}
          title="Heading 1 (type /h1 + Enter)"
          sound="heading"
        >
          <Heading1 size={15} />
        </TBtn>
        <TBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={isActive('heading', { level: 2 })}
          title="Heading 2 (type /h2 + Enter)"
          sound="heading"
        >
          <Heading2 size={15} />
        </TBtn>
        <TBtn
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          active={isActive('heading', { level: 3 })}
          title="Heading 3 (type /h3 + Enter)"
          sound="heading"
        >
          <Heading3 size={15} />
        </TBtn>

        <TSep />

        {/* Inline formatting */}
        <TBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={isActive('bold')} title="Bold (Ctrl+B)" sound="pop">
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
        <TBtn onClick={() => editor?.chain().focus().toggleCode().run()} active={isActive('code')} title="Inline Code (/code)">
          <Code size={14} />
        </TBtn>

        <TSep />

        {/* Lists */}
        <TBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={isActive('bulletList')} title="Bullet List (/ul)" sound="pop">
          <List size={15} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={isActive('orderedList')} title="Ordered List (/ol)" sound="pop">
          <ListOrdered size={15} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().toggleTaskList().run()} active={isActive('taskList')} title="Checklist (/todo)" sound="pop">
          <CheckSquare size={14} />
        </TBtn>

        <TSep />

        {/* Block elements */}
        <TBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={isActive('blockquote')} title="Blockquote (/quote)">
          <Quote size={14} />
        </TBtn>
        <TBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} active={false} title="Divider (/divider)">
          <Minus size={14} />
        </TBtn>

        <TSep />

        {/* ── Text Color Picker ── */}
        <DropPanel icon={Type} title="Text Color (or type /red, /blue…)">
          <div className="drop-panel-title">Text Color</div>
          <div className="color-grid">
            {TEXT_COLORS.map(({ label, value, preview }) => (
              <button
                key={label}
                onMouseDown={(e) => { e.preventDefault(); setTextColor(value); }}
                title={label}
                className="color-swatch text-color-swatch"
                style={{ '--swatch-color': preview }}
              >
                <span className="color-swatch-letter" style={{ color: preview === 'var(--text-primary)' ? 'var(--text-secondary)' : preview }}>A</span>
                <span className="color-swatch-label">{label}</span>
              </button>
            ))}
          </div>
          <div className="drop-hint">Or type: /red, /blue, /green…</div>
        </DropPanel>

        {/* ── Highlight Picker ── */}
        <DropPanel icon={Highlighter} title="Highlight (or type /sky, /lemon…)">
          <div className="drop-panel-title">Highlight</div>
          <div className="color-grid highlight-grid">
            {HIGHLIGHT_COLORS.map(({ label, value, text }) => (
              <button
                key={label}
                onMouseDown={(e) => { e.preventDefault(); setHighlight(value); }}
                title={label}
                className="color-swatch highlight-swatch"
                style={{ background: value, borderColor: `${text}44` }}
              >
                <span style={{ color: text, fontSize: '10px', fontWeight: 700 }}>Aa</span>
                <span className="color-swatch-label" style={{ color: text }}>{label}</span>
              </button>
            ))}
            <button
              onMouseDown={(e) => { e.preventDefault(); setHighlight(null); }}
              title="Remove highlight"
              className="color-swatch highlight-swatch highlight-none"
            >
              <Eraser size={12} color="var(--text-muted)" />
              <span className="color-swatch-label">None</span>
            </button>
          </div>
          <div className="drop-hint">Or type: /sky, /lemon, /sage…</div>
        </DropPanel>

        <TSep />

        {/* Clear formatting */}
        <TBtn
          onClick={() => { playClick('soft'); editor?.chain().focus().unsetAllMarks().clearNodes().run(); }}
          active={false}
          title="Clear all formatting"
        >
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '-0.5px' }}>Tx</span>
        </TBtn>

        {/* Slash command hint */}
        <div style={{ flex: 1 }} />
        <span className="slash-hint font-mono">
          type <kbd>/</kbd> for commands
        </span>
      </div>

      {/* ── Editor Scroll Area ── */}
      <div className="note-scroll" ref={editorWrapRef} style={{ position: 'relative' }}>
        <div className="note-content-wrap">
          {/* Editable title */}
          <input
            type="text"
            value={item.title}
            onChange={e => updateItem(item.id, { title: e.target.value })}
            placeholder="Untitled"
            className="note-title-input"
          />

          {/* Meta row */}
          <div className="note-meta-row">
            <span className="font-mono note-autosave">
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

        {/* ── Slash Command Suggestion Popup ── */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            className="slash-popup"
            style={{ top: suggestionPos.top, left: Math.max(0, suggestionPos.left) }}
            onMouseDown={e => e.preventDefault()}
          >
            <div className="slash-popup-header">
              Commands <kbd>↑↓</kbd> navigate · <kbd>Tab</kbd> select · <kbd>Enter</kbd> apply · <kbd>Esc</kbd> close
            </div>
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="slash-group-label">{group}</div>
                {items.map((s) => {
                  const idx = flatIndex++;
                  const isSelected = idx === selectedSuggestion;
                  return (
                    <button
                      key={s.cmd}
                      className={`slash-item${isSelected ? ' slash-item--selected' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); applySuggestion(s); }}
                    >
                      <span className="slash-item-icon">{s.icon}</span>
                      <span className="slash-item-label">{s.label}</span>
                      <span className="slash-item-cmd">{s.cmd}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
