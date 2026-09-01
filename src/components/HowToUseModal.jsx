import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Command,
  Zap,
  Layers,
  FileText,
  Brain,
  Check,
  CheckCircle2,
  Folder,
  Tag,
  ExternalLink,
  BookOpen,
  Keyboard
} from 'lucide-react';

const STEPS = [
  {
    stepNumber: '01',
    category: 'ZERO-FRICTION CAPTURE',
    title: 'Keystroke-First Quick Capture',
    subtitle: 'Capture URLs, notes, and tasks instantly from anywhere with Ctrl+K.',
    description: 'Remor automatically parses titles, extracts domain favicons, and suggests smart tags in the background so your flow stays uninterrupted.',
    fieldsExample: {
      type: 'LINK',
      title: 'Building a Second Brain — Tiago Forte',
      url: 'https://fortelabs.com/blog/basboverview/',
      tags: ['#productivity', '#pkm', '#reading'],
      status: 'INBOX',
      priority: 'HIGH',
    },
    proTip: 'Press Ctrl+K anytime, type or paste your content, and hit Enter to store.',
  },
  {
    stepNumber: '02',
    category: 'STRUCTURE & TAXONOMY',
    title: 'Collections, Priorities & Tags',
    subtitle: 'Organize assets with strict visual hierarchy and sharp 0px categories.',
    description: 'Assign items to custom workspace collections, rank urgency with 4 priority levels, and filter instantly via multi-tag intersections.',
    fieldsExample: {
      collection: '🔬 Research (or 💼 Work, 🎨 Design)',
      priority: 'URGENT 🔴  /  HIGH 🟠  /  MEDIUM 🟡  /  LOW 🔵',
      status: 'INBOX ➔ ACTIVE ➔ DONE ➔ ARCHIVED',
      tags: ['#engineering', '#sqlite', '#architecture'],
      dueDate: '2026-09-15 (with automated reminder alarms)',
    },
    proTip: 'Click any tag badge in the sidebar to filter your entire workspace by that tag.',
  },
  {
    stepNumber: '03',
    category: 'WRITING STUDIO',
    title: 'TipTap Rich Text Workspace',
    subtitle: 'Full-page distraction-free editor with highlight swatches and live metrics.',
    description: 'Double-click any note to launch the full-page writing studio featuring checklists, code blocks, quote callouts, and 7 curated highlight palettes.',
    fieldsExample: {
      editorFeatures: 'Checklists • Code Snippets • Quote Callouts',
      swatches: 'Sky Blue • Sage Green • Warm Beige • Blush Pink • Violet',
      autoSave: 'Real-time sync to Neon PostgreSQL database',
      metrics: 'Live word counts & reading time estimates',
    },
    proTip: 'Select any text inside the editor to reveal the inline formatting toolbar.',
  },
  {
    stepNumber: '04',
    category: 'INTELLIGENCE LAYER',
    title: 'AI Similar Items & Hygiene Engine',
    subtitle: 'Surface forgotten wisdom and discover hidden connections in your graph.',
    description: 'Remor continuously calculates tag co-occurrence and structural overlap to surface up to 5 related knowledge assets in the side panel drawer.',
    fieldsExample: {
      activeAsset: 'Notes on atomic design system tokens',
      aiDiscovered: 'Surfaces "CSS Grid MDN Reference" (Score: 89% tag match)',
      duplicateDetection: 'Flags identical URLs or overlapping link titles before saving',
    },
    proTip: 'Open any item drawer to view the AI-recommended similar assets at the bottom.',
  },
  {
    stepNumber: '05',
    category: 'KEYBOARD NAVIGATION',
    title: 'Command Palette & Keyboard Model',
    subtitle: 'Sub-5ms search latency without taking your hands off the keyboard.',
    description: 'Navigate your entire digital memory in seconds. Jump to collections, trigger actions, or execute global full-text search with Ctrl+P.',
    fieldsExample: {
      'Ctrl + K': 'Open Quick Capture modal from any screen',
      'Ctrl + P': 'Launch Command Palette & Global Full-Text Search',
      'Esc': 'Close active item drawer or full-page note editor',
      'Click Card': 'Expand side drawer with details, notes & AI matches',
    },
    proTip: 'Use Ctrl+P to quickly switch between Inbox, Today, Starred, and Collections.',
  },
];

export default function HowToUseModal({ isOpen, onClose }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = STEPS[activeStepIndex];
  const isFirst = activeStepIndex === 0;
  const isLast = activeStepIndex === STEPS.length - 1;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '88vh',
          background: '#FFFFFF',
          border: '1.5px solid var(--border-strong)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.22), 0 8px 16px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '0px',
        }}
      >
        {/* Modal Top Header Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '26px',
                height: '24px',
                padding: '0 4px',
                background: '#0B1015',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Re
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>
              Remor User Guide &amp; Architecture
            </span>
            <span className="chip" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', border: '1px solid var(--primary-subtle-hover)', fontSize: '10px' }}>
              OFFICIAL GUIDE
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Bar Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#FAFBFD', flexShrink: 0 }}>
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isCompleted = idx < activeStepIndex;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStepIndex(idx)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  border: 'none',
                  borderBottom: `2.5px solid ${isActive ? 'var(--primary)' : isCompleted ? '#93C5FD' : 'transparent'}`,
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>{step.stepNumber}</span>
                <span className="truncate" style={{ display: 'none', minWidth: 0 }}>
                  {step.category}
                </span>
                {isCompleted && <CheckCircle2 size={12} color="var(--primary)" />}
              </button>
            );
          })}
        </div>

        {/* Main Content Area — Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="font-mono text-xs font-700 text-blue" style={{ letterSpacing: '0.08em' }}>
                STEP {currentStep.stepNumber} OF 05 — {currentStep.category}
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.8px',
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              {currentStep.title}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {currentStep.subtitle}
            </p>
          </div>

          {/* Description Paragraph */}
          <p style={{ fontSize: '14px', color: '#3A4553', lineHeight: 1.6 }}>
            {currentStep.description}
          </p>

          {/* Interactive Concrete Fields & Specs Box */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1.5px solid var(--border)',
              borderLeft: '4px solid var(--primary)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span className="font-mono text-xs font-700 text-primary" style={{ letterSpacing: '0.06em' }}>
                FIELD SPECIFICATION &amp; EXAMPLE DATA
              </span>
              <span className="font-mono text-xs text-muted">SCHEMA REF v1.0</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px' }}>
              {Object.entries(currentStep.fieldsExample).map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    fontSize: '13px',
                  }}
                >
                  <span
                    className="font-mono text-xs text-muted font-600"
                    style={{
                      width: '130px',
                      flexShrink: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <div style={{ flex: 1 }}>
                    {Array.isArray(val) ? (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {val.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              background: '#EAF2FF',
                              color: 'var(--primary)',
                              border: '1px solid #BFDBFE',
                              padding: '2px 8px',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: key.includes('Ctrl') ? 'var(--font-mono)' : 'inherit' }}>
                        {val}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Callout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#92400E',
              fontSize: '13px',
            }}
          >
            <Sparkles size={16} style={{ color: '#D97706', flexShrink: 0 }} />
            <div>
              <strong style={{ fontWeight: 700 }}>Pro Tip: </strong>
              {currentStep.proTip}
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={isFirst}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isFirst ? 'transparent' : '#FFFFFF',
              color: isFirst ? 'var(--text-muted)' : 'var(--text-primary)',
              border: '1px solid var(--border)',
              cursor: isFirst ? 'not-allowed' : 'pointer',
              opacity: isFirst ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div className="font-mono text-xs text-muted">
            Step {activeStepIndex + 1} of {STEPS.length}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Skip
            </button>

            {isLast ? (
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Get Started <Check size={14} />
              </button>
            ) : (
              <button
                onClick={() => setActiveStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1))}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Next Step <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
