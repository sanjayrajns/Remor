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

import MobileCreateView from './views/MobileCreate';

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
          width: '28px', height: '26px', padding: '0 4px', background: '#0B1015',
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
    else if (path.includes('/app/create')) setActiveView('create');
    else if (path.includes('/app/collection/')) {
      const colId = path.split('/app/collection/')[1];
      if (colId) setActiveView(`col-${colId}`);
    } else if (path === '/app' || path === '/app/inbox') {
      setActiveView('inbox');
    }
  }, [location.pathname]);

  // Global Keyboard Shortcuts (Capture phase for 100% reliable input override)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? (e.metaKey || e.ctrlKey) : (e.ctrlKey || e.metaKey);

      const key = (e.key || '').toLowerCase();
      const code = (e.code || '').toLowerCase();

      // Ctrl+K / Cmd+K -> Quick Capture
      if (isCmdOrCtrl && (key === 'k' || code === 'keyk')) {
        e.preventDefault();
        e.stopPropagation();
        setIsQuickCaptureOpen((prev) => !prev);
        return;
      }

      // Ctrl+P / Cmd+P -> Command Palette (overrides browser print dialog)
      if (isCmdOrCtrl && (key === 'p' || code === 'keyp')) {
        e.preventDefault();
        e.stopPropagation();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Escape -> Close open modals or note/detail drawers
      if (key === 'escape' || code === 'escape') {
        if (isQuickCaptureOpen) {
          setIsQuickCaptureOpen(false);
        } else if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else if (isHowToUseOpen) {
          setIsHowToUseOpen(false);
        } else if (activeNoteId) {
          closeNote();
        } else if (activeItemId) {
          setActiveItem(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [activeItemId, activeNoteId, isQuickCaptureOpen, isCommandPaletteOpen, isHowToUseOpen, setActiveItem, closeNote]);

  const handleCaptureClick = () => {
    if (window.innerWidth <= 768) {
      navigate('/app/create');
    } else {
      setIsQuickCaptureOpen(true);
    }
  };

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
      case 'create': return 'Create Asset';
      default: return 'Workspace';
    }
  };

  const renderActiveView = () => {
    if (activeView.startsWith('col-')) {
      const collectionId = activeView.replace('col-', '');
      return <CollectionsView collectionId={collectionId} onOpenQuickCapture={handleCaptureClick} />;
    }
    switch (activeView) {
      case 'inbox':   return <InboxView onOpenQuickCapture={handleCaptureClick} />;
      case 'today':   return <TodayView onOpenQuickCapture={handleCaptureClick} />;
      case 'upcoming': return <UpcomingView onOpenQuickCapture={handleCaptureClick} />;
      case 'starred': return <StarredView onOpenQuickCapture={handleCaptureClick} />;
      case 'recent':  return <RecentlyViewedView onOpenQuickCapture={handleCaptureClick} />;
      case 'all':     return <AllItemsView onOpenQuickCapture={handleCaptureClick} />;
      case 'insights': return <AIInsightsView />;
      case 'create':   return <MobileCreateView />;
      default:        return <InboxView onOpenQuickCapture={handleCaptureClick} />;
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
        onOpenQuickCapture={handleCaptureClick}
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
              <div style={{ width: '22px', height: '20px', padding: '0 3px', background: '#0B1015', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px', borderRadius: '3px' }}>Re</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>{getActiveViewTitle()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button className="btn-icon" onClick={() => setIsCommandPaletteOpen(true)} aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleCaptureClick} style={{ padding: '5px 11px', fontSize: '12px', borderRadius: '6px' }}>
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
