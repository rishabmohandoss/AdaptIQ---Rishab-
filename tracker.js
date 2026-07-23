/**
 * AdaptIQ — Application Tracker Module (tracker.js)
 * Owns: CRUD for the Application Tracker section (backed by localStorage
 * for now — same function shapes as a future Firestore-backed version, so
 * only loadApps()/saveApps() need to change if this migrates to the cloud).
 * Depends on: window.AdaptIQ_Auth (optional, for uid-scoping the store key).
 */

window.AdaptIQ_Tracker = (() => {
  'use strict';

  const STAGE_LABEL = {
    saved: 'Saved', applied: 'Applied', phone_screen: 'Phone Screen',
    round_1: '1st Round', round_2: '2nd Round', final_round: 'Final Round',
    offer: 'Offer', rejected: 'Rejected', withdrawn: 'Withdrawn',
  };
  const MAX_RESUME_BYTES = 5 * 1024 * 1024;

  const state = {
    wired: false,
    applications: [],
    statusFilter: 'all',
    sortMode: 'date-desc',
    editingAppId: null,   // null = creating a new application
    contactsDraft: [],    // [{ id, name, role, relationship, linkedinUrl, notes }]
    stageHistoryDraft: [],
    pendingResume: null,  // { fileName, dataUrl, uploadedAt } staged until save
  };

  // ============================================================
  // STORE (localStorage)
  // ============================================================
  function currentUid() { return window.AdaptIQ_Auth?.auth?.currentUser?.uid || 'guest'; }
  function storageKey() { return `adaptiq_tracker_apps::${currentUid()}`; }

  function loadApps() {
    try { return JSON.parse(localStorage.getItem(storageKey()) || '[]'); }
    catch (e) { console.warn('[Tracker] Corrupt local data, resetting:', e); return []; }
  }
  function saveApps(apps) {
    localStorage.setItem(storageKey(), JSON.stringify(apps));
  }

  // ============================================================
  // INIT / SCREEN ENTRY
  // ============================================================
  function init() {
    wireOnce();
    state.applications = loadApps();
    renderTable();
  }

  // ============================================================
  // RENDER — TABLE
  // ============================================================
  function filteredSorted() {
    let list = state.applications.slice();
    if (state.statusFilter !== 'all') list = list.filter(a => a.stage === state.statusFilter);
    const dateMs = (a) => a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
    if (state.sortMode === 'date-desc') list.sort((a, b) => dateMs(b) - dateMs(a));
    else if (state.sortMode === 'date-asc') list.sort((a, b) => dateMs(a) - dateMs(b));
    else if (state.sortMode === 'company-asc') list.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
    return list;
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderTable() {
    const list = filteredSorted();
    const empty = document.getElementById('tracker-empty');
    const wrap = document.getElementById('tracker-table-wrap');
    const body = document.getElementById('tracker-table-body');

    if (!state.applications.length) {
      empty.classList.remove('hidden');
      wrap.classList.add('hidden');
      return;
    }
    empty.classList.add('hidden');
    wrap.classList.remove('hidden');

    body.innerHTML = list.map(a => `
      <tr data-id="${a.id}">
        <td class="tracker-company">${escapeHtml(a.company || 'Untitled')}</td>
        <td class="tracker-role">${escapeHtml(a.role || '—')}</td>
        <td>${fmtDate(a.appliedDate)}</td>
        <td><span class="tracker-status-pill stage-${a.stage || 'saved'}">${STAGE_LABEL[a.stage] || a.stage || 'Saved'}</span></td>
        <td>${a.resume ? `<span class="tracker-row-badge">📄 ${escapeHtml(a.resume.fileName || 'resume')}</span>` : `<span class="tracker-row-badge">—</span>`}</td>
        <td><span class="tracker-row-badge">${(a.contacts || []).length}</span></td>
        <td>
          <div class="tracker-row-actions">
            <button type="button" class="tracker-edit-row" data-id="${a.id}" title="Edit">✎</button>
            <button type="button" class="tracker-delete-row danger" data-id="${a.id}" title="Delete">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    body.querySelectorAll('.tracker-edit-row').forEach(btn =>
      btn.addEventListener('click', (e) => { e.stopPropagation(); openModal(btn.dataset.id); }));
    body.querySelectorAll('.tracker-delete-row').forEach(btn =>
      btn.addEventListener('click', (e) => { e.stopPropagation(); deleteApplication(btn.dataset.id); }));
    body.querySelectorAll('tr').forEach(row =>
      row.addEventListener('click', () => openModal(row.dataset.id)));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ============================================================
  // MODAL: ADD / EDIT
  // ============================================================
  function openModal(appId) {
    state.editingAppId = appId || null;
    state.contactsDraft = [];
    state.stageHistoryDraft = [];
    state.pendingResume = null;

    const form = document.getElementById('tracker-app-form');
    form.reset();
    document.getElementById('tracker-app-modal-title').textContent = appId ? 'Edit Application' : 'Add Application';
    document.getElementById('tracker-delete-btn').classList.toggle('hidden', !appId);
    document.getElementById('tracker-resume-tag').classList.add('hidden');
    document.getElementById('tracker-resume-zone-text').textContent = 'Drop a resume here or browse';
    document.getElementById('tracker-stage-timeline-wrap').classList.toggle('hidden', !appId);

    if (appId) {
      const app = state.applications.find(a => a.id === appId);
      if (app) {
        document.getElementById('tracker-field-company').value = app.company || '';
        document.getElementById('tracker-field-role').value = app.role || '';
        document.getElementById('tracker-field-stage').value = app.stage || 'applied';
        document.getElementById('tracker-field-focus').value = app.companyFocus || '';
        document.getElementById('tracker-field-url').value = app.jobUrl || '';
        document.getElementById('tracker-field-notes').value = app.notes || '';
        document.getElementById('tracker-field-date').value = app.appliedDate || '';
        state.contactsDraft = (app.contacts || []).map(c => ({ ...c }));
        state.stageHistoryDraft = (app.stageHistory || []).map(h => ({ ...h }));
        if (app.resume) {
          state.pendingResume = app.resume;
          document.getElementById('tracker-resume-tag').classList.remove('hidden');
          document.getElementById('tracker-resume-zone-text').textContent = app.resume.fileName;
        }
      }
    } else {
      document.getElementById('tracker-field-date').value = new Date().toISOString().slice(0, 10);
    }

    renderContactsDraft();
    renderStageTimeline();
    document.getElementById('tracker-app-modal').classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('tracker-app-modal').classList.add('hidden');
  }

  // ---- Stage history timeline (read-only, auto-appended on save) ----
  function renderStageTimeline() {
    const el = document.getElementById('tracker-stage-timeline');
    el.innerHTML = state.stageHistoryDraft.map(h => `
      <div class="tracker-stage-timeline-item">
        <span class="dot"></span>
        <span class="label">${STAGE_LABEL[h.stage] || h.stage}</span>
        <span class="date">${fmtDate(h.date)}</span>
      </div>
    `).join('');
  }

  // ---- Contacts draft rows ----
  function renderContactsDraft() {
    const list = document.getElementById('tracker-contacts-list');
    list.innerHTML = state.contactsDraft.map((c, i) => `
      <div class="tracker-contact-row" data-i="${i}">
        <input type="text" placeholder="Name" data-field="name" value="${escapeHtml(c.name || '')}">
        <input type="text" placeholder="Role" data-field="role" value="${escapeHtml(c.role || '')}">
        <input type="text" placeholder="Relationship" data-field="relationship" value="${escapeHtml(c.relationship || '')}">
        <button type="button" class="tracker-contact-remove" data-i="${i}" title="Remove">×</button>
      </div>
    `).join('');

    list.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        const row = input.closest('.tracker-contact-row');
        const i = Number(row.dataset.i);
        state.contactsDraft[i][input.dataset.field] = input.value;
      });
    });
    list.querySelectorAll('.tracker-contact-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        state.contactsDraft.splice(Number(btn.dataset.i), 1);
        renderContactsDraft();
      });
    });
  }

  // ============================================================
  // SAVE / DELETE
  // ============================================================
  function saveApplication(evt) {
    evt.preventDefault();

    const company = document.getElementById('tracker-field-company').value.trim();
    if (!company) return;
    const stage = document.getElementById('tracker-field-stage').value;
    const now = new Date().toISOString();

    const existing = state.editingAppId ? state.applications.find(a => a.id === state.editingAppId) : null;
    const stageChanged = !existing || existing.stage !== stage;
    const stageHistory = state.stageHistoryDraft.slice();
    if (stageChanged) stageHistory.push({ stage, date: now });

    const payload = {
      id: existing ? existing.id : crypto.randomUUID(),
      company,
      role: document.getElementById('tracker-field-role').value.trim(),
      appliedDate: document.getElementById('tracker-field-date').value || null,
      stage,
      stageHistory,
      companyFocus: document.getElementById('tracker-field-focus').value.trim(),
      jobUrl: document.getElementById('tracker-field-url').value.trim() || null,
      notes: document.getElementById('tracker-field-notes').value.trim(),
      resume: state.pendingResume,
      contacts: state.contactsDraft.map(c => ({
        id: c.id || crypto.randomUUID(), name: c.name || '', role: c.role || '',
        relationship: c.relationship || '', linkedinUrl: c.linkedinUrl || null, notes: c.notes || '',
      })),
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    if (existing) {
      state.applications = state.applications.map(a => a.id === payload.id ? payload : a);
    } else {
      state.applications.push(payload);
    }
    saveApps(state.applications);
    renderTable();
    closeModal();
  }

  function handleResumeFile(file) {
    if (!file) return;
    if (file.size > MAX_RESUME_BYTES) {
      alert('That file is too large — please attach a resume under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.pendingResume = { fileName: file.name, dataUrl: reader.result, uploadedAt: new Date().toISOString() };
      document.getElementById('tracker-resume-tag').classList.remove('hidden');
      document.getElementById('tracker-resume-zone-text').textContent = file.name;
    };
    reader.onerror = () => console.warn('[Tracker] Failed to read resume file:', reader.error);
    reader.readAsDataURL(file);
  }

  function deleteApplication(appId) {
    if (!confirm('Delete this application? This cannot be undone.')) return;
    state.applications = state.applications.filter(a => a.id !== appId);
    saveApps(state.applications);
    renderTable();
    if (state.editingAppId === appId) closeModal();
  }

  // ============================================================
  // WIRING (once)
  // ============================================================
  function wireOnce() {
    if (state.wired) return;
    state.wired = true;

    document.getElementById('tracker-add-btn')?.addEventListener('click', () => openModal(null));
    document.getElementById('tracker-empty-add-btn')?.addEventListener('click', () => openModal(null));
    document.getElementById('tracker-app-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('tracker-app-modal-backdrop')?.addEventListener('click', closeModal);
    document.getElementById('tracker-cancel-btn')?.addEventListener('click', closeModal);
    document.getElementById('tracker-app-form')?.addEventListener('submit', saveApplication);
    document.getElementById('tracker-delete-btn')?.addEventListener('click', () => {
      if (state.editingAppId) deleteApplication(state.editingAppId);
    });
    document.getElementById('tracker-add-contact-btn')?.addEventListener('click', () => {
      state.contactsDraft.push({ name: '', role: '', relationship: '', linkedinUrl: null, notes: '' });
      renderContactsDraft();
    });

    document.getElementById('tracker-resume-upload')?.addEventListener('change', (e) => {
      handleResumeFile(e.target.files[0]);
    });

    document.getElementById('tracker-status-filter')?.addEventListener('change', (e) => {
      state.statusFilter = e.target.value;
      renderTable();
    });
    document.getElementById('tracker-sort-select')?.addEventListener('change', (e) => {
      state.sortMode = e.target.value;
      renderTable();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('tracker-app-modal').classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  return { init };
})();
