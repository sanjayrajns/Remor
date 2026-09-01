import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Sidebar from './components/Sidebar';
import ItemDetail from './components/ItemDetail';
import NoteEditor from './components/NoteEditor';
import QuickCapture from './components/QuickCapture';
import CommandPalette from './components/CommandPalette';
import HowToUseModal from './components/HowToUseModal';
import { useSession } from './lib/auth-client';

// Views
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import InboxView from './views/Inbox';
import TodayView from './views/Today';
import UpcomingView from './views/Upcoming';
import StarredView from './views/Starred';
import RecentlyViewedView from './views/RecentlyViewed';
import AllItemsView from './views/AllItems';
import CollectionsView from './views/Collections';
import AIInsightsView from './views/AIInsights';

/* ── Protected Route Guard ─────────────────────────────────── */
function ProtectedRoute({ children }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div style={{
        width: '100vw', height: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{
          width: '28px', height: '26px', padding: '0 4px', background: 'var(--primary)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-heading)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>Re</div>
        <span className="font-mono text-xs text-muted">Authenticating...</span>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ── Product Web App Workspace Component ──────────────────── */
function ProductWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeView, setActiveView, activeItemId, activeNoteId,
    setActiveItem, closeNote, toasts, initializeData, isInitialized,
  } = useStore();

  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load data from DB on mount
  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized, initializeData]);

  // Sync route path to activeView
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/app/today')) setActiveView('today');
    else if (path.includes('/app/upcoming')) setActiveView('upcoming');
    else if (path.includes('/app/starred')) setActiveView('starred');
    else if (path.includes('/app/recent')) setActiveView('recent');
    else if (path.includes('/app/all')) setActiveView('all');
    else if (path.includes('/app/insights')) setActiveView('insights');
    else if (path.includes('/app/collection/')) {
      const colId = path.split('/app/collection/')[1];
      if (colId) setActiveView(`col-${colId}`);
    } else if (path === '/app' || path === '/app/inbox') {
      setActiveView('inbox');
    }
  }, [location.pathname]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickCaptureOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (activeNoteId) closeNote();
        else if (activeItemId) setActiveItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemId, activeNoteId, setActiveItem, closeNote]);

  const getActiveViewTitle = () => {
    if (activeView.startsWith('col-')) return 'Collection';
    switch (activeView) {
      case 'inbox': return 'Inbox';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'starred': return 'Starred';
      case 'recent': return 'Recently Viewed';
      case 'all': return 'All Items';
      case 'insights': return 'AI Insights';
      default: return 'Workspace';
    }
  };

  const renderActiveView = () => {
    if (activeView.startsWith('col-')) {
      const collectionId = activeView.replace('col-', '');
      return <CollectionsView collectionId={collectionId} onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
    }
    switch (activeView) {
      case 'inbox':   return <InboxView onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
      case 'today':   return <TodayView onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
      case 'upcoming': return <UpcomingView onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
      case 'starred': return <StarredView onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
      case 'recent':  return <RecentlyViewedView onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
      case 'all':     return <AllItemsView onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
      case 'insights': return <AIInsightsView />;
      default:        return <InboxView onOpenQuickCapture={() => setIsQuickCaptureOpen(true)} />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenHowToUse={() => setIsHowToUseOpen(true)}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', overflow: 'hidden' }}>
        {/* Premium Top Mobile Bar */}
        <div className="mobile-top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="mobile-hamburger-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="16" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '22px', height: '20px', padding: '0 3px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', borderRadius: '3px' }}>Re</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>{getActiveViewTitle()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button className="btn-icon" onClick={() => setIsCommandPaletteOpen(true)} aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setIsQuickCaptureOpen(true)} style={{ padding: '5px 11px', fontSize: '12px', borderRadius: '6px' }}>
              + Capture
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', minWidth: 0, height: '100%', overflow: 'hidden' }}>
          {activeNoteId ? (
            <NoteEditor />
          ) : (
            <>
              {renderActiveView()}
              {activeItemId && <ItemDetail />}
            </>
          )}
        </div>
      </main>

      {/* Notion-Style Mobile Bottom Dock */}
      <nav className="mobile-bottom-dock">
        <button
          className={`mobile-bottom-dock-btn ${activeView === 'inbox' ? 'active' : ''}`}
          onClick={() => { setActiveView('inbox'); navigate('/app'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
          <span>Inbox</span>
        </button>

        <button
          className={`mobile-bottom-dock-btn ${activeView === 'today' ? 'active' : ''}`}
          onClick={() => { setActiveView('today'); navigate('/app/today'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Today</span>
        </button>

        <button
          className="mobile-bottom-dock-btn"
          onClick={() => setIsQuickCaptureOpen(true)}
          aria-label="Quick Capture"
        >
          <div className="mobile-capture-fab">+</div>
          <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600 }}>Capture</span>
        </button>

        <button
          className="mobile-bottom-dock-btn"
          onClick={() => setIsCommandPaletteOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Search</span>
        </button>

        <button
          className={`mobile-bottom-dock-btn ${activeView === 'all' ? 'active' : ''}`}
          onClick={() => { setActiveView('all'); navigate('/app/all'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          <span>Library</span>
        </button>
      </nav>
      <QuickCapture isOpen={isQuickCaptureOpen} onClose={() => setIsQuickCaptureOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      <HowToUseModal isOpen={isHowToUseOpen} onClose={() => setIsHowToUseOpen(false)} />
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast ${toast.type === 'success' ? 'toast-success' : toast.type === 'error' ? 'toast-error' : ''}`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main App Router ───────────────────────────────────────── */
export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Endpoint 1: Landing Page */}
      <Route path="/" element={<LandingPage onLaunchApp={() => navigate('/app')} />} />

      {/* Endpoint 2: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Endpoint 3: Protected Product Workspace */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <ProductWorkspace />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
