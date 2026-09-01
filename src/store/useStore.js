import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

const API = '/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API error');
  }
  return res.json();
}

// ── Store ───────────────────────────────────────────────────
const useStore = create((set, get) => ({
  // State
  items: [],
  collections: [],
  activeView: 'inbox',
  activeItemId: null,
  activeNoteId: null,
  searchQuery: '',
  selectedTags: [],
  selectedType: 'all',
  selectedStatus: 'all',
  selectedPriority: 'all',
  recentlyViewedIds: [],
  toasts: [],
  sidebarCollapsed: false,
  isLoading: false,
  isInitialized: false,

  // ── Data initialization (called on workspace mount) ──────
  initializeData: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const [items, collections] = await Promise.all([
        apiFetch('/items'),
        apiFetch('/collections'),
      ]);
      set({ items, collections, isInitialized: true });
    } catch (err) {
      console.error('[store] initializeData failed:', err);
      get().showToast('Failed to load data from server', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Navigation ──────────────────────────────────────────
  setActiveView: (view) => set({ activeView: view, activeItemId: null, activeNoteId: null }),
  setActiveItem: (id) => {
    if (id) {
      const state = get();
      const item = state.items.find(i => i.id === id);
      if (item) {
        const updates = { viewedAt: new Date().toISOString(), viewCount: (item.viewCount || 0) + 1 };
        set(s => ({
          items: s.items.map(i => i.id === id ? { ...i, ...updates } : i),
          activeItemId: id,
          recentlyViewedIds: [id, ...s.recentlyViewedIds.filter(rid => rid !== id)].slice(0, 20),
        }));
        apiFetch(`/items/${id}`, { method: 'PUT', body: JSON.stringify(updates) }).catch(() => {});
      }
    } else {
      set({ activeItemId: null });
    }
  },

  openNote: (id) => {
    set({ activeNoteId: id, activeItemId: null });
    set(s => ({
      recentlyViewedIds: [id, ...s.recentlyViewedIds.filter(rid => rid !== id)].slice(0, 20),
      items: s.items.map(i => i.id === id
        ? { ...i, viewedAt: new Date().toISOString(), viewCount: (i.viewCount || 0) + 1 }
        : i
      ),
    }));
  },
  closeNote: () => set({ activeNoteId: null }),

  // ── Filters ─────────────────────────────────────────────
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  toggleTagFilter: (tag) => set(s => ({
    selectedTags: s.selectedTags.includes(tag)
      ? s.selectedTags.filter(t => t !== tag)
      : [...s.selectedTags, tag]
  })),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  clearFilters: () => set({ searchQuery: '', selectedTags: [], selectedType: 'all', selectedStatus: 'all', selectedPriority: 'all' }),

  // ── Items CRUD ───────────────────────────────────────────
  addItem: async (data) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const item = {
      id,
      type: 'note',
      title: '',
      content: '',
      url: null,
      tags: [],
      collectionId: null,
      status: 'inbox',
      priority: 'medium',
      starred: false,
      reminder: null,
      dueDate: null,
      createdAt: now,
      updatedAt: now,
      viewedAt: null,
      viewCount: 0,
      aiTags: [],
      similarIds: [],
      notes: '',
      ...data,
    };

    // Optimistic update
    set(s => ({ items: [item, ...s.items] }));

    try {
      const saved = await apiFetch('/items', { method: 'POST', body: JSON.stringify(item) });
      // Merge server response (may have db-generated fields)
      set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...saved } : i) }));
      get().showToast('Item saved', 'success');
    } catch (err) {
      // Rollback on error
      set(s => ({ items: s.items.filter(i => i.id !== id) }));
      get().showToast('Failed to save item', 'error');
    }

    return id;
  },

  updateItem: async (id, data) => {
    // Optimistic update
    set(s => ({
      items: s.items.map(i => i.id === id
        ? { ...i, ...data, updatedAt: new Date().toISOString() }
        : i
      )
    }));

    try {
      await apiFetch(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (err) {
      console.error('[store] updateItem failed:', err);
    }
  },

  deleteItem: async (id) => {
    const prev = get().items;
    set(s => ({
      items: s.items.filter(i => i.id !== id),
      activeItemId: s.activeItemId === id ? null : s.activeItemId,
      recentlyViewedIds: s.recentlyViewedIds.filter(rid => rid !== id),
    }));

    try {
      await apiFetch(`/items/${id}`, { method: 'DELETE' });
      get().showToast('Item deleted');
    } catch (err) {
      set({ items: prev });
      get().showToast('Failed to delete item', 'error');
    }
  },

  toggleStar: async (id) => {
    const item = get().items.find(i => i.id === id);
    const newStarred = !item?.starred;
    set(s => ({
      items: s.items.map(i => i.id === id ? { ...i, starred: newStarred, updatedAt: new Date().toISOString() } : i)
    }));
    get().showToast(newStarred ? 'Added to starred' : 'Removed from starred', newStarred ? 'success' : '');
    apiFetch(`/items/${id}`, { method: 'PUT', body: JSON.stringify({ starred: newStarred }) }).catch(() => {});
  },

  markDone: async (id) => {
    const item = get().items.find(i => i.id === id);
    const newStatus = item?.status === 'done' ? 'active' : 'done';
    set(s => ({
      items: s.items.map(i => i.id === id
        ? { ...i, status: newStatus, updatedAt: new Date().toISOString() }
        : i
      )
    }));
    get().showToast('Status updated', 'success');
    apiFetch(`/items/${id}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) }).catch(() => {});
  },

  archiveItem: async (id) => {
    set(s => ({
      items: s.items.map(i => i.id === id
        ? { ...i, status: 'archived', updatedAt: new Date().toISOString() }
        : i
      )
    }));
    get().showToast('Item archived');
    apiFetch(`/items/${id}`, { method: 'PUT', body: JSON.stringify({ status: 'archived' }) }).catch(() => {});
  },

  duplicateItem: async (id) => {
    const item = get().items.find(i => i.id === id);
    if (!item) return;
    const newId = uuidv4();
    const now = new Date().toISOString();
    const newItem = { ...item, id: newId, title: item.title + ' (copy)', createdAt: now, updatedAt: now, viewedAt: null, viewCount: 0 };
    set(s => ({ items: [newItem, ...s.items] }));

    try {
      await apiFetch('/items', { method: 'POST', body: JSON.stringify(newItem) });
      get().showToast('Item duplicated');
    } catch {
      set(s => ({ items: s.items.filter(i => i.id !== newId) }));
      get().showToast('Failed to duplicate item', 'error');
    }

    return newId;
  },

  // ── Collections ──────────────────────────────────────────
  addCollection: async (data) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const col = { id, icon: '📁', color: '#6B7280', ...data, createdAt: now };
    set(s => ({ collections: [...s.collections, col] }));

    try {
      await apiFetch('/collections', { method: 'POST', body: JSON.stringify(col) });
      get().showToast('Collection created', 'success');
    } catch {
      set(s => ({ collections: s.collections.filter(c => c.id !== id) }));
      get().showToast('Failed to create collection', 'error');
    }

    return id;
  },

  updateCollection: async (id, data) => {
    set(s => ({
      collections: s.collections.map(c => c.id === id ? { ...c, ...data } : c)
    }));
    apiFetch(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => {});
  },

  deleteCollection: async (id) => {
    set(s => ({
      collections: s.collections.filter(c => c.id !== id),
      items: s.items.map(i => i.collectionId === id ? { ...i, collectionId: null } : i),
    }));
    get().showToast('Collection deleted');
    apiFetch(`/collections/${id}`, { method: 'DELETE' }).catch(() => {});
  },

  // ── Toasts ───────────────────────────────────────────────
  showToast: (message, type = '') => {
    const id = uuidv4();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },

  // ── Sidebar ──────────────────────────────────────────────
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // ── Derived selectors ────────────────────────────────────
  getFilteredItems: () => {
    const { items, searchQuery, selectedTags, selectedType, selectedStatus, selectedPriority } = get();
    let filtered = items.filter(i => i.status !== 'archived');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.content.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)) ||
        (i.url && i.url.toLowerCase().includes(q))
      );
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(i => selectedTags.every(t => i.tags.includes(t)));
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(i => i.type === selectedType);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(i => i.status === selectedStatus);
    }
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(i => i.priority === selectedPriority);
    }
    return filtered;
  },

  getSimilarItems: (itemId) => {
    const { items } = get();
    const item = items.find(i => i.id === itemId);
    if (!item) return [];
    return items
      .filter(i => i.id !== itemId && i.status !== 'archived')
      .map(i => {
        const sharedTags = item.tags.filter(t => i.tags.includes(t)).length;
        const sameType = i.type === item.type ? 1 : 0;
        const sameCollection = i.collectionId && i.collectionId === item.collectionId ? 2 : 0;
        return { item: i, score: sharedTags * 3 + sameType + sameCollection };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ item }) => item);
  },

  getAllTags: () => {
    const { items } = get();
    const freq = {};
    items.forEach(i => i.tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count }));
  },

  getInboxCount: () => get().items.filter(i => i.status === 'inbox').length,

  getTodayItems: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return get().items.filter(i => {
      if (i.status === 'archived' || i.status === 'done') return false;
      const due = i.dueDate ? new Date(i.dueDate) : null;
      const rem = i.reminder ? new Date(i.reminder) : null;
      return (due && due >= today && due < tomorrow) || (rem && rem >= today && rem < tomorrow);
    });
  },

  getUpcomingItems: () => {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return get().items.filter(i => {
      if (i.status === 'archived' || i.status === 'done') return false;
      const due = i.dueDate ? new Date(i.dueDate) : null;
      const rem = i.reminder ? new Date(i.reminder) : null;
      return (due && due >= tomorrow) || (rem && rem >= tomorrow);
    }).sort((a, b) => {
      const aDate = new Date(a.dueDate || a.reminder);
      const bDate = new Date(b.dueDate || b.reminder);
      return aDate - bDate;
    });
  },
}));

export default useStore;
