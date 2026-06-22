import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_RESUME, DEFAULT_STYLE_CONFIG, INITIAL_EMPTY_RESUME } from './data/sampleData';
import { ResumeData, StyleConfig, ThemePreset } from './types';
import TemplateRenderer from './components/TemplateRenderer';
import CustomizePanel from './components/CustomizePanel';
import ResumeForm from './components/ResumeForm';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Download, Upload, Printer, Plus, Trash, Copy,
  Settings, PenSquare, ZoomIn, ZoomOut, Maximize2, Minimize2,
  Bookmark, Check, Eye, Code, FileCode, CheckCircle, RefreshCcw, AlertTriangle,
  X, HelpCircle, MoreVertical, Menu
} from 'lucide-react';

interface ResumeDocument {
  id: string;
  name: string;
  templateId: ThemePreset;
  styleConfig: StyleConfig;
  resumeData: ResumeData;
}

const STORAGE_KEY = 'resume-builder-v1-documents';
const ACTIVE_DOC_KEY = 'resume-builder-v1-active-id';

export default function App() {
  // --- CORE STATE ---
  const [documents, setDocuments] = useState<ResumeDocument[]>([]);
  const [activeDocId, setActiveDocId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'content' | 'customize'>('content');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [zoomScale, setZoomScale] = useState<number>(0.8);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingText, setRenamingText] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Interactive warnings / info toasts
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isFullscreenPrint, setIsFullscreenPrint] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  // --- INITIALIZE STORAGE ---
  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem(STORAGE_KEY);
      const storedActiveId = localStorage.getItem(ACTIVE_DOC_KEY);

      if (storedDocs) {
        const parsed: ResumeDocument[] = JSON.parse(storedDocs);
        if (parsed.length > 0) {
          setDocuments(parsed);
          const defaultActive = parsed.find(d => d.id === storedActiveId) || parsed[0];
          setActiveDocId(defaultActive.id);
          setLoading(false);
          return;
        }
      }

      // Fallback: seed with SAMPLE_RESUME and an empty resume draft
      const initialSeed: ResumeDocument[] = [
        {
          id: 'sample-software-engineer',
          name: '🚀 Sample: Senior Software Engineer',
          templateId: 'professional',
          styleConfig: { ...DEFAULT_STYLE_CONFIG },
          resumeData: { ...SAMPLE_RESUME, id: 'sample-software-engineer' }
        },
        {
          id: 'empty-draft-1',
          name: '📝 Empty Draft Specimen',
          templateId: 'modern',
          styleConfig: { ...DEFAULT_STYLE_CONFIG, showPhoto: false },
          resumeData: { 
            ...INITIAL_EMPTY_RESUME, 
            id: 'empty-draft-1',
            personalInfo: {
              ...INITIAL_EMPTY_RESUME.personalInfo,
              fullName: 'John Doe',
              jobTitle: 'Senior Project Lead'
            }
          }
        }
      ];

      setDocuments(initialSeed);
      setActiveDocId(initialSeed[0].id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeed));
      localStorage.setItem(ACTIVE_DOC_KEY, initialSeed[0].id);
    } catch (e) {
      console.error("Local storage lookup failed safely.", e);
    }
    setLoading(false);
  }, []);

  // --- TRIGGERS SAVE TO DATABASE ---
  const saveDocumentsToStore = (docsList: ResumeDocument[], forceActiveId?: string) => {
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docsList));
    const active = forceActiveId || activeDocId;
    if (active) {
      localStorage.setItem(ACTIVE_DOC_KEY, active);
    }
    setTimeout(() => {
      setSaveStatus('saved');
    }, 450);
  };

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // --- DERIVED ACTIVE DOCUMENT ---
  const activeDoc = documents.find(doc => doc.id === activeDocId) || documents[0];

  useEffect(() => {
    // Dynamic zoom resolution based on viewport width
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setZoomScale(0.45);
      } else if (width < 1024) {
        setZoomScale(0.65);
      } else if (width < 1440) {
        setZoomScale(0.72);
      } else {
        setZoomScale(0.85);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- MUTATOR WRAPPERS ---
  const handleUpdateResumeData = (updatedData: ResumeData) => {
    if (!activeDoc) return;
    const updatedDocs = documents.map(doc => {
      if (doc.id === activeDoc.id) {
        return { ...doc, resumeData: updatedData };
      }
      return doc;
    });
    setDocuments(updatedDocs);
    saveDocumentsToStore(updatedDocs);
  };

  const handleUpdateStyleConfig = (updatedStyle: StyleConfig) => {
    if (!activeDoc) return;
    const updatedDocs = documents.map(doc => {
      if (doc.id === activeDoc.id) {
        return { ...doc, styleConfig: updatedStyle };
      }
      return doc;
    });
    setDocuments(updatedDocs);
    saveDocumentsToStore(updatedDocs);
  };

  const handleUpdateTemplateId = (templateId: ThemePreset) => {
    if (!activeDoc) return;
    const updatedDocs = documents.map(doc => {
      if (doc.id === activeDoc.id) {
        return { ...doc, templateId };
      }
      return doc;
    });
    setDocuments(updatedDocs);
    saveDocumentsToStore(updatedDocs);
  };

  // --- DRAFT MANAGER ACTIONS ---
  const createNewDraftDocument = () => {
    const newId = `resume-draft-${Date.now()}`;
    const newDoc: ResumeDocument = {
      id: newId,
      name: `✨ New Draft #${documents.length + 1}`,
      templateId: 'professional',
      styleConfig: { ...DEFAULT_STYLE_CONFIG },
      resumeData: {
        ...INITIAL_EMPTY_RESUME,
        id: newId,
        title: `Draft #${documents.length + 1}`,
        updatedAt: new Date().toISOString()
      }
    };
    const list = [...documents, newDoc];
    setDocuments(list);
    setActiveDocId(newId);
    saveDocumentsToStore(list, newId);
    showToast('New resume draft created seamlessly!', 'success');
  };

  const cloneActiveDocument = () => {
    if (!activeDoc) return;
    const newId = `resume-clone-${Date.now()}`;
    const cloned: ResumeDocument = {
      ...activeDoc,
      id: newId,
      name: `📋 Copy: ${activeDoc.name}`,
      resumeData: {
        ...activeDoc.resumeData,
        id: newId,
        title: `${activeDoc.resumeData.title} (Cloned)`,
        updatedAt: new Date().toISOString()
      }
    };
    const list = [...documents, cloned];
    setDocuments(list);
    setActiveDocId(newId);
    saveDocumentsToStore(list, newId);
    showToast('Document cloned in high accuracy!', 'success');
  };

  const deleteDocumentDraft = (idToDelete: string) => {
    if (documents.length <= 1) {
      showToast('You must preserve at least one workspace draft.', 'error');
      return;
    }
    const remaining = documents.filter(doc => doc.id !== idToDelete);
    const targetId = activeDocId === idToDelete ? remaining[0].id : activeDocId;
    
    setDocuments(remaining);
    setActiveDocId(targetId);
    saveDocumentsToStore(remaining, targetId);
    showToast('Resume draft removed.', 'info');
  };

  const startRenameDraft = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenamingText(currentName);
  };

  const commitRenameDraft = () => {
    if (!renamingId || !renamingText.trim()) {
      setRenamingId(null);
      return;
    }
    const updated = documents.map(doc => {
      if (doc.id === renamingId) {
        return { ...doc, name: renamingText };
      }
      return doc;
    });
    setDocuments(updated);
    saveDocumentsToStore(updated);
    setRenamingId(null);
    showToast('Resume label updated.', 'success');
  };

  // --- PRINT / SAVE PDF ACTION ---
  const triggerPrintCascade = () => {
    setIsPrintModalOpen(true);
  };

  // --- BACKUP JSON EXPORT ---
  const triggerRawBackupExport = () => {
    if (!activeDoc) return;
    try {
      const serialized = JSON.stringify(activeDoc, null, 2);
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const trigger = document.createElement('a');
      
      const cleanFileName = activeDoc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      trigger.href = url;
      trigger.download = `resume_backup_${cleanFileName}.json`;
      document.body.appendChild(trigger);
      trigger.click();
      document.body.removeChild(trigger);
      URL.revokeObjectURL(url);
      
      showToast('JSON document backup downloaded!', 'success');
    } catch (e) {
      showToast('Failed to serialize backing database.', 'error');
    }
  };

  // --- RESTORE JSON IMPORT ---
  const triggerJSONRecoveryImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const rawText = loadEvent.target?.result as string;
        const parsed = JSON.parse(rawText);

        // Core type validations
        if (!parsed.id || !parsed.name || !parsed.resumeData || !parsed.styleConfig) {
          showToast('Import invalid: File is missing core resume schemas.', 'error');
          return;
        }

        // Regenerate unique IDs to prevent local collisions
        const importedId = `imported-${Date.now()}`;
        const finalImportDocument: ResumeDocument = {
          ...parsed,
          id: importedId,
          name: `📥 Imported: ${parsed.name}`,
          resumeData: {
            ...parsed.resumeData,
            id: importedId,
            updatedAt: new Date().toISOString()
          }
        };

        const list = [...documents, finalImportDocument];
        setDocuments(list);
        setActiveDocId(importedId);
        saveDocumentsToStore(list, importedId);
        showToast(`"${parsed.name}" loaded successfully with styles!`, 'success');
      } catch (err) {
        showToast('JSON parse error: File is corrupted or unreadable.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadOriginalSamplePreset = () => {
    if (!activeDoc) return;
    const confirmRestore = window.confirm("Are you sure you want to reset this current draft to the default Software Engineer sample data?");
    if (!confirmRestore) return;

    const updated = documents.map(doc => {
      if (doc.id === activeDoc.id) {
        return {
          ...doc,
          templateId: 'professional' as ThemePreset,
          styleConfig: { ...DEFAULT_STYLE_CONFIG },
          resumeData: { ...SAMPLE_RESUME, id: doc.id, title: doc.resumeData.title }
        };
      }
      return doc;
    });
    setDocuments(updated);
    saveDocumentsToStore(updated);
    showToast('Draft restored with professional developer content.', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-slate-400 font-mono text-sm tracking-widest uppercase">Loading Velicx Workbench...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100/40 text-slate-800 print:h-auto print:overflow-visible">
      
      {/* GLOBAL TOAST & NOTIFIER */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-4 sm:right-6 z-50 no-print"
          >
            <div className={`p-4 rounded-xl shadow-xl flex items-center gap-3 border ${
              toastMsg.type === 'error' 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : toastMsg.type === 'info'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {toastMsg.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-bold tracking-wide">{toastMsg.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER CONTROLS (No Print) */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3 border-b border-slate-800 shadow-lg no-print">

        {/* LOGO */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-black/40 ring-1 ring-white/10 flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/velicx-logo.png" alt="Velicx" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[13px] sm:text-sm font-black tracking-wider sm:tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent block truncate m-0">
              VELICX <span className="hidden xs:inline text-slate-300/80 font-bold">Resume Workbench</span>
              <span className="sr-only"> — Free Online Resume Builder</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="hidden sm:inline-flex text-[10px] bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase tracking-tighter">
                v1.2 Studio
              </span>
              <span className="hidden sm:inline text-[10px] text-slate-400">|</span>
              <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
              </span>
            </div>
          </div>
        </div>

        {/* DRAFT DROP SELECTOR & ACTIONS */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
          {/* RENAME SPECIFIC TEXT AREA */}
          {renamingId === activeDoc?.id ? (
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
              <input
                type="text"
                value={renamingText}
                onChange={(e) => setRenamingText(e.target.value)}
                onBlur={commitRenameDraft}
                onKeyDown={(e) => e.key === 'Enter' && commitRenameDraft()}
                autoFocus
                className="bg-transparent text-xs text-white p-1 px-2 focus:outline-none w-36 sm:w-44"
              />
              <button
                onClick={commitRenameDraft}
                className="p-1.5 px-2 bg-emerald-600 text-white rounded text-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {/* Selector */}
              <select
                value={activeDocId}
                onChange={(e) => {
                  setActiveDocId(e.target.value);
                  localStorage.setItem(ACTIVE_DOC_KEY, e.target.value);
                  showToast('Draft switched successfully.', 'info');
                }}
                className="bg-slate-800 hover:bg-slate-850 text-xs font-bold text-slate-200 border border-slate-700 rounded-lg p-2 focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[260px] truncate"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>

              {/* Rename Icon — desktop only */}
              <button
                onClick={() => startRenameDraft(activeDoc.id, activeDoc.name)}
                className="hidden sm:inline-flex p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white items-center justify-center"
                title="Rename Current Draft"
              >
                <PenSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Desktop action pills */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={createNewDraftDocument}
              className="p-2 px-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
              title="Add New Empty Resume"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">New Draft</span>
            </button>

            <button
              onClick={cloneActiveDocument}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
              title="Duplicate This Resume Draft"
            >
              <Copy className="w-3.5 h-3.5 inline mr-1 md:mr-0" />
              <span className="hidden md:inline">Duplicate</span>
            </button>

            <button
              onClick={() => deleteDocumentDraft(activeDoc.id)}
              disabled={documents.length <= 1}
              className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded-lg text-xs disabled:opacity-30 disabled:hover:bg-slate-800 disabled:hover:text-slate-400"
              title="Remove This Draft"
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile draft-actions menu */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsDraftMenuOpen(v => !v)}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg text-slate-200"
              aria-label="Draft actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isDraftMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDraftMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-1 text-sm overflow-hidden"
                  >
                    <button
                      onClick={() => { setIsDraftMenuOpen(false); createNewDraftDocument(); }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-slate-200 hover:bg-indigo-600/20 active:bg-indigo-600/30"
                    >
                      <Plus className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold">New Draft</span>
                    </button>
                    <button
                      onClick={() => { setIsDraftMenuOpen(false); cloneActiveDocument(); }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">Duplicate</span>
                    </button>
                    <button
                      onClick={() => { setIsDraftMenuOpen(false); startRenameDraft(activeDoc.id, activeDoc.name); }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-slate-200 hover:bg-slate-800 active:bg-slate-700"
                    >
                      <PenSquare className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">Rename</span>
                    </button>
                    <div className="h-px bg-slate-800 my-1" />
                    <button
                      onClick={() => { setIsDraftMenuOpen(false); deleteDocumentDraft(activeDoc.id); }}
                      disabled={documents.length <= 1}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-rose-300 hover:bg-rose-950/60 active:bg-rose-950 disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Trash className="w-4 h-4 text-rose-400" />
                      <span className="font-semibold">Delete Draft</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* LOWER STATUS AND TOOLBAR ACTIONS BAR */}
      <section className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 no-print">

        {/* Actions layout info — show breadcrumb on desktop, compact title on mobile */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Bookmark className="w-4 h-4 text-slate-400 shrink-0" />
          <nav className="text-xs text-gray-500 font-medium truncate">
            <span className="hidden sm:inline">Active Workspace: </span>
            <strong className="text-slate-800 font-bold">{activeDoc?.name}</strong>
          </nav>
        </div>

        {/* Action utility: Download, Recovery upload, system Print, restore sample */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Recovery Upload button file triggers */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={triggerJSONRecoveryImport}
            accept=".json"
            className="hidden"
          />

          {/* Desktop full toolbar */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 px-3 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Import raw JSON file backup back into editor"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Import backup (JSON)</span>
            </button>

            <button
              onClick={triggerRawBackupExport}
              className="p-2 px-3 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white rounded-lg flex items-center gap-1.5 transition-colors"
              title="Export full resume in editable JSON data file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export backup (JSON)</span>
            </button>

            <button
              onClick={loadOriginalSamplePreset}
              className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Wipe and restore to developer sample template"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Restore developer template</span>
            </button>
          </div>

          {/* PDF Export — always visible, primary action */}
          <button
            onClick={triggerPrintCascade}
            className="p-2 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-all shadow-md"
            title="Print the Document or Save directly to vector PDF paper size"
          >
            <Printer className="w-4 h-4 text-emerald-100" />
            <span className="hidden xs:inline">PDF</span>
            <span className="hidden sm:inline">/ PRINT</span>
          </button>

          {/* Mobile More menu — Import / Export / Restore */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setIsMoreMenuOpen(v => !v)}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-100 active:scale-95 rounded-lg text-slate-700"
              aria-label="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isMoreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-1 text-sm overflow-hidden"
                  >
                    <button
                      onClick={() => { setIsMoreMenuOpen(false); fileInputRef.current?.click(); }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-50 active:bg-slate-100"
                    >
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-700">Import backup (JSON)</span>
                    </button>
                    <button
                      onClick={() => { setIsMoreMenuOpen(false); triggerRawBackupExport(); }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-slate-50 active:bg-slate-100"
                    >
                      <Download className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-slate-700">Export backup (JSON)</span>
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={() => { setIsMoreMenuOpen(false); loadOriginalSamplePreset(); }}
                      className="w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-amber-50 active:bg-amber-100"
                    >
                      <RefreshCcw className="w-4 h-4 text-amber-600" />
                      <span className="font-semibold text-amber-800">Restore sample</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CORE WORKSPACE SPLITTER (Side-by-side or stacked on small screens) */}
      <main className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden no-print">
        
        {/* LEFT COLUMN: CORES AND SETTINGS EDITORS (6/12 width) */}
        <section className={`w-full md:w-[48%] lg:w-[42%] bg-white border-r border-slate-200/70 flex flex-col ${
          mobileView === 'edit' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Sub menu: Content vs custom layout configuration switcher */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActivePanel('content')}
              className={`flex-1 py-3 sm:py-3.5 px-2 text-xs sm:text-sm font-black uppercase tracking-wide sm:tracking-wider border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activePanel === 'content'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/10'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              <PenSquare className="w-4 h-4 shrink-0" />
              <span className="sm:hidden">Content</span>
              <span className="hidden sm:inline">Resume Content Editor</span>
            </button>
            <button
              onClick={() => setActivePanel('customize')}
              className={`flex-1 py-3 sm:py-3.5 px-2 text-xs sm:text-sm font-black uppercase tracking-wide sm:tracking-wider border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activePanel === 'customize'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/10'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="sm:hidden">Style</span>
              <span className="hidden sm:inline">Visual Style & Presets</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50/30 p-2 sm:p-4 pb-24 md:pb-4">
            {activePanel === 'content' ? (
              <ResumeForm
                data={activeDoc.resumeData}
                onChangeData={handleUpdateResumeData}
              />
            ) : (
              <CustomizePanel
                style={activeDoc.styleConfig}
                onChangeStyle={handleUpdateStyleConfig}
                activeTemplate={activeDoc.templateId}
                onChangeTemplate={handleUpdateTemplateId}
              />
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: REAL-TIME GRAPHICS PREVIEW WINDOW (6/12 width) */}
        <section className={`flex-1 bg-slate-200/60 p-3 sm:p-6 pb-24 md:pb-6 overflow-y-auto relative ${
          mobileView === 'preview' ? 'flex flex-col' : 'hidden md:flex md:flex-col'
        }`}>

          {/* Zoom & preview toolbar */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1.5 px-2 sm:p-2 sm:px-3 mb-3 sm:mb-4 shadow-sm w-full max-w-lg mx-auto md:w-auto md:max-w-none">
            <div className="flex items-center gap-2 min-w-0">
              <Eye className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-xs font-bold text-slate-600 font-mono truncate">
                <span className="hidden sm:inline">Real-time Paper Rendering</span>
                <span className="sm:hidden">Live Preview</span>
              </span>
            </div>

            {/* Zoom Controllers scale factor */}
            <div className="flex items-center gap-1 text-xs shrink-0">
              <button
                onClick={() => setZoomScale(Math.max(0.35, zoomScale - 0.08))}
                className="p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded text-slate-600"
                title="Scale Preview Out"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold min-w-[44px] text-center text-[10px]">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.08))}
                className="p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded text-slate-600"
                title="Scale Preview In"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const w = window.innerWidth;
                  setZoomScale(w < 768 ? 0.45 : w < 1440 ? 0.72 : 0.85);
                }}
                className="p-1 px-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded font-semibold text-[10px] text-slate-600"
                title="Fit to Ideal scale bounds"
              >
                Fit
              </button>
            </div>
          </div>

          {/* SIMULATED WORKPAPER CLIPBOARD (Standard Page Size representation) */}
          <div className="flex-1 flex items-start justify-center origin-top relative mb-8">
            <div 
              className="origin-top transition-transform duration-100 bg-white shadow-2xl rounded-sm"
              style={{ 
                transform: `scale(${zoomScale})`,
                marginBottom: `calc((1 - ${zoomScale}) * -1100px)` // Offset lower margin shrinkage when scaled down
              }}
            >
              <TemplateRenderer 
                data={activeDoc.resumeData}
                style={activeDoc.styleConfig}
                templateId={activeDoc.templateId}
              />
            </div>
          </div>
        </section>

      </main>

      {/* FLOATING ACTION BOTTOM NAV (Mobile Screens only - to swap between Editor and Preview) */}
      <div
        className="fixed left-3 right-3 z-40 flex bg-slate-950/95 backdrop-blur-md text-white rounded-full p-1 shadow-2xl justify-stretch border border-slate-800 md:hidden no-print"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <button
          onClick={() => setMobileView('edit')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] ${
            mobileView === 'edit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PenSquare className="w-4 h-4" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] ${
            mobileView === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>

      {/* PREMIUM PRINT & PDF EXPORT STUDIO MODAL */}
      <AnimatePresence>
        {isPrintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 no-print">
            {/* Backdrop wrapper overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrintModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Body container card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10 text-slate-800"
            >
              {/* Header block */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                    <Printer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase">PRINT & PDF EXPORT CENTER</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Format and prepare high resolution documents</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informational warning blocks / Environment validations */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[70vh]">
                
                {isInIframe ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-xs leading-relaxed space-y-3">
                    <div className="flex items-center gap-2 text-amber-800 font-bold">
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                      <span>Browser Sandbox Restricts Direct Print Dialogs</span>
                    </div>
                    <p className="font-semibold text-[11px] text-amber-800">
                      You are currently using this application within the <strong>AI Studio Interactive Preview Frame</strong>. Modern browsers block iframe scripts from launching native system print dialogs directly.
                    </p>
                    <div className="bg-white/75 border border-amber-100 p-2.5 rounded-lg space-y-1 text-[11px]">
                      <span className="font-extrabold text-amber-950 block border-b border-amber-100 pb-1 mb-1">To print or save correctly:</span>
                      <ol className="list-decimal list-inside space-y-1 text-amber-900 font-medium">
                        <li>Click the <strong className="text-indigo-800">"Open in New Tab" ↗️</strong> button at the top-right corner of the live preview panel.</li>
                        <li>This launches the resume web app in a dedicated tab.</li>
                        <li>Simply click <strong className="text-emerald-800">Export to PDF/PRINT</strong> in your new tab to start immediately!</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-4 text-emerald-900 text-xs leading-relaxed space-y-2">
                    <div className="flex items-center gap-2 text-emerald-850 font-bold">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                      <span>Stand-alone Tab Connected</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Excellent! The app is running natively in your browser tab. Your direct print engine is connected & ready for high-fidelity exports.
                    </p>
                  </div>
                )}

                {/* Highly critical export setup advice */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Settings className="w-3.5 h-3.5 text-indigo-505" />
                    <span>Recommended Document Sizing Rules</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 bg-slate-50/50">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-indigo-100">1</span>
                      <div className="text-[11px] leading-snug">
                        <span className="font-bold text-slate-800 block">Set destination to: "Save as PDF"</span>
                        <span className="text-slate-500 text-[10px]">Choosing "Save as PDF" guarantees vector text quality that is layout-perfect, selectable, and searchable.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 bg-slate-50/50">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-indigo-100">2</span>
                      <div className="text-[11px] leading-snug">
                        <span className="font-bold text-slate-800 block">Check/Enable: "Background Graphics"</span>
                        <span className="text-slate-500 text-[10px]">Must be toggled on to display professional timeline color nodes, theme backgrounds, level bars, and accent borders!</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 bg-slate-50/50">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-indigo-100">3</span>
                      <div className="text-[11px] leading-snug">
                        <span className="font-bold text-slate-800 block">Uncheck/Disable: "Headers & Footers"</span>
                        <span className="text-slate-500 text-[10px]">Guarantees a clean page layout without messy browser URLs, dates, and default page markers in margins.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 bg-slate-50/50">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0 border border-indigo-100">4</span>
                      <div className="text-[11px] leading-snug">
                        <span className="font-bold text-slate-800 block">Margin Selection: "None" or "Default"</span>
                        <span className="text-slate-500 text-[10px]">Ensures accurate aligning matching your configured designer scale without browser margin overlaps.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fullscreen print toggle shortcut */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-600 font-semibold text-[10px] sm:text-xs">Inspect 1:1 format in Fullscreen?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrintModalOpen(false);
                      setIsFullscreenPrint(true);
                    }}
                    className="p-1.5 px-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-[10px] font-black uppercase text-slate-700 rounded-lg shrink-0 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Fullscreen Mode
                  </button>
                </div>

              </div>

              {/* Action triggers */}
              <div className="bg-slate-50 p-4 px-5 border-t border-slate-150 flex flex-col sm:flex-row items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="w-full sm:w-auto p-2 px-3 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors rounded-lg text-center cursor-pointer"
                >
                  Close Options
                </button>
                
                {isInIframe ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrintModalOpen(false);
                      setIsFullscreenPrint(true);
                      showToast('Entering Fullscreen View. Please use browser standard Print shortcuts.', 'info');
                    }}
                    className="w-full sm:w-auto p-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Use Fullscreen Preview</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrintModalOpen(false);
                      setTimeout(() => {
                        window.print();
                      }, 100);
                    }}
                    className="w-full sm:w-auto p-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 font-black uppercase rounded-lg text-xs text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-emerald-100" />
                    <span>Proceed to Printer Dialog</span>
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN BYPASS VIEW */}
      {isFullscreenPrint && (
        <div className="fixed inset-0 z-[9999] bg-slate-900 overflow-y-auto print:static print:bg-white text-slate-800">
          
          {/* Floating action header bar */}
          <div className="sticky top-0 bg-slate-950 text-white p-3.5 px-6 flex items-center justify-between border-b border-slate-800 shadow-2xl no-print z-50">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-indigo-400 shrink-0 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">1:1 Print Alignment Dashboard</span>
                <h2 className="text-sm font-bold text-slate-100 truncate max-w-[200px] sm:max-w-none">{activeDoc?.name}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="p-2 px-4 bg-emerald-600 hover:bg-emerald-700 font-extrabold text-xs text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Launch System Print</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreenPrint(false)}
                className="p-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Exit Preview
              </button>
            </div>
          </div>

          {/* Centered representation page scaled fully */}
          <div className="p-4 sm:p-12 flex justify-center items-start bg-slate-900 print:bg-white print:p-0">
            <div className="bg-white p-0 shadow-2xl rounded-sm print:shadow-none">
              <TemplateRenderer 
                data={activeDoc.resumeData}
                style={activeDoc.styleConfig}
                templateId={activeDoc.templateId}
              />
            </div>
          </div>

        </div>
      )}

      {/* PRINT COVER SCREEN (Only visible under Print CSS natively to center content) */}
      <div className="hidden print:block absolute top-0 left-0 w-full bg-white print-area">
        <TemplateRenderer 
          data={activeDoc.resumeData}
          style={activeDoc.styleConfig}
          templateId={activeDoc.templateId}
        />
      </div>

    </div>
  );
}
