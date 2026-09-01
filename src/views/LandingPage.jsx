import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Search,
  Zap,
  Shield,
  Layers,
  Brain,
  Cpu,
  Database,
  Lock,
  Sparkles,
  Command,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  ChevronRight,
  Terminal,
  CheckCircle2,
  Folder
} from 'lucide-react';
import useStore from '../store/useStore';
import VerticalBarsNoise from '../components/ui/vertical-bars';

export default function LandingPage({ onLaunchApp }) {
  const { setActiveView } = useStore();
  const [activeTab, setActiveTab] = useState('capture');
  const [demoInput, setDemoInput] = useState('');
  const [demoCaptured, setDemoCaptured] = useState(false);

  const handleLaunch = () => {
    if (onLaunchApp) {
      onLaunchApp();
    } else {
      setActiveView('inbox');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        overflowY: 'auto',
      }}
    >
      {/* ── Sticky Top Navigation ──────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '28px',
              padding: '0 4px',
              background: '#0B1015',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Re
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
            Remor
          </span>
          <span className="font-mono text-xs text-muted mobile-hide" style={{ marginLeft: '8px', borderLeft: '1px solid var(--border)', paddingLeft: '10px' }}>
            v1.0.0
          </span>
        </div>

        <nav className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#philosophy" className="text-secondary text-sm font-500" style={{ textDecoration: 'none' }}>Philosophy</a>
          <a href="#security" className="text-secondary text-sm font-500" style={{ textDecoration: 'none' }}>Security</a>
          <a href="#architecture" className="text-secondary text-sm font-500" style={{ textDecoration: 'none' }}>Architecture</a>
          <a href="#features" className="text-secondary text-sm font-500" style={{ textDecoration: 'none' }}>Capabilities</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleLaunch}>
            Sign In
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleLaunch}>
            Launch Web App <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* Interactive Noise Canvas Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.65 }}>
          <VerticalBarsNoise
            backgroundColor="#FFFFFF"
            lineColor="#E5E7EB"
            barColor="#0562EF"
            lineWidth={1}
            animationSpeed={0.0006}
            removeWaveLine={true}
          />
        </div>
        {/* Dimming overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'rgba(255,255,255,0.55)', pointerEvents: 'none' }} />

        {/* Foreground content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '100px 40px 80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Monospace Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 12px',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--primary-subtle-hover)',
              marginBottom: '28px',
              borderRadius: '0px',
            }}
          >
            <span className="priority-dot high" />
            <span className="font-mono text-xs font-600 text-blue" style={{ letterSpacing: '0.08em' }}>
              PERSONAL KNOWLEDGE &amp; PRODUCTIVITY HUB
            </span>
          </div>

          {/* Main Headline with Sharp Inline Badge */}
          <h1
            className="landing-hero-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '76px',
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: '-2.5px',
              color: 'var(--text-primary)',
              maxWidth: '1000px',
              margin: '0 auto 28px',
            }}
          >
            Save less.<br />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              Remember
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#EAF2FF',
                  border: '1px solid #BFDBFE',
                  padding: '4px 22px',
                  borderRadius: '0px',
                  color: 'var(--text-primary)',
                  verticalAlign: 'middle',
                }}
              >
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>more.</span>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="landing-hero-subtitle"
            style={{
              fontSize: '18px',
              lineHeight: 1.65,
              color: '#3A4553',
              maxWidth: '680px',
              margin: '0 auto 40px',
              fontWeight: 400,
            }}
          >
            Remor is an ultra-fast, intelligent memory layer for your digital life. Capture links, notes, research, and tasks in two keystrokes — then effortlessly rediscover them when they matter most.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '64px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }} onClick={handleLaunch}>
              Open Workspace <ArrowRight size={16} />
            </button>
            <a
              href="#demo"
              className="btn btn-secondary"
              style={{ padding: '12px 24px', fontSize: '15px', textDecoration: 'none' }}
            >
              Try Live Demo
            </a>
          </div>

          {/* Technical Mockup Frame */}
          <div
            className="landing-mockup-frame"
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              padding: '24px',
              position: 'relative',
            }}
          >
            {/* Top Frame Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', background: '#EF4444' }} />
                <div style={{ width: '10px', height: '10px', background: '#F59E0B' }} />
                <div style={{ width: '10px', height: '10px', background: '#10B981' }} />
                <span className="font-mono text-xs text-muted" style={{ marginLeft: '12px' }}>brainly://workspace/inbox</span>
              </div>
              <div className="font-mono text-xs text-muted mobile-hide" style={{ display: 'flex', gap: '16px' }}>
                <span>CTRL+K Quick Capture</span>
                <span>CTRL+P Command Palette</span>
              </div>
            </div>

            {/* Interactive Preview Cards Grid */}
            <div className="landing-grid-3" style={{ gap: '16px' }}>
              {/* Card 1: Link */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderTop: '3px solid var(--primary)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="chip chip-active">LINK</span>
                  <span className="font-mono text-xs text-muted">2 hours ago</span>
                </div>
                <h4 className="font-heading font-600 text-base">Building a Second Brain Methodology</h4>
                <p className="text-xs text-secondary truncate">https://fortelabs.com/blog/basboverview/</p>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  <span className="tag">#productivity</span>
                  <span className="tag">#pkm</span>
                </div>
              </div>

              {/* Card 2: Note */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderTop: '3px solid #7C3AED', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="chip" style={{ background: '#F3F0FF', color: '#7C3AED', border: '1px solid #E9D5FF' }}>NOTE</span>
                  <span className="font-mono text-xs text-muted">Yesterday</span>
                </div>
                <h4 className="font-heading font-600 text-base">Atomic Design System Tokens</h4>
                <p className="text-xs text-secondary" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  Atoms → Molecules → Organisms. Sharp 0px borders enforce clarity across UI layers.
                </p>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  <span className="tag">#design</span>
                  <span className="tag">#systems</span>
                </div>
              </div>

              {/* Card 3: Task */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderTop: '3px solid #059669', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="chip chip-done">TASK</span>
                  <span className="font-mono text-xs text-muted">Due Today</span>
                </div>
                <h4 className="font-heading font-600 text-base">Review Q3 Architecture &amp; Database Spec</h4>
                <p className="text-xs text-secondary truncate">Align with core team on schema migration strategies.</p>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  <span className="tag">#engineering</span>
                  <span className="tag">#work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Philosophy (01 / 02 / 03) ───────────────────── */}
      <section id="philosophy" className="landing-section">
        <div className="landing-flex-header">
          <div>
            <span className="font-mono text-xs text-blue font-600" style={{ letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              DESIGN PHILOSOPHY
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '44px', fontWeight: 600, letterSpacing: '-1px' }}>
              Engineered for mental clarity.
            </h2>
          </div>
          <p className="text-secondary text-sm" style={{ maxWidth: '400px', textAlign: 'right' }}>
            Most tools add friction with complex hierarchies. Remor removes friction so your brain stays focused on creating.
          </p>
        </div>

        <div className="landing-grid-3">
          {/* Pillar 1 */}
          <div style={{ border: '1px solid var(--border)', padding: '32px', background: 'var(--surface)' }}>
            <span className="font-mono text-xl font-700 text-blue" style={{ display: 'block', marginBottom: '16px' }}>01</span>
            <h3 className="font-heading text-lg font-600" style={{ marginBottom: '12px' }}>Zero-Friction Capture</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>
              Capture links, notes, code snippets, and tasks instantly with <kbd>Ctrl+K</kbd>. Automatic title parsing and favicon extractions happen silently in the background.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{ border: '1px solid var(--border)', padding: '32px', background: 'var(--surface)' }}>
            <span className="font-mono text-xl font-700 text-blue" style={{ display: 'block', marginBottom: '16px' }}>02</span>
            <h3 className="font-heading text-lg font-600" style={{ marginBottom: '12px' }}>Active Hygiene Layer</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>
              Remor's background intelligence continuously audits your knowledge graph — flagging duplicate links, surfacing forgotten wisdom, and offering auto-tag recommendations.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{ border: '1px solid var(--border)', padding: '32px', background: 'var(--surface)' }}>
            <span className="font-mono text-xl font-700 text-blue" style={{ display: 'block', marginBottom: '16px' }}>03</span>
            <h3 className="font-heading text-lg font-600" style={{ marginBottom: '12px' }}>Instant Natural Retrieval</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>
              Locate any asset in milliseconds using full-text indexing, exact tag intersections, or natural language semantic query matching.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section: Interactive Demo Playground ────────────────── */}
      <section id="demo" className="landing-section">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', padding: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="font-mono text-xs text-blue font-600" style={{ letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
              INTERACTIVE DEMO
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 600 }}>
              Test Quick Capture &amp; Duplicate Detection
            </h2>
            <p className="text-secondary text-sm" style={{ marginTop: '4px' }}>
              Type a URL or title below to see how Remor instantly analyzes inputs and checks for duplicates.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              className="input"
              style={{ height: '44px', fontSize: '15px' }}
              placeholder="e.g. https://github.com/facebook/react or Notes on SQLite concurrency"
              value={demoInput}
              onChange={e => {
                setDemoInput(e.target.value);
                setDemoCaptured(false);
              }}
            />
            <button
              className="btn btn-primary"
              style={{ padding: '0 24px' }}
              disabled={!demoInput.trim()}
              onClick={() => setDemoCaptured(true)}
            >
              Simulate Capture
            </button>
          </div>

          {demoCaptured && (
            <div className="animate-fade-in" style={{ padding: '16px', background: '#fff', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    Captured: "{demoInput}"
                  </div>
                  <div className="font-mono text-xs text-muted">
                    Type: {demoInput.startsWith('http') ? 'LINK (favicon parsed)' : 'NOTE'} • Status: INBOX • Priority: MEDIUM
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLaunch}>
                View in App →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Section: Deep Capabilities & Feature Grid ──────────── */}
      <section id="features" className="landing-section">
        <div style={{ marginBottom: '48px' }}>
          <span className="font-mono text-xs text-blue font-600" style={{ letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
            CORE CAPABILITIES
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '44px', fontWeight: 600, letterSpacing: '-1px' }}>
            Built for deep work &amp; knowledge retention.
          </h2>
        </div>

        <div className="landing-grid-2">
          {/* Feature 1 */}
          <div style={{ border: '1px solid var(--border)', padding: '32px', background: '#fff' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <FileText size={20} />
            </div>
            <h3 className="font-heading text-lg font-600" style={{ marginBottom: '8px' }}>TipTap Rich Text Studio</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6, marginBottom: '16px' }}>
              A dedicated full-page writing environment featuring TipTap rich text formatting, checklists, code blocks, and 7 curated highlight swatches (sky blue, beige, yellow, sage, blush).
            </p>
            <div className="font-mono text-xs text-muted">Includes auto-save &amp; live word counts</div>
          </div>

          {/* Feature 2 */}
          <div style={{ border: '1px solid var(--border)', padding: '32px', background: '#fff' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Layers size={20} />
            </div>
            <h3 className="font-heading text-lg font-600" style={{ marginBottom: '8px' }}>Horizontal Gallery Cards</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6, marginBottom: '16px' }}>
              Visual card previews tailored per type: auto-fetched favicons for links, typographic previews for notes, and per-type accent palettes with subtle dot-grid backgrounds.
            </p>
            <div className="font-mono text-xs text-muted">Smooth horizontal gallery scrolling</div>
          </div>

          {/* Feature 3 */}
          <div style={{ border: '1px solid var(--border)', padding: '32px', background: '#fff' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Brain size={20} />
            </div>
            <h3 className="font-heading text-lg font-600" style={{ marginBottom: '8px' }}>AI Similar Items Engine</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6, marginBottom: '16px' }}>
              Remor automatically calculates tag co-occurrence and structural overlap to surface up to 5 related knowledge assets in the side panel drawer.
            </p>
            <div className="font-mono text-xs text-muted">Discovers hidden connections in your library</div>
          </div>

          {/* Feature 4 */}
          <div style={{ border: '1px solid var(--border)', padding: '32px', background: '#fff' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Command size={20} />
            </div>
            <h3 className="font-heading text-lg font-600" style={{ marginBottom: '8px' }}>Command Palette &amp; Shortcuts</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6, marginBottom: '16px' }}>
              Never touch your mouse. Access full-text search, jump between collections, or trigger actions instantly using <kbd>Ctrl+P</kbd> and <kbd>Ctrl+K</kbd>.
            </p>
            <div className="font-mono text-xs text-muted">Keyboard-first navigation model</div>
          </div>
        </div>
      </section>

      {/* ── Section: Dedicated Encryption & Security Vault ───────── */}
      <section id="security" className="landing-section">
        <div style={{ background: '#0B1015', border: '1px solid #1F2937', padding: '48px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(5,98,239,0.18)', border: '1px solid rgba(5,98,239,0.4)', padding: '4px 10px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#60A5FA', marginBottom: '16px' }}>
                <Lock size={12} /> ZERO-KNOWLEDGE ARCHITECTURE
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: 700, letterSpacing: '-1px', color: '#fff', marginBottom: '16px', lineHeight: 1.15 }}>
                Fully Encrypted &amp; Trusted Memory Vault.
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                Your private thoughts, links, and code snippets are saved with encryption prior to persistence. Remor enforces strict transport security, zero-knowledge data isolation, and verified Google OAuth authentication.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#E5E7EB' }}>
                  <CheckCircle2 size={16} color="#34D399" />
                  <span><strong>Encryption-Based Saving:</strong> Notes &amp; sensitive fields are protected at rest.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#E5E7EB' }}>
                  <CheckCircle2 size={16} color="#34D399" />
                  <span><strong>Encrypted SSL Transit:</strong> TLS 1.3 encrypted sync to secure cloud servers.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#E5E7EB' }}>
                  <CheckCircle2 size={16} color="#34D399" />
                  <span><strong>Better Auth &amp; Google Verification:</strong> Enterprise-grade session tokens &amp; key isolation.</span>
                </div>
              </div>
            </div>

            {/* Visual Security Box */}
            <div style={{ background: '#111827', border: '1px solid #374151', padding: '28px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1F2937', paddingBottom: '12px', marginBottom: '16px' }}>
                <span style={{ color: '#60A5FA', fontWeight: 600 }}>ENCRYPTION_STATUS: ACTIVE</span>
                <span style={{ color: '#34D399' }}>● SECURE</span>
              </div>
              <div style={{ color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><span style={{ color: '#9CA3AF' }}>[CYPHER]</span> payload = enc_aes256_gcm(content, master_key)</div>
                <div><span style={{ color: '#9CA3AF' }}>[HASH]</span> sha256_signature = 8f9b2c...a14e9e</div>
                <div><span style={{ color: '#9CA3AF' }}>[DB_SYNC]</span> Encrypted SSL Stream initialized</div>
                <div><span style={{ color: '#9CA3AF' }}>[AUTH]</span> Google OAuth 2.0 Session verified</div>
              </div>
              <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399', textAlign: 'center', fontWeight: 600 }}>
                100% PRIVATE &amp; ENCRYPTED STORAGE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Performance Specs ───────────────────────────── */}
      <section id="architecture" className="landing-section">
        <div className="landing-grid-4">
          <div style={{ padding: '24px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 700, color: 'var(--primary)' }}>&lt; 5ms</div>
            <div className="font-mono text-xs text-muted" style={{ marginTop: '8px' }}>SEARCH INDEX LATENCY</div>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 700, color: 'var(--primary)' }}>100%</div>
            <div className="font-mono text-xs text-muted" style={{ marginTop: '8px' }}>LOCAL-FIRST PERSISTENCE</div>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 700, color: 'var(--primary)' }}>0px</div>
            <div className="font-mono text-xs text-muted" style={{ marginTop: '8px' }}>SHARP RECTANGULAR EDGE SPEC</div>
          </div>
          <div style={{ padding: '24px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 700, color: 'var(--primary)' }}>∞</div>
            <div className="font-mono text-xs text-muted" style={{ marginTop: '8px' }}>COLLECTION &amp; TAG CAPACITY</div>
          </div>
        </div>
      </section>



      {/* ── Section: Final Call To Action ────────────────────────── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '100px 40px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '44px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '20px' }}>
          Build your digital memory layer today.
        </h2>
        <p className="text-secondary text-base" style={{ maxWidth: '540px', margin: '0 auto 36px', lineHeight: 1.6 }}>
          Join thousands of researchers, engineers, and designers who capture less and remember more with Remor.
        </p>
        <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }} onClick={handleLaunch}>
          Launch Remor Workspace <ArrowRight size={18} />
        </button>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '40px 16px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <div className="landing-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '20px', padding: '0 4px', background: '#0B1015', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px' }}>Re</div>
            <span className="font-heading font-600 text-primary">Remor Systems</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="font-mono text-xs" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span>DM Sans • Space Grotesk • DM Mono</span>
            <span>0px Sharp Corner Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
