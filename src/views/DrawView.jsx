import React, {
  useRef, useEffect, useReducer, useCallback, useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & DEFAULTS
   ───────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'remor-draw-pages';
const HISTORY_LIMIT = 60;
const AUTOSAVE_DELAY = 500;

const DEFAULT_STYLE = {
  stroke: '#2D2A26',
  fill: 'transparent',
  fillOpacity: 0.12,
  strokeWidth: 1.5,
  fontSize: 14,
  fontFamily: 'DM Mono, monospace',
  opacity: 1,
  roughness: 0,
  arrowStart: 'none',
  arrowEnd: 'arrow',
  dash: 'solid',
};

const COLORS = [
  'transparent', '#2D2A26', '#4B5563', '#2563EB', '#0D9488',
  '#059669', '#D97706', '#DC2626', '#9333EA', '#DB2777', '#FFFFFF',
];

const TOOLS = [
  { id: 'select', label: 'Select', key: 'v', icon: SelectIcon },
  { id: 'text', label: 'Text', key: 't', icon: TextIcon },
  { id: 'rectangle', label: 'Rectangle', key: 'r', icon: RectIcon },
  { id: 'diamond', label: 'Diamond', key: 'd', icon: DiamondIcon },
  { id: 'ellipse', label: 'Ellipse', key: 'e', icon: EllipseIcon },
  { id: 'cylinder', label: 'Cylinder (DB)', key: 'b', icon: CylinderIcon },
  { id: 'hexagon', label: 'Hexagon', key: 'h', icon: HexIcon },
  { id: 'cloud', label: 'Cloud', key: 'c', icon: CloudIcon },
  null, // divider
  { id: 'arrow', label: 'Arrow', key: 'a', icon: ArrowIcon },
  { id: 'line', label: 'Line', key: 'l', icon: LineIcon },
  { id: 'freehand', label: 'Freehand', key: 'f', icon: FreehandIcon },
  null, // divider
  { id: 'eraser', label: 'Eraser', key: 'x', icon: EraserIcon },
];

/* ─────────────────────────────────────────────────────────────
   ICON COMPONENTS (SVG)
   ───────────────────────────────────────────────────────────── */
function SelectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3l14 9-7 1-4 7z"/>
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
    </svg>
  );
}
function RectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="1"/>
    </svg>
  );
}
function DiamondIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 10-10 10L2 12z"/>
    </svg>
  );
}
function EllipseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="10" ry="7"/>
    </svg>
  );
}
function CylinderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <ellipse cx="12" cy="6" rx="8" ry="3"/>
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
    </svg>
  );
}
function HexIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  );
}
function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function FreehandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17c3-3 6-3 9 0s6 3 9 0"/>
    </svg>
  );
}
function EraserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20H7L3 16l10-10 7 7-4.5 4.5"/>
      <path d="M6.5 17.5l1-1"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   GEOMETRY & HANDLE HELPERS
   ───────────────────────────────────────────────────────────── */
function normalizeRect(x1, y1, x2, y2) {
  return {
    x: Math.min(x1, x2), y: Math.min(y1, y2),
    w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
  };
}

function getBBox(el) {
  if (el.type === 'arrow' || el.type === 'line') {
    return {
      x: Math.min(el.x1, el.x2), y: Math.min(el.y1, el.y2),
      w: Math.abs(el.x2 - el.x1), h: Math.abs(el.y2 - el.y1),
    };
  }
  if (el.type === 'freehand') {
    if (!el.points || !el.points.length) return { x: 0, y: 0, w: 0, h: 0 };
    const xs = el.points.map(p => p[0]);
    const ys = el.points.map(p => p[1]);
    const minX = Math.min(...xs); const maxX = Math.max(...xs);
    const minY = Math.min(...ys); const maxY = Math.max(...ys);
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }
  return { x: el.x || 0, y: el.y || 0, w: el.w || 0, h: el.h || 0 };
}

function getHandles(el) {
  if (el.type === 'arrow' || el.type === 'line') {
    return [
      { id: 'start', x: el.x1, y: el.y1, cursor: 'crosshair' },
      { id: 'end', x: el.x2, y: el.y2, cursor: 'crosshair' },
    ];
  }
  const bb = getBBox(el);
  if (!bb.w && !bb.h) return [];
  const { x, y, w, h } = bb;
  return [
    { id: 'nw', x: x, y: y, cursor: 'nwse-resize' },
    { id: 'n', x: x + w / 2, y: y, cursor: 'ns-resize' },
    { id: 'ne', x: x + w, y: y, cursor: 'nesw-resize' },
    { id: 'w', x: x, y: y + h / 2, cursor: 'ew-resize' },
    { id: 'e', x: x + w, y: y + h / 2, cursor: 'ew-resize' },
    { id: 'sw', x: x, y: y + h, cursor: 'nesw-resize' },
    { id: 's', x: x + w / 2, y: y + h, cursor: 'ns-resize' },
    { id: 'se', x: x + w, y: y + h, cursor: 'nwse-resize' },
  ];
}

function getHandleAtPosition(el, wx, wy, scale = 1) {
  const handles = getHandles(el);
  const tol = 10 / scale;
  for (const h of handles) {
    if (Math.hypot(wx - h.x, wy - h.y) <= tol) {
      return h;
    }
  }
  return null;
}

function hitTestElement(el, px, py) {
  if (el.type === 'freehand') {
    if (!el.points || el.points.length < 2) return false;
    for (let i = 0; i < el.points.length - 1; i++) {
      const [x1, y1] = el.points[i];
      const [x2, y2] = el.points[i + 1];
      if (distToSegment(px, py, x1, y1, x2, y2) < (el.style.strokeWidth + 6)) return true;
    }
    return false;
  }
  if (el.type === 'arrow' || el.type === 'line') {
    return distToSegment(px, py, el.x1, el.y1, el.x2, el.y2) < (el.style.strokeWidth + 6);
  }
  if (el.type === 'text') {
    return px >= el.x && px <= el.x + (el.w || 100) && py >= el.y && py <= el.y + (el.h || 28);
  }
  const { x, y, w, h } = el;
  if (!w || !h) return false;
  const fill = el.style.fill !== 'transparent' && el.style.fill;
  if (fill) return px >= x && px <= x + w && py >= y && py <= y + h;
  const tol = el.style.strokeWidth + 6;
  const inside = px >= x - tol && px <= x + w + tol && py >= y - tol && py <= y + h + tol;
  const outside = px <= x + tol || px >= x + w - tol || py <= y + tol || py >= y + h - tol;
  return inside && outside;
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1; const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/* ─────────────────────────────────────────────────────────────
   CANVAS RENDERING
   ───────────────────────────────────────────────────────────── */
function drawElement(ctx, el) {
  ctx.save();
  ctx.globalAlpha = el.style.opacity ?? 1;
  ctx.strokeStyle = el.style.stroke || '#2D2A26';
  ctx.lineWidth = el.style.strokeWidth || 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (el.style.dash === 'dashed') ctx.setLineDash([8, 4]);
  else if (el.style.dash === 'dotted') ctx.setLineDash([2, 4]);
  else ctx.setLineDash([]);

  const fillColor = el.style.fill && el.style.fill !== 'transparent' ? el.style.fill : null;

  function applyFill() {
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = (el.style.fillOpacity ?? 0.12) * (el.style.opacity ?? 1);
      ctx.fill();
      ctx.globalAlpha = el.style.opacity ?? 1;
    }
  }

  switch (el.type) {
    case 'rectangle': {
      const { x, y, w, h } = el;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      applyFill();
      ctx.stroke();
      if (el.label) drawLabel(ctx, el.label, x + w / 2, y + h / 2, el.style);
      break;
    }
    case 'diamond': {
      const { x, y, w, h } = el;
      const cx = x + w / 2; const cy = y + h / 2;
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(x + w, cy);
      ctx.lineTo(cx, y + h);
      ctx.lineTo(x, cy);
      ctx.closePath();
      applyFill();
      ctx.stroke();
      if (el.label) drawLabel(ctx, el.label, cx, cy, el.style);
      break;
    }
    case 'ellipse': {
      const { x, y, w, h } = el;
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
      applyFill();
      ctx.stroke();
      if (el.label) drawLabel(ctx, el.label, x + w / 2, y + h / 2, el.style);
      break;
    }
    case 'cylinder': {
      const { x, y, w, h } = el;
      const ry = Math.max(4, h * 0.15);
      ctx.beginPath();
      ctx.moveTo(x, y + ry);
      ctx.lineTo(x, y + h - ry);
      ctx.ellipse(x + w / 2, y + h - ry, Math.max(1, w / 2), ry, 0, Math.PI, 0);
      ctx.lineTo(x + w, y + ry);
      ctx.ellipse(x + w / 2, y + ry, Math.max(1, w / 2), ry, 0, 0, Math.PI);
      ctx.closePath();
      applyFill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + ry, Math.max(1, w / 2), ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (el.label) drawLabel(ctx, el.label, x + w / 2, y + h / 2 + ry * 0.5, el.style);
      break;
    }
    case 'hexagon': {
      const { x, y, w, h } = el;
      const cx = x + w / 2; const cy = y + h / 2;
      const rx = w / 2; const ry2 = h / 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = cx + rx * Math.cos(angle);
        const hy = cy + ry2 * Math.sin(angle);
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      applyFill();
      ctx.stroke();
      if (el.label) drawLabel(ctx, el.label, cx, cy, el.style);
      break;
    }
    case 'cloud': {
      const { x, y, w, h } = el;
      drawCloud(ctx, x, y, w, h);
      applyFill();
      ctx.stroke();
      if (el.label) drawLabel(ctx, el.label, x + w / 2, y + h / 2, el.style);
      break;
    }
    case 'arrow':
    case 'line': {
      const { x1, y1, x2, y2 } = el;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (el.type === 'arrow') drawArrowHead(ctx, x1, y1, x2, y2, el.style);
      if (el.label) {
        drawLabel(ctx, el.label, (x1 + x2) / 2, (y1 + y2) / 2, el.style);
      }
      break;
    }
    case 'freehand': {
      if (!el.points || el.points.length < 2) break;
      ctx.beginPath();
      ctx.moveTo(el.points[0][0], el.points[0][1]);
      for (let i = 1; i < el.points.length; i++) {
        ctx.lineTo(el.points[i][0], el.points[i][1]);
      }
      ctx.stroke();
      break;
    }
    case 'text': {
      ctx.font = `${el.style.fontSize || 14}px ${el.style.fontFamily || 'DM Mono, monospace'}`;
      ctx.fillStyle = el.style.stroke || '#2D2A26';
      ctx.textBaseline = 'top';
      const lines = (el.text || '').split('\n');
      const lineH = (el.style.fontSize || 14) * 1.4;
      lines.forEach((line, i) => ctx.fillText(line, el.x, el.y + i * lineH));
      break;
    }
    default: break;
  }
  ctx.restore();
}

function drawLabel(ctx, text, cx, cy, style) {
  if (!text) return;
  ctx.save();
  ctx.font = `${style.fontSize || 13}px ${style.fontFamily || 'DM Mono, monospace'}`;
  ctx.fillStyle = style.stroke || '#2D2A26';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

function drawArrowHead(ctx, x1, y1, x2, y2, style) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = 10 + (style.strokeWidth || 1.5) * 2;
  ctx.save();
  ctx.fillStyle = style.stroke || '#2D2A26';
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - len * Math.cos(angle - Math.PI / 6),
    y2 - len * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    x2 - len * Math.cos(angle + Math.PI / 6),
    y2 - len * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCloud(ctx, x, y, w, h) {
  const cx = x + w / 2; const cy = y + h / 2;
  const r1 = Math.max(1, w * 0.2); const r2 = Math.max(1, w * 0.15); const r3 = Math.max(1, w * 0.18);
  ctx.beginPath();
  ctx.arc(cx - r1 * 0.6, cy + h * 0.08, r1, Math.PI, 0);
  ctx.arc(cx + r2 * 0.8, cy, r2, Math.PI, 0);
  ctx.arc(cx, cy - h * 0.1, r3, Math.PI, 0);
  ctx.arc(cx - r2 * 1.4, cy, r2, Math.PI * 1.5, Math.PI * 2.5);
  ctx.closePath();
}

function drawSelectionBox(ctx, el) {
  const bb = getBBox(el);
  ctx.save();
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);

  if (el.type === 'arrow' || el.type === 'line') {
    ctx.strokeRect(bb.x - 4, bb.y - 4, bb.w + 8, bb.h + 8);
  } else {
    ctx.strokeRect(bb.x - 4, bb.y - 4, bb.w + 8, bb.h + 8);
  }
  ctx.setLineDash([]);

  // Draw white square handles with blue stroke
  const handles = getHandles(el);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 1.5;
  handles.forEach(h => {
    ctx.fillRect(h.x - 4, h.y - 4, 8, 8);
    ctx.strokeRect(h.x - 4, h.y - 4, 8, 8);
  });
  ctx.restore();
}

function drawDotGrid(ctx, vp, canvasW, canvasH) {
  ctx.save();
  const spacing = 24 * vp.scale;
  const dotSize = Math.min(1.2, vp.scale * 0.8);
  const startX = ((vp.x % spacing) + spacing) % spacing;
  const startY = ((vp.y % spacing) + spacing) % spacing;
  ctx.fillStyle = '#D8D1C5';
  for (let gx = startX; gx < canvasW; gx += spacing) {
    for (let gy = startY; gy < canvasH; gy += spacing) {
      ctx.beginPath();
      ctx.arc(gx, gy, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────
   STATE REDUCER
   ───────────────────────────────────────────────────────────── */
function makeDefaultPage(name = 'Untitled') {
  return { id: uuidv4(), name, elements: [], viewport: { x: 0, y: 0, scale: 1 } };
}

function loadPages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const pages = JSON.parse(raw);
      if (Array.isArray(pages) && pages.length > 0) return pages;
    }
  } catch { /* ignore */ }
  return [makeDefaultPage('Page 1')];
}

function savePages(pages) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pages)); } catch { /* ignore */ }
}

const initialState = () => {
  const pages = loadPages();
  return {
    pages,
    activePageId: pages[0].id,
    history: [pages],
    historyIndex: 0,
    selectedIds: [],
    tool: 'select',
    style: { ...DEFAULT_STYLE },
    drawing: false,
    dragging: false,
    panning: false,
  };
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOOL': return { ...state, tool: action.tool, selectedIds: [] };
    case 'SET_STYLE': return { ...state, style: { ...state.style, ...action.style } };
    case 'SET_SELECTED': return { ...state, selectedIds: action.ids };
    case 'SET_VIEWPORT': {
      const pages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, viewport: action.viewport } : p
      );
      return { ...state, pages };
    }
    case 'SET_ACTIVE_PAGE': return { ...state, activePageId: action.id, selectedIds: [] };
    case 'ADD_PAGE': {
      const newPage = makeDefaultPage(action.name || `Page ${state.pages.length + 1}`);
      const pages = [...state.pages, newPage];
      return pushHistory({ ...state, pages, activePageId: newPage.id, selectedIds: [] });
    }
    case 'RENAME_PAGE': {
      const pages = state.pages.map(p => p.id === action.id ? { ...p, name: action.name } : p);
      return pushHistory({ ...state, pages });
    }
    case 'DELETE_PAGE': {
      if (state.pages.length <= 1) return state;
      const pages = state.pages.filter(p => p.id !== action.id);
      const activePageId = state.activePageId === action.id ? pages[0].id : state.activePageId;
      return pushHistory({ ...state, pages, activePageId, selectedIds: [] });
    }
    case 'COMMIT_ELEMENTS': {
      const pages = state.pages.map(p =>
        p.id === state.activePageId ? { ...p, elements: action.elements } : p
      );
      return pushHistory({ ...state, pages, selectedIds: action.selectedIds ?? state.selectedIds });
    }
    case 'UPDATE_ELEMENT_LABEL': {
      const activePage = state.pages.find(p => p.id === state.activePageId);
      const elements = activePage.elements.map(el =>
        el.id === action.id ? { ...el, label: action.label } : el
      );
      const pages = state.pages.map(p => p.id === state.activePageId ? { ...p, elements } : p);
      return pushHistory({ ...state, pages });
    }
    case 'UNDO': {
      const idx = Math.max(0, state.historyIndex - 1);
      const pages = state.history[idx];
      return { ...state, pages, historyIndex: idx, selectedIds: [] };
    }
    case 'REDO': {
      const idx = Math.min(state.history.length - 1, state.historyIndex + 1);
      const pages = state.history[idx];
      return { ...state, pages, historyIndex: idx, selectedIds: [] };
    }
    default: return state;
  }
}

function pushHistory(state) {
  const trimmed = state.history.slice(0, state.historyIndex + 1);
  const history = [...trimmed, state.pages].slice(-HISTORY_LIMIT);
  return { ...state, history, historyIndex: history.length - 1 };
}

/* ─────────────────────────────────────────────────────────────
   TEXT INPUT OVERLAY
   ───────────────────────────────────────────────────────────── */
function TextOverlay({ el, viewport, onCommit, onCancel }) {
  const ref = useRef(null);
  const committedRef = useRef(false);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleCommit = (val) => {
    if (committedRef.current) return;
    committedRef.current = true;
    onCommit(el, val);
  };

  const handleCancel = () => {
    if (committedRef.current) return;
    committedRef.current = true;
    onCancel();
  };

  const screenX = el.x * viewport.scale + viewport.x;
  const screenY = el.y * viewport.scale + viewport.y;

  return (
    <textarea
      ref={ref}
      defaultValue={el.text || ''}
      onBlur={e => handleCommit(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Escape') handleCancel();
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleCommit(e.target.value);
        }
      }}
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        minWidth: 120,
        minHeight: 36,
        background: '#FFFFFF',
        border: '2px solid #2563EB',
        borderRadius: 4,
        outline: 'none',
        color: el.style?.stroke || '#2D2A26',
        fontSize: `${(el.style?.fontSize || 14) * viewport.scale}px`,
        fontFamily: el.style?.fontFamily || 'DM Mono, monospace',
        lineHeight: 1.4,
        resize: 'both',
        padding: '4px 6px',
        zIndex: 200,
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        caretColor: '#2563EB',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   HORIZONTAL PROPERTIES BAR (OPTIONS BAR UPWARDS AT TOP)
   ───────────────────────────────────────────────────────────── */
function HorizontalPropsBar({ state, dispatch, activePage, onUpdateLabel }) {
  const { selectedIds, style } = state;
  const selectedEls = activePage.elements.filter(el => selectedIds.includes(el.id));
  const hasSelection = selectedEls.length > 0;
  const firstEl = selectedEls[0];

  const update = (patch) => {
    dispatch({ type: 'SET_STYLE', style: patch });
    if (hasSelection) {
      const elements = activePage.elements.map(el =>
        selectedIds.includes(el.id) ? { ...el, style: { ...el.style, ...patch } } : el
      );
      dispatch({ type: 'COMMIT_ELEMENTS', elements });
    }
  };

  const isShape = hasSelection && firstEl && (
    firstEl.type === 'rectangle' || firstEl.type === 'diamond' ||
    firstEl.type === 'ellipse' || firstEl.type === 'cylinder' ||
    firstEl.type === 'hexagon' || firstEl.type === 'cloud'
  );

  return (
    <div className="draw-props-bar">
      {/* Label input if shape selected */}
      {isShape && (
        <>
          <div className="draw-props-item">
            <span className="draw-props-item-label">Label:</span>
            <input
              className="draw-props-input-sm"
              placeholder="Enter text..."
              defaultValue={firstEl.label || ''}
              onBlur={e => onUpdateLabel(firstEl.id, e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onUpdateLabel(firstEl.id, e.target.value); }}
            />
          </div>
          <div className="draw-props-divider" />
        </>
      )}

      {/* Stroke Color Swatches */}
      <div className="draw-props-item">
        <span className="draw-props-item-label">Stroke:</span>
        <div className="draw-color-row">
          {COLORS.filter(c => c !== 'transparent').map(c => (
            <button
              key={c}
              className={`draw-color-swatch-sm ${style.stroke === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => update({ stroke: c })}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="draw-props-divider" />

      {/* Fill Color Swatches */}
      <div className="draw-props-item">
        <span className="draw-props-item-label">Fill:</span>
        <div className="draw-color-row">
          {COLORS.map(c => (
            <button
              key={c}
              className={`draw-color-swatch-sm ${style.fill === c ? 'active' : ''}`}
              style={{
                background: c === 'transparent' ? '#FFFFFF' : c,
                border: c === 'transparent' ? '1.5px dashed #A8A29E' : undefined,
              }}
              onClick={() => update({ fill: c })}
              title={c === 'transparent' ? 'None' : c}
            />
          ))}
        </div>
      </div>

      <div className="draw-props-divider" />

      {/* Stroke Width */}
      <div className="draw-props-item">
        <span className="draw-props-item-label">Width:</span>
        <div className="draw-props-seg">
          {[1, 2, 3.5, 5].map(w => (
            <button
              key={w}
              className={`draw-props-seg-btn ${style.strokeWidth === w ? 'active' : ''}`}
              onClick={() => update({ strokeWidth: w })}
            >
              {w}px
            </button>
          ))}
        </div>
      </div>

      <div className="draw-props-divider" />

      {/* Dash Style */}
      <div className="draw-props-item">
        <span className="draw-props-item-label">Stroke Style:</span>
        <div className="draw-props-seg">
          {['solid', 'dashed', 'dotted'].map(d => (
            <button
              key={d}
              className={`draw-props-seg-btn ${style.dash === d ? 'active' : ''}`}
              onClick={() => update({ dash: d })}
            >
              {d === 'solid' ? '— Solid' : d === 'dashed' ? '- - Dash' : '··· Dot'}
            </button>
          ))}
        </div>
      </div>

      <div className="draw-props-divider" />

      {/* Font Size & Family */}
      <div className="draw-props-item">
        <span className="draw-props-item-label">Font:</span>
        <div className="draw-props-seg">
          {[12, 14, 18, 24].map(sz => (
            <button
              key={sz}
              className={`draw-props-seg-btn ${style.fontSize === sz ? 'active' : ''}`}
              onClick={() => update({ fontSize: sz })}
            >
              {sz}
            </button>
          ))}
        </div>
        <div className="draw-props-seg" style={{ marginLeft: 4 }}>
          {[
            { val: 'DM Mono, monospace', label: 'Mono' },
            { val: 'DM Sans, sans-serif', label: 'Sans' },
          ].map(f => (
            <button
              key={f.val}
              className={`draw-props-seg-btn ${style.fontFamily === f.val ? 'active' : ''}`}
              onClick={() => update({ fontFamily: f.val })}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {hasSelection && (
        <>
          <div className="draw-props-divider" />
          <div className="draw-props-item">
            <button
              className="draw-props-delete-btn"
              onClick={() => {
                const elements = activePage.elements.filter(el => !selectedIds.includes(el.id));
                dispatch({ type: 'COMMIT_ELEMENTS', elements, selectedIds: [] });
              }}
            >
              Delete selected
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN DRAW VIEW
   ───────────────────────────────────────────────────────────── */
export default function DrawView() {
  const [state, dispatch] = useReducer(reducer, null, initialState);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pointerRef = useRef({
    down: false, startX: 0, startY: 0, lastX: 0, lastY: 0,
    mode: null, currentEl: null, draggingEls: null, rubberBand: null,
    handle: null, initialEl: null,
  });
  const animRef = useRef(null);
  const autosaveRef = useRef(null);
  const [editingTextEl, setEditingTextEl] = useState(null);
  const [renamingPageId, setRenamingPageId] = useState(null);
  const [hoverCursor, setHoverCursor] = useState('default');

  const activePage = state.pages.find(p => p.id === state.activePageId) || state.pages[0];
  const vp = activePage.viewport;

  // ── World <-> Screen transforms ──────────────────────────
  const toWorld = useCallback((sx, sy) => ({
    x: (sx - vp.x) / vp.scale,
    y: (sy - vp.y) / vp.scale,
  }), [vp]);

  // ── Render loop ─────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width; const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#FBF9F5';
    ctx.fillRect(0, 0, W, H);

    drawDotGrid(ctx, vp, W, H);

    ctx.save();
    ctx.translate(vp.x, vp.y);
    ctx.scale(vp.scale, vp.scale);

    activePage.elements.forEach(el => {
      drawElement(ctx, el);
      if (state.selectedIds.includes(el.id)) drawSelectionBox(ctx, el);
    });

    // Draw in-progress rubber band selection
    const pr = pointerRef.current;
    if (pr.rubberBand) {
      const { x, y, w, h } = pr.rubberBand;
      ctx.save();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1 / vp.scale;
      ctx.setLineDash([4 / vp.scale, 3 / vp.scale]);
      ctx.fillStyle = 'rgba(37,99,235,0.07)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }

    ctx.restore();
  }, [activePage, state.selectedIds, vp]);

  useEffect(() => {
    const loop = () => { render(); animRef.current = requestAnimationFrame(loop); };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [render]);

  // ── Canvas resize ────────────────────────────────────────
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Auto-save ────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => savePages(state.pages), AUTOSAVE_DELAY);
    return () => clearTimeout(autosaveRef.current);
  }, [state.pages]);

  // ── Keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const isCmdCtrl = e.metaKey || e.ctrlKey;
      if (isCmdCtrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); dispatch({ type: 'UNDO' }); return; }
      if ((isCmdCtrl && e.key === 'y') || (isCmdCtrl && e.shiftKey && e.key === 'z')) { e.preventDefault(); dispatch({ type: 'REDO' }); return; }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedIds.length > 0) {
          const elements = activePage.elements.filter(el => !state.selectedIds.includes(el.id));
          dispatch({ type: 'COMMIT_ELEMENTS', elements, selectedIds: [] });
        }
        return;
      }
      // Tool shortcuts
      const tool = TOOLS.find(t => t && t.key === e.key.toLowerCase());
      if (tool) dispatch({ type: 'SET_TOOL', tool: tool.id });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.selectedIds, activePage]);

  // ── Zoom ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newScale = Math.max(0.1, Math.min(5, vp.scale * factor));
      const newX = mx - (mx - vp.x) * (newScale / vp.scale);
      const newY = my - (my - vp.y) * (newScale / vp.scale);
      dispatch({ type: 'SET_VIEWPORT', viewport: { x: newX, y: newY, scale: newScale } });
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [vp]);

  // ── Pointer events ───────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    if (editingTextEl) return; // Prevent creating new text box while editing an active one

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      pointerRef.current = { ...pointerRef.current, down: true, mode: 'pan', startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY };
      return;
    }
    if (e.button !== 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x: wx, y: wy } = toWorld(sx, sy);

    const tool = state.tool;

    if (tool === 'select') {
      // Check if clicking on a resize handle of a single selected element
      if (state.selectedIds.length === 1) {
        const selectedEl = activePage.elements.find(el => el.id === state.selectedIds[0]);
        if (selectedEl) {
          const hitHandle = getHandleAtPosition(selectedEl, wx, wy, vp.scale);
          if (hitHandle) {
            pointerRef.current = {
              down: true,
              mode: 'resize',
              handle: hitHandle.id,
              initialEl: JSON.parse(JSON.stringify(selectedEl)),
              startX: wx,
              startY: wy,
              lastX: wx,
              lastY: wy,
            };
            return;
          }
        }
      }

      // Try to hit an element
      const hit = [...activePage.elements].reverse().find(el => hitTestElement(el, wx, wy));
      if (hit) {
        const isAlreadySelected = state.selectedIds.includes(hit.id);
        const newSelected = e.shiftKey
          ? (isAlreadySelected ? state.selectedIds.filter(id => id !== hit.id) : [...state.selectedIds, hit.id])
          : [hit.id];
        dispatch({ type: 'SET_SELECTED', ids: newSelected });
        const dragEls = activePage.elements
          .filter(el => newSelected.includes(el.id))
          .map(el => {
            const bb = getBBox(el);
            return { id: el.id, dx: wx - bb.x, dy: wy - bb.y };
          });
        pointerRef.current = { ...pointerRef.current, down: true, mode: 'drag', startX: wx, startY: wy, lastX: wx, lastY: wy, draggingEls: dragEls };
      } else {
        dispatch({ type: 'SET_SELECTED', ids: [] });
        pointerRef.current = { ...pointerRef.current, down: true, mode: 'rubberBand', startX: wx, startY: wy, lastX: wx, lastY: wy, rubberBand: { x: wx, y: wy, w: 0, h: 0 } };
      }
      return;
    }

    if (tool === 'text') {
      const newEl = {
        id: uuidv4(), type: 'text',
        x: wx, y: wy, text: '',
        style: { ...state.style },
      };
      setEditingTextEl(newEl);
      return;
    }

    if (tool === 'eraser') {
      const hit = [...activePage.elements].reverse().find(el => hitTestElement(el, wx, wy));
      if (hit) {
        const elements = activePage.elements.filter(el => el.id !== hit.id);
        dispatch({ type: 'COMMIT_ELEMENTS', elements });
      }
      return;
    }

    // Drawing shapes / lines
    const newEl = { id: uuidv4(), type: tool, style: { ...state.style } };
    if (tool === 'freehand') {
      newEl.points = [[wx, wy]];
    } else if (tool === 'arrow' || tool === 'line') {
      newEl.x1 = wx; newEl.y1 = wy; newEl.x2 = wx; newEl.y2 = wy;
    } else {
      newEl.x = wx; newEl.y = wy; newEl.w = 0; newEl.h = 0;
    }
    pointerRef.current = { ...pointerRef.current, down: true, mode: 'draw', startX: wx, startY: wy, lastX: wx, lastY: wy, currentEl: newEl };
  }, [state.tool, state.selectedIds, state.style, activePage, toWorld, editingTextEl, vp.scale]);

  const handlePointerMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x: wx, y: wy } = toWorld(sx, sy);

    const pr = pointerRef.current;

    // Hover cursor check when pointer is not down
    if (!pr.down && state.tool === 'select' && state.selectedIds.length === 1) {
      const selectedEl = activePage.elements.find(el => el.id === state.selectedIds[0]);
      if (selectedEl) {
        const hitHandle = getHandleAtPosition(selectedEl, wx, wy, vp.scale);
        if (hitHandle) {
          setHoverCursor(hitHandle.cursor);
          return;
        }
      }
      setHoverCursor('default');
    }

    if (!pr.down) return;

    if (pr.mode === 'pan') {
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      pointerRef.current.lastX = e.clientX;
      pointerRef.current.lastY = e.clientY;
      dispatch({ type: 'SET_VIEWPORT', viewport: { ...vp, x: vp.x + dx, y: vp.y + dy } });
      return;
    }

    pointerRef.current.lastX = wx;
    pointerRef.current.lastY = wy;

    if (pr.mode === 'rubberBand') {
      const rb = normalizeRect(pr.startX, pr.startY, wx, wy);
      pointerRef.current.rubberBand = rb;
      return;
    }

    if (pr.mode === 'resize' && pr.initialEl && pr.handle) {
      const dx = wx - pr.startX;
      const dy = wy - pr.startY;
      const initial = pr.initialEl;
      let resizedEl = { ...initial };

      if (initial.type === 'arrow' || initial.type === 'line') {
        if (pr.handle === 'start') {
          resizedEl.x1 = initial.x1 + dx;
          resizedEl.y1 = initial.y1 + dy;
        } else if (pr.handle === 'end') {
          resizedEl.x2 = initial.x2 + dx;
          resizedEl.y2 = initial.y2 + dy;
        }
      } else if (initial.type === 'freehand') {
        const origBB = getBBox(initial);
        if (origBB.w > 0 && origBB.h > 0) {
          let newX = origBB.x; let newY = origBB.y;
          let newW = origBB.w; let newH = origBB.h;
          const h = pr.handle;
          if (h.includes('e')) newW = Math.max(10, origBB.w + dx);
          if (h.includes('s')) newH = Math.max(10, origBB.h + dy);
          if (h.includes('w')) { newX = origBB.x + dx; newW = Math.max(10, origBB.w - dx); }
          if (h.includes('n')) { newY = origBB.y + dy; newH = Math.max(10, origBB.h - dy); }

          const scaleX = newW / origBB.w;
          const scaleY = newH / origBB.h;
          resizedEl.points = initial.points.map(([px, py]) => [
            newX + (px - origBB.x) * scaleX,
            newY + (py - origBB.y) * scaleY,
          ]);
        }
      } else {
        let newX = initial.x || 0;
        let newY = initial.y || 0;
        let newW = initial.w || 0;
        let newH = initial.h || 0;
        const h = pr.handle;

        if (h.includes('e')) newW = Math.max(10, (initial.w || 0) + dx);
        if (h.includes('s')) newH = Math.max(10, (initial.h || 0) + dy);
        if (h.includes('w')) {
          const possibleW = (initial.w || 0) - dx;
          if (possibleW > 10) { newX = (initial.x || 0) + dx; newW = possibleW; }
        }
        if (h.includes('n')) {
          const possibleH = (initial.h || 0) - dy;
          if (possibleH > 10) { newY = (initial.y || 0) + dy; newH = possibleH; }
        }

        resizedEl.x = newX;
        resizedEl.y = newY;
        resizedEl.w = newW;
        resizedEl.h = newH;
      }

      const elements = activePage.elements.map(el => el.id === resizedEl.id ? resizedEl : el);
      activePage.elements = elements;
      dispatch({ type: 'SET_VIEWPORT', viewport: vp });
      return;
    }

    if (pr.mode === 'drag' && pr.draggingEls) {
      const dx = wx - pr.startX;
      const dy = wy - pr.startY;
      const elements = activePage.elements.map(el => {
        const drag = pr.draggingEls.find(d => d.id === el.id);
        if (!drag) return el;
        if (el.type === 'arrow' || el.type === 'line') {
          return { ...el, x1: el.x1 + dx, y1: el.y1 + dy, x2: el.x2 + dx, y2: el.y2 + dy };
        }
        if (el.type === 'freehand') {
          return { ...el, points: el.points.map(([px, py]) => [px + dx, py + dy]) };
        }
        return { ...el, x: (el.x || 0) + dx, y: (el.y || 0) + dy };
      });
      dispatch({ type: 'SET_VIEWPORT', viewport: vp });
      activePage.elements = elements;
      pointerRef.current.startX = wx;
      pointerRef.current.startY = wy;
      return;
    }

    if (pr.mode === 'draw' && pr.currentEl) {
      const el = pr.currentEl;
      if (el.type === 'freehand') {
        pr.currentEl = { ...el, points: [...el.points, [wx, wy]] };
      } else if (el.type === 'arrow' || el.type === 'line') {
        pr.currentEl = { ...el, x2: wx, y2: wy };
      } else {
        const { x, y, w, h } = normalizeRect(pr.startX, pr.startY, wx, wy);
        pr.currentEl = { ...el, x, y, w, h };
      }
      const elements = [...activePage.elements.filter(e => e.id !== pr.currentEl.id), pr.currentEl];
      activePage.elements = elements;
    }
  }, [vp, state.pages, state.activePageId, activePage, toWorld, state.tool, state.selectedIds]);

  const handlePointerUp = useCallback((e) => {
    const pr = pointerRef.current;
    if (!pr.down) return;

    if (pr.mode === 'rubberBand' && pr.rubberBand) {
      const rb = pr.rubberBand;
      const selected = activePage.elements.filter(el => {
        const bb = getBBox(el);
        return bb.x >= rb.x && bb.y >= rb.y && bb.x + bb.w <= rb.x + rb.w && bb.y + bb.h <= rb.y + rb.h;
      }).map(el => el.id);
      dispatch({ type: 'SET_SELECTED', ids: selected });
      pointerRef.current.rubberBand = null;
    }

    if (pr.mode === 'drag' || pr.mode === 'resize') {
      const elements = [...activePage.elements];
      dispatch({ type: 'COMMIT_ELEMENTS', elements });
    }

    if (pr.mode === 'draw' && pr.currentEl) {
      const el = pr.currentEl;
      const isValid =
        (el.type === 'freehand' && el.points && el.points.length > 2) ||
        (el.type === 'arrow' || el.type === 'line'
          ? (Math.abs(el.x2 - el.x1) + Math.abs(el.y2 - el.y1) > 4)
          : (el.w > 4 || el.h > 4));
      if (isValid) {
        const elements = [...activePage.elements.filter(e => e.id !== el.id), el];
        dispatch({ type: 'COMMIT_ELEMENTS', elements, selectedIds: [el.id] });
        if (state.tool !== 'freehand') dispatch({ type: 'SET_TOOL', tool: 'select' });
      } else {
        activePage.elements = activePage.elements.filter(e => e.id !== el.id);
      }
    }

    pointerRef.current = { ...pointerRef.current, down: false, mode: null, currentEl: null, draggingEls: null, handle: null, initialEl: null };
  }, [activePage, state.tool]);

  // ── Double-click to edit text / label ────────────────────
  const handleDblClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x: wx, y: wy } = toWorld(sx, sy);
    const hit = [...activePage.elements].reverse().find(el => hitTestElement(el, wx, wy));
    if (hit && hit.type === 'text') {
      setEditingTextEl({ ...hit });
    }
  }, [activePage, toWorld]);

  // ── Export PNG ───────────────────────────────────────────
  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePage.name || 'drawing'}.png`;
    a.click();
  }, [activePage]);

  // ── Save .draw ───────────────────────────────────────────
  const saveDraw = useCallback(() => {
    const data = JSON.stringify({ version: 1, pages: state.pages }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'remor-drawing.draw';
    a.click();
    URL.revokeObjectURL(url);
  }, [state.pages]);

  // ── Commit text from overlay ─────────────────────────────
  const commitText = useCallback((elToCommit, text) => {
    if (!elToCommit) return;
    const trimmed = text.trim();
    const existing = activePage.elements.find(el => el.id === elToCommit.id);
    if (!trimmed) {
      if (existing) {
        const elements = activePage.elements.filter(el => el.id !== elToCommit.id);
        dispatch({ type: 'COMMIT_ELEMENTS', elements });
      }
    } else {
      const lines = text.split('\n');
      const maxLen = Math.max(...lines.map(l => l.length), 1);
      const fontPx = elToCommit.style?.fontSize || 14;
      const w = Math.max(60, maxLen * (fontPx * 0.65));
      const h = Math.max(24, lines.length * (fontPx * 1.4));
      const updated = { ...elToCommit, text, w, h };
      const elements = existing
        ? activePage.elements.map(el => el.id === updated.id ? updated : el)
        : [...activePage.elements, updated];
      dispatch({ type: 'COMMIT_ELEMENTS', elements, selectedIds: [updated.id] });
      dispatch({ type: 'SET_TOOL', tool: 'select' });
    }
    setEditingTextEl(null);
  }, [activePage]);

  const zoomPercent = Math.round(vp.scale * 100);

  const getCursor = () => {
    const pr = pointerRef.current;
    if (pr.mode === 'pan') return 'grabbing';
    if (pr.mode === 'resize' && pr.handle) {
      const handleObj = getHandles(pr.initialEl || {}).find(h => h.id === pr.handle);
      if (handleObj) return handleObj.cursor;
    }
    switch (state.tool) {
      case 'select': return hoverCursor;
      case 'text': return 'text';
      case 'eraser': return 'crosshair';
      default: return 'crosshair';
    }
  };

  return (
    <div className="draw-workspace">
      {/* ── Top Bar ────────────────────────────── */}
      <div className="draw-topbar">
        {/* Page Tabs */}
        <div className="draw-tabs">
          {state.pages.map(page => (
            <div
              key={page.id}
              className={`draw-tab ${page.id === state.activePageId ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ACTIVE_PAGE', id: page.id })}
              onDoubleClick={() => setRenamingPageId(page.id)}
            >
              {renamingPageId === page.id ? (
                <input
                  className="draw-tab-rename"
                  defaultValue={page.name}
                  autoFocus
                  onBlur={e => { dispatch({ type: 'RENAME_PAGE', id: page.id, name: e.target.value || 'Untitled' }); setRenamingPageId(null); }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') e.target.blur(); }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span>{page.name}</span>
              )}
              {state.pages.length > 1 && (
                <button
                  className="draw-tab-close"
                  onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_PAGE', id: page.id }); }}
                  title="Delete page"
                >×</button>
              )}
            </div>
          ))}
          <button
            className="draw-tab-add"
            onClick={() => dispatch({ type: 'ADD_PAGE' })}
            title="New page"
          >+</button>
        </div>

        {/* Right actions */}
        <div className="draw-topbar-actions">
          <div className="draw-zoom-ctrl">
            <button className="draw-zoom-btn" onClick={() => dispatch({ type: 'SET_VIEWPORT', viewport: { ...vp, scale: Math.max(0.1, vp.scale / 1.2) } })}>−</button>
            <span className="draw-zoom-label">{zoomPercent}%</span>
            <button className="draw-zoom-btn" onClick={() => dispatch({ type: 'SET_VIEWPORT', viewport: { ...vp, scale: Math.min(5, vp.scale * 1.2) } })}>+</button>
          </div>
          <button className="draw-topbar-btn" onClick={() => dispatch({ type: 'UNDO' })} title="Undo (Ctrl+Z)">↩</button>
          <button className="draw-topbar-btn" onClick={() => dispatch({ type: 'REDO' })} title="Redo (Ctrl+Y)">↪</button>
          <button className="draw-topbar-btn draw-topbar-btn--secondary" onClick={exportPNG} title="Export PNG">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PNG
          </button>
          <button className="draw-topbar-btn draw-topbar-btn--primary" onClick={saveDraw} title="Save .draw file">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save .draw
          </button>
        </div>
      </div>

      {/* ── Horizontal Options Bar Upwards ────────────────────────── */}
      <HorizontalPropsBar
        state={state}
        dispatch={dispatch}
        activePage={activePage}
        onUpdateLabel={(id, label) => dispatch({ type: 'UPDATE_ELEMENT_LABEL', id, label })}
      />

      {/* ── Canvas Area ───────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left Toolbar */}
        <div className="draw-toolbar">
          {TOOLS.map((tool, i) => {
            if (!tool) return <div key={`sep-${i}`} className="draw-toolbar-sep" />;
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`draw-tool-btn ${state.tool === tool.id ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_TOOL', tool: tool.id })}
                title={`${tool.label} (${tool.key.toUpperCase()})`}
              >
                <Icon />
              </button>
            );
          })}
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: getCursor() }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onDoubleClick={handleDblClick}
        >
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

          {editingTextEl && (
            <TextOverlay
              el={editingTextEl}
              viewport={vp}
              onCommit={commitText}
              onCancel={() => setEditingTextEl(null)}
            />
          )}

          {/* Zoom reset tip */}
          {(vp.scale < 0.3 || vp.scale > 3) && (
            <button
              className="draw-zoom-reset"
              onClick={() => dispatch({ type: 'SET_VIEWPORT', viewport: { x: 0, y: 0, scale: 1 } })}
            >
              Reset View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
