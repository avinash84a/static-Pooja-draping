'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Wrench,
  BookOpen,
  Palette,
  Target,
  Workflow,
  Rocket,
  Landmark,
  Laptop,
  Home,
  Code,
  Download,
  RefreshCw,
  FileText,
  X,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Eye,
} from 'lucide-react';
import {
  AICourseConfig,
  AICourseToolItem,
  AICoursePillarItem,
  AICourseChallengeItem,
  AICourseBatchItem,
  AICourseData,
  DEFAULT_AI_COURSE_DATA,
  loadAICourseDataAsync,
  saveAICourseDataAsync,
} from '../lib/galleryStorage';

interface AICourseAdminManagerProps {
  showToast: (msg: string) => void;
  onDataChanged?: () => void;
}

export default function AICourseAdminManager({ showToast, onDataChanged }: AICourseAdminManagerProps) {
  const [data, setData] = useState<AICourseData>(DEFAULT_AI_COURSE_DATA);
  const [activeSubTab, setActiveSubTab] = useState<
    'tools' | 'pillars' | 'challenges' | 'batches' | 'settings' | 'wpcode'
  >('tools');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tools state
  const [toolSearch, setToolSearch] = useState<string>('');
  const [toolCatFilter, setToolCatFilter] = useState<string>('all');
  const [editingTool, setEditingTool] = useState<AICourseToolItem | null>(null);
  const [isAddToolOpen, setIsAddToolOpen] = useState<boolean>(false);
  const [newTool, setNewTool] = useState<Partial<AICourseToolItem>>({
    name: '',
    category: 'all',
    badgeText: '',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    primaryUseMr: '',
    primaryUseHi: '',
    audienceMr: '',
    audienceHi: '',
    websiteUrl: '',
  });

  // Pillars state
  const [editingPillar, setEditingPillar] = useState<AICoursePillarItem | null>(null);

  // Challenges state
  const [editingChallenge, setEditingChallenge] = useState<AICourseChallengeItem | null>(null);
  const [isAddChallengeOpen, setIsAddChallengeOpen] = useState<boolean>(false);
  const [newChallenge, setNewChallenge] = useState<Partial<AICourseChallengeItem>>({
    roleMr: '',
    roleHi: '',
    icon: 'Briefcase',
    pipeline: [],
    pipelineTextMr: '',
    pipelineTextHi: '',
    toolsUsed: [],
    outcomeMr: '',
    outcomeHi: '',
    sampleInput: '',
    samplePrompt: '',
  });

  // Batches state
  const [editingBatch, setEditingBatch] = useState<AICourseBatchItem | null>(null);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState<boolean>(false);
  const [newBatch, setNewBatch] = useState<Partial<AICourseBatchItem>>({
    title: '',
    date: '',
    time: 'सकाळी १०:०० ते संध्याकाळी ५:००',
    mode: 'Pune Offline + Zoom Live Online',
    seatsTotal: 15,
    seatsBooked: 0,
    status: 'Open',
  });

  // WPCode state
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [wpCodeSnippet, setWpCodeSnippet] = useState<string>('');
  const [loadingSnippet, setLoadingSnippet] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    let mounted = true;
    loadAICourseDataAsync().then((loaded) => {
      if (mounted && loaded) {
        setData(loaded);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveData = async (updated: AICourseData, successMsg: string) => {
    setData(updated);
    await saveAICourseDataAsync(updated);
    showToast(successMsg);
    if (onDataChanged) onDataChanged();
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (confirm('सर्व AI कोर्स डेटा मूळ (Default) स्थितीत आणायचा आहे का? तुम्ही केलेले बदल पूर्ववत होतील.')) {
      handleSaveData(DEFAULT_AI_COURSE_DATA, 'मूळ AI कोर्स डेटा रिस्टोअर झाला! 🔄');
    }
  };

  // -------------------------------------------------------------
  // TOOL OPERATIONS (CRUD)
  // -------------------------------------------------------------
  const filteredTools = useMemo(() => {
    return (data.tools || []).filter((tool) => {
      const matchesCat = toolCatFilter === 'all' || tool.category === toolCatFilter;
      const matchesSearch =
        toolSearch === '' ||
        tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.primaryUseMr.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.audienceMr.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.badgeText.toLowerCase().includes(toolSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [data.tools, toolCatFilter, toolSearch]);

  const handleAddToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.name?.trim()) return;

    const toolItem: AICourseToolItem = {
      id: 'tool-' + Date.now(),
      name: newTool.name.trim(),
      category: (newTool.category as any) || 'all',
      badgeText: newTool.badgeText?.trim() || 'AI Tool',
      badgeColor: newTool.badgeColor || 'bg-blue-100 text-blue-800 border-blue-300',
      primaryUseMr: newTool.primaryUseMr?.trim() || '',
      primaryUseHi: newTool.primaryUseHi?.trim() || newTool.primaryUseMr?.trim() || '',
      audienceMr: newTool.audienceMr?.trim() || '👥 सर्व',
      audienceHi: newTool.audienceHi?.trim() || newTool.audienceMr?.trim() || '👥 सभी',
      websiteUrl: newTool.websiteUrl?.trim() || '',
      order: (data.tools || []).length + 1,
    };

    const updatedTools = [...(data.tools || []), toolItem];
    handleSaveData({ ...data, tools: updatedTools }, `नवीन टूल "${toolItem.name}" जोडले गेले! 🛠️`);

    setNewTool({
      name: '',
      category: 'all',
      badgeText: '',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      primaryUseMr: '',
      primaryUseHi: '',
      audienceMr: '',
      audienceHi: '',
      websiteUrl: '',
    });
    setIsAddToolOpen(false);
  };

  const handleUpdateToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;

    const updatedTools = (data.tools || []).map((t) => (t.id === editingTool.id ? editingTool : t));
    handleSaveData({ ...data, tools: updatedTools }, `टूल "${editingTool.name}" अपडेट झाले! ✅`);
    setEditingTool(null);
  };

  const handleDeleteTool = (toolId: string, toolName: string) => {
    if (confirm(`टूल "${toolName}" खरोखर हटवायचे आहे का?`)) {
      const updatedTools = (data.tools || []).filter((t) => t.id !== toolId);
      handleSaveData({ ...data, tools: updatedTools }, `टूल "${toolName}" हटवले गेले! 🗑️`);
    }
  };

  // -------------------------------------------------------------
  // PILLAR OPERATIONS (CRUD)
  // -------------------------------------------------------------
  const handleUpdatePillarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPillar) return;

    const updatedPillars = (data.pillars || []).map((p) => (p.id === editingPillar.id ? editingPillar : p));
    handleSaveData({ ...data, pillars: updatedPillars }, `पिलर "${editingPillar.nameEn}" अपडेट झाला! ✅`);
    setEditingPillar(null);
  };

  // -------------------------------------------------------------
  // CHALLENGE OPERATIONS (CRUD)
  // -------------------------------------------------------------
  const handleAddChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.roleMr?.trim()) return;

    const pipelineArr = (newChallenge.pipelineTextMr || '')
      .split('→')
      .map((s) => s.trim())
      .filter(Boolean);

    const challengeItem: AICourseChallengeItem = {
      id: 'ch-' + Date.now(),
      roleMr: newChallenge.roleMr.trim(),
      roleHi: newChallenge.roleHi?.trim() || newChallenge.roleMr.trim(),
      icon: newChallenge.icon || 'Briefcase',
      pipeline: pipelineArr.length > 0 ? pipelineArr : ['Step 1', 'Step 2', 'Step 3'],
      pipelineTextMr: newChallenge.pipelineTextMr || '',
      pipelineTextHi: newChallenge.pipelineTextHi || newChallenge.pipelineTextMr || '',
      toolsUsed: (newChallenge.toolsUsed as any) || ['ChatGPT', 'Gemini'],
      outcomeMr: newChallenge.outcomeMr || '',
      outcomeHi: newChallenge.outcomeHi || newChallenge.outcomeMr || '',
      sampleInput: newChallenge.sampleInput || '',
      samplePrompt: newChallenge.samplePrompt || '',
      order: (data.challenges || []).length + 1,
    };

    const updatedChallenges = [...(data.challenges || []), challengeItem];
    handleSaveData({ ...data, challenges: updatedChallenges }, `नवीन प्रोजेक्ट चॅलेंज जोडले गेले! 🎯`);

    setNewChallenge({
      roleMr: '',
      roleHi: '',
      icon: 'Briefcase',
      pipeline: [],
      pipelineTextMr: '',
      pipelineTextHi: '',
      toolsUsed: [],
      outcomeMr: '',
      outcomeHi: '',
      sampleInput: '',
      samplePrompt: '',
    });
    setIsAddChallengeOpen(false);
  };

  const handleUpdateChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;

    const updatedChallenges = (data.challenges || []).map((c) =>
      c.id === editingChallenge.id ? editingChallenge : c
    );
    handleSaveData({ ...data, challenges: updatedChallenges }, `प्रोजेक्ट चॅलेंज अपडेट झाले! ✅`);
    setEditingChallenge(null);
  };

  const handleDeleteChallenge = (id: string, roleName: string) => {
    if (confirm(`चॅलेंज "${roleName}" खरोखर हटवायचे आहे का?`)) {
      const updatedChallenges = (data.challenges || []).filter((c) => c.id !== id);
      handleSaveData({ ...data, challenges: updatedChallenges }, `चॅलेंज हटवले गेले! 🗑️`);
    }
  };

  // -------------------------------------------------------------
  // BATCH OPERATIONS (CRUD)
  // -------------------------------------------------------------
  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatch.title?.trim()) return;

    const batchItem: AICourseBatchItem = {
      id: 'batch-' + Date.now(),
      title: newBatch.title.trim(),
      date: newBatch.date?.trim() || 'येणारा रविवार',
      time: newBatch.time?.trim() || 'सकाळी १०:०० ते संध्याकाळी ५:००',
      mode: newBatch.mode?.trim() || 'Pune Offline + Zoom Live Online',
      seatsTotal: Number(newBatch.seatsTotal) || 15,
      seatsBooked: Number(newBatch.seatsBooked) || 0,
      status: (newBatch.status as any) || 'Open',
    };

    const updatedBatches = [...(data.batches || []), batchItem];
    handleSaveData({ ...data, batches: updatedBatches }, `नवीन बॅच जोडली गेली! 📅`);

    setNewBatch({
      title: '',
      date: '',
      time: 'सकाळी १०:०० ते संध्याकाळी ५:००',
      mode: 'Pune Offline + Zoom Live Online',
      seatsTotal: 15,
      seatsBooked: 0,
      status: 'Open',
    });
    setIsAddBatchOpen(false);
  };

  const handleUpdateBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    const updatedBatches = (data.batches || []).map((b) => (b.id === editingBatch.id ? editingBatch : b));
    handleSaveData({ ...data, batches: updatedBatches }, `बॅच अपडेट झाली! ✅`);
    setEditingBatch(null);
  };

  const handleDeleteBatch = (id: string, title: string) => {
    if (confirm(`बॅच "${title}" खरोखर हटवायची आहे का?`)) {
      const updatedBatches = (data.batches || []).filter((b) => b.id !== id);
      handleSaveData({ ...data, batches: updatedBatches }, `बॅच हटवली गेली! 🗑️`);
    }
  };

  // -------------------------------------------------------------
  // CONFIG / SETTINGS
  // -------------------------------------------------------------
  const handleConfigChange = (key: keyof AICourseConfig, value: any) => {
    setData((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  const handleSaveConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveData(data, 'कोर्स मुख्य सेटिंग्ज व फी अपडेट झाली! 💰');
  };

  // -------------------------------------------------------------
  // WPCODE COPY HELPER
  // -------------------------------------------------------------
  const handleCopyWPCode = async () => {
    try {
      setLoadingSnippet(true);
      let code = wpCodeSnippet;
      if (!code) {
        const res = await fetch('/api/download-ai-plugin?format=raw');
        const json = await res.json();
        if (json && json.code) {
          code = json.code;
          setWpCodeSnippet(code);
        }
      }

      if (code) {
        await navigator.clipboard.writeText(code);
        setCopiedCode(true);
        showToast('WPCode साठी पूर्ण PHP कोड क्लिपबोर्डवर कॉपी झाला! 📋');
        setTimeout(() => setCopiedCode(false), 3500);
      } else {
        showToast('कोड लोड करताना अडचण आली. कृपया थेट डाऊनलोड बटण वापरा.');
      }
    } catch {
      showToast('कोड कॉपी करताना त्रुटी आली. डाऊनलोड बटण वापरा.');
    } finally {
      setLoadingSnippet(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
        <span className="text-sm font-medium">AI कोर्स डेटा लोड होत आहे...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Fast Live Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-serif text-[#3B1F25]">
              १ डे AI कार्यशाळा (AI Course CMS)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              Add / Edit / Delete Enabled
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            १०-१२ Core Tools, ५ Pillars, Real-Life Projects, Batches आणि WPCode प्लगइन सहजपणे मॅनेज करा.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
            title="सर्व मूळ डेटा पूर्ववत करा"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>मूळ डेटा (Reset)</span>
          </button>

          <Link
            href="/ai-course"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <span>Live पेज उघडा</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 no-scrollbar text-xs">
        <button
          onClick={() => setActiveSubTab('tools')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'tools'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Core Tools ({data.tools?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pillars')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'pillars'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>५ Pillars ({data.pillars?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('challenges')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'challenges'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Real-Life Projects ({data.challenges?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('batches')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'batches'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>बॅचेस & तारखा ({data.batches?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'settings'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>कोर्स फी & सेटिंग्ज</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wpcode')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'wpcode'
              ? 'bg-[#1E1E2E] text-amber-400 shadow-xs ring-1 ring-amber-400/40'
              : 'text-stone-700 bg-amber-50/80 hover:bg-amber-100'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-amber-500" />
          <span>WPCode / WordPress Plugin</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* 1. CORE TOOLS MANAGER TAB */}
      {/* ============================================================= */}
      {activeSubTab === 'tools' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="टूलचे नाव किंवा उपयोग शोधा..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={toolCatFilter}
                onChange={(e) => setToolCatFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-stone-50 border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">सर्व वर्ग (All Categories)</option>
                <option value="all">👥 General Assistants</option>
                <option value="pro">💼 Professional & Office</option>
                <option value="research">📚 Research & Documents</option>
                <option value="creative">🎨 Design, Video & Presentations</option>
                <option value="automation">⚡ Automation & AI Workflows</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddToolOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन टूल जोडा (Add Tool)</span>
            </button>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTools.map((tool, idx) => (
              <div
                key={tool.id || idx}
                className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-amber-400 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        टूल #{tool.order || idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900">{tool.name}</h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        tool.badgeColor || 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {tool.badgeText}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 my-2.5">
                    <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                      <span className="text-[10px] font-semibold text-stone-400 block mb-0.5">
                        मुख्य उपयोग (Primary Use):
                      </span>
                      <p className="font-medium text-stone-800 leading-relaxed text-[11px]">
                        {tool.primaryUseMr}
                      </p>
                    </div>

                    <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                      <span className="text-[10px] font-semibold text-stone-400 block mb-0.5">
                        कोणासाठी (Audience):
                      </span>
                      <p className="font-medium text-amber-900 text-[11px]">{tool.audienceMr}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                  {tool.websiteUrl ? (
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>वेबसाइट</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-400">वेबसाइट URL नाही</span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingTool(tool)}
                      className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-amber-700 transition-colors cursor-pointer"
                      title="माहिती बदला (Edit)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTool(tool.id, tool.name)}
                      className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      title="हटवा (Delete)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center text-stone-500">
              <Wrench className="w-8 h-8 mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-semibold">कोणतेही टूल सापडले नाही</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                शोध शब्द बदला किंवा वरील बटणावरून नवीन टूल जोडा.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* 2. PILLARS MANAGER TAB */}
      {/* ============================================================= */}
      {activeSubTab === 'pillars' && (
        <div className="space-y-4">
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 flex items-start gap-3">
            <BrainCircuit className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900/90 leading-relaxed">
              <strong>५ मुख्य Pillars (अभ्यासक्रम रचना):</strong> ४०-५० टूल्समध्ये विद्यार्थी भरकटू नयेत म्हणून
              अभ्यासक्रम या ५ पायऱ्यांमध्ये विभागला आहे. तुम्ही खालील कोणत्याही पिलरचे शीर्षक, हेडलाईन व चेकपॉईंट्स
              बदलू शकता.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.pillars || []).map((pillar, idx) => (
              <div
                key={pillar.id || idx}
                className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-amber-400 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                        {pillar.number || idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-[#3B1F25]">{pillar.nameEn}</h4>
                    </div>
                    <button
                      onClick={() => setEditingPillar(pillar)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>संपादित करा (Edit)</span>
                    </button>
                  </div>

                  <h5 className="font-bold text-xs text-stone-900 mb-1">{pillar.titleMr}</h5>
                  <p className="text-xs text-amber-800 font-medium mb-2">{pillar.headlineMr}</p>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">{pillar.descMr}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
                    {pillar.steps?.map((st, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{st.labelMr}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. REAL-LIFE PROJECTS & CHALLENGES TAB */}
      {/* ============================================================= */}
      {activeSubTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
            <div>
              <h4 className="font-bold text-sm text-[#3B1F25]">क्षेत्रनिहाय Real-Life Projects & Prompts</h4>
              <p className="text-xs text-gray-500">
                शिक्षक, दुकानदार, गृहिणी, शासकीय कर्मचारी, फ्रीलान्सर इत्यादींसाठीचे थेट कामाचे Workflows व
                प्रॉम्प्ट्स.
              </p>
            </div>

            <button
              onClick={() => setIsAddChallengeOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन क्षेत्र/चॅलेंज जोडा</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.challenges || []).map((ch, idx) => (
              <div
                key={ch.id || idx}
                className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-amber-400 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Target className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-[#3B1F25]">{ch.roleMr}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingChallenge(ch)}
                        className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-amber-700 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteChallenge(ch.id, ch.roleMr)}
                        className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-900 block mb-0.5">
                        स्टेप बाय स्टेप वर्कफ्लो:
                      </span>
                      <p className="text-[11px] text-stone-700 font-medium">{ch.pipelineTextMr}</p>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <span className="text-[10px] font-bold text-stone-500 block mb-0.5">
                        वापरलेली AI टूल्स:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ch.toolsUsed?.map((toolName, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] font-bold text-stone-700"
                          >
                            {toolName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-900 block mb-0.5">
                        थेट फायदा (Outcome):
                      </span>
                      <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                        {ch.outcomeMr}
                      </p>
                    </div>

                    {ch.samplePrompt && (
                      <div className="bg-stone-900 text-stone-200 p-2.5 rounded-xl text-[11px] font-mono leading-relaxed relative group">
                        <div className="flex items-center justify-between text-[10px] text-amber-400 mb-1">
                          <span>नमुना प्रॉम्प्ट (Sample Prompt):</span>
                        </div>
                        <p className="line-clamp-3 text-stone-300">{ch.samplePrompt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. BATCHES & DATES TAB */}
      {/* ============================================================= */}
      {activeSubTab === 'batches' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
            <div>
              <h4 className="font-bold text-sm text-[#3B1F25]">आगामी AI बॅचेस & सीट्स नियोजन</h4>
              <p className="text-xs text-gray-500">
                नवीन तारखा जोडा, जागांचे प्रमाण आणि बॅच स्टेटस (Open, Filling Fast, Sold Out) नियंत्रित करा.
              </p>
            </div>

            <button
              onClick={() => setIsAddBatchOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन बॅच जोडा</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.batches || []).map((batch, idx) => (
              <div
                key={batch.id || idx}
                className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-amber-400 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2 pb-2 mb-3 border-b border-gray-100">
                  <div>
                    <h4 className="font-bold text-sm text-[#3B1F25]">{batch.title}</h4>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        batch.status === 'Open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : batch.status === 'Filling Fast'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingBatch(batch)}
                      className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 hover:text-amber-700 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(batch.id, batch.title)}
                      className="p-1.5 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-medium text-stone-800">{batch.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{batch.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{batch.mode}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      एकूण जागा: <strong>{batch.seatsTotal}</strong> | बुक झालेल्या: <strong>{batch.seatsBooked}</strong> (शिल्लक: {batch.seatsTotal - batch.seatsBooked})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. COURSE SETTINGS & FEES TAB */}
      {/* ============================================================= */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveConfigSubmit} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3 mb-2">
            <h4 className="font-bold text-sm text-[#3B1F25]">कोर्स मुख्य तपशील व फी सेटिंग्ज</h4>
            <p className="text-xs text-gray-500">
              वेबसाइटवरील AI कोर्स हेडिंग, फी, व्हॉट्सॲप नंबर व पत्ता थेट येथून बदला.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                कोर्सचे मुख्य शीर्षक (Course Title)
              </label>
              <input
                type="text"
                value={data.config?.courseTitle || ''}
                onChange={(e) => handleConfigChange('courseTitle', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                उल्लेखनीय सबटायटल (Course Subtitle)
              </label>
              <input
                type="text"
                value={data.config?.courseSubtitle || ''}
                onChange={(e) => handleConfigChange('courseSubtitle', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                प्रशिक्षक नाव (Trainer Name)
              </label>
              <input
                type="text"
                value={data.config?.trainer || ''}
                onChange={(e) => handleConfigChange('trainer', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                प्रमाणपत्र सुविधा (Certificate)
              </label>
              <input
                type="text"
                value={data.config?.certificateIncluded || 'होय (अधिकृत ई-प्रमाणपत्र)'}
                onChange={(e) => handleConfigChange('certificateIncluded', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                कोर्स फी (₹ Fees)
              </label>
              <input
                type="number"
                value={data.config?.fees || 1499}
                onChange={(e) => handleConfigChange('fees', Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                आगाऊ नावनोंदणी फी (₹ Advance Fee)
              </label>
              <input
                type="number"
                value={data.config?.advanceFee || 499}
                onChange={(e) => handleConfigChange('advanceFee', Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-amber-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                WhatsApp नंबर (नोंदणीसाठी)
              </label>
              <input
                type="text"
                value={data.config?.whatsapp || '8446917187'}
                onChange={(e) => handleConfigChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                मोड (Offline / Online)
              </label>
              <input
                type="text"
                value={data.config?.mode || 'Pune Offline + Zoom Live Online'}
                onChange={(e) => handleConfigChange('mode', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                पुणे पत्ता (Pune Offline Venue)
              </label>
              <input
                type="text"
                value={data.config?.venueFull || ''}
                onChange={(e) => handleConfigChange('venueFull', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                कोर्स वर्णन (Short Description)
              </label>
              <textarea
                rows={2}
                value={data.config?.description || ''}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-stone-900 hover:bg-black text-amber-400 font-bold text-xs shadow-sm cursor-pointer transition-colors"
            >
              सेटिंग्ज सेव्ह करा (Save Settings)
            </button>
          </div>
        </form>
      )}

      {/* ============================================================= */}
      {/* 6. WPCODE & WORDPRESS PLUGIN TAB */}
      {/* ============================================================= */}
      {activeSubTab === 'wpcode' && (
        <div className="space-y-6">
          {/* Action Header Card */}
          <div className="bg-[#1E1E2E] text-white rounded-3xl p-6 border border-stone-800 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-400 font-mono text-xs font-bold border border-amber-400/30">
                    ai-course-cms.php
                  </span>
                  <span className="text-xs text-stone-400">v2.0.0 (WPCode & Plugin Compatible)</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-100">
                  WordPress डॅशबोर्ड व WPCode द्वारे AI कोर्स व्यवस्थापन (CRUD)
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                  हे कोड स्निपेट WPCode प्लगइनमध्ये पेस्ट करा किंवा वर्डप्रेसमध्ये प्लगइन म्हणून अपलोड करा. वर्डप्रेसच्या
                  ॲडमिन पॅनेलमधून ५ Pillars, १०-१२ Core Tools, Real-Life Projects, Batches आणि Leads सहजपणे Add, Update,
                  Edit, Delete करता येतील.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={handleCopyWPCode}
                  disabled={loadingSnippet}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'कोड कॉपी झाला! ✅' : 'WPCode स्निपेट कॉपी करा'}</span>
                </button>

                <a
                  href="/api/download-ai-plugin"
                  download="ai-course-cms.php"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>प्लगीन डाउनलोड (.php)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Step by Step WPCode Guide */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-[#3B1F25] flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-600" />
              <span>WordPress WPCode मध्ये कसे वापरावे? (३ सोप्या पायऱ्या)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center">
                  १
                </div>
                <h5 className="font-bold text-stone-900">WPCode मध्ये New Snippet उघडा</h5>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  WordPress डॅशबोर्ड -&gt; <strong>Code Snippets</strong> -&gt; <strong>+ Add Snippet</strong> -&gt;{' '}
                  <strong>Add Your Custom Code (New Snippet)</strong> वर क्लिक करा.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center">
                  २
                </div>
                <h5 className="font-bold text-stone-900">PHP Snippet निवडा आणि पेस्ट करा</h5>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  Code Type मध्ये <strong>PHP Snippet</strong> निवडा. वरील बटनाने कॉपी केलेला संपूर्ण कोड बॉक्समध्ये पेस्ट
                  करा. Insertion मध्ये <strong>Auto Insert / Run Everywhere</strong> ठेवा.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center">
                  ३
                </div>
                <h5 className="font-bold text-stone-900">सक्रिय (Active) करा आणि सेव्ह करा</h5>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  वर उजव्या बाजूला <strong>Inactive</strong> ला <strong>Active</strong> करा व <strong>Save Snippet</strong> दाबा.
                  लगेचच डाव्या मेनूमध्ये <strong>🤖 AI Course CMS</strong> मेनू दिसेल!
                </p>
              </div>
            </div>

            {/* 1-Click Content Setup Highlight */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>एका क्लिकमध्ये सर्व १२ टूल्स व ५ पिलर्स सेट करा!</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                WordPress मेनूमध्ये <strong>AI Course CMS -&gt; Settings</strong> मध्ये जाऊन फक्त{' '}
                <strong>&ldquo;1-Click Content Setup&rdquo;</strong> बटण दाबा. आपोआप सर्व १२ Core Tools, ५ Pillars आणि Real-Life
                Challenges पोस्ट टाईप्स तयार होतात. त्यानंतर तुम्ही वर्डप्रेसच्या परिचयाच्या इंटरफेसवरून हवे ते टूल Edit,
                Update किंवा Delete करू शकता!
              </p>
            </div>
          </div>

          {/* WordPress REST API Endpoints Preview */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-[#3B1F25] flex items-center gap-2">
              <Workflow className="w-4 h-4 text-sky-600" />
              <span>WordPress Headless REST API Endpoints (Next.js Frontend शी जोडणी)</span>
            </h4>
            <p className="text-xs text-gray-500">
              प्लगीन खालील REST API आपोआप उपलब्ध करते, ज्याद्वारे हे Next.js फ्रंट-एंड वर्डप्रेसशी थेट जोडता येते:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">GET</span>
                <span className="text-stone-800">/wp-json/ai-course/v1/all-data</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">GET</span>
                <span className="text-stone-800">/wp-json/ai-course/v1/tools</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">GET</span>
                <span className="text-stone-800">/wp-json/ai-course/v1/pillars</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">GET</span>
                <span className="text-stone-800">/wp-json/ai-course/v1/challenges</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">GET</span>
                <span className="text-stone-800">/wp-json/ai-course/v1/batches</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-sky-700 font-bold">POST</span>
                <span className="text-stone-800">/wp-json/ai-course/v1/inquiry</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD TOOL */}
      {/* ============================================================= */}
      {isAddToolOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">नवीन AI टूल जोडा (Add New Tool)</h4>
              <button
                onClick={() => setIsAddToolOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddToolSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">टूलचे नाव (Name)*</label>
                <input
                  type="text"
                  value={newTool.name || ''}
                  onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                  placeholder="उदा. Claude 3.5, Midjourney, v0"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">वर्ग (Category)</label>
                  <select
                    value={newTool.category || 'all'}
                    onChange={(e) => setNewTool({ ...newTool, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="all">👥 General All-Round</option>
                    <option value="pro">💼 Professional / Office</option>
                    <option value="research">📚 Research & Documents</option>
                    <option value="creative">🎨 Design, Video & Presentation</option>
                    <option value="automation">⚡ Automation & Workflows</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">बॅज टॅग (Badge Text)</label>
                  <input
                    type="text"
                    value={newTool.badgeText || ''}
                    onChange={(e) => setNewTool({ ...newTool, badgeText: e.target.value })}
                    placeholder="उदा. Fast AI, Deep Search"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  मुख्य उपयोग - मराठी (Primary Use)*
                </label>
                <textarea
                  rows={2}
                  value={newTool.primaryUseMr || ''}
                  onChange={(e) => setNewTool({ ...newTool, primaryUseMr: e.target.value })}
                  placeholder="या टूलचा मुख्य उपयोग मराठीत लिहा..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  कोणासाठी उपयुक्त (Target Audience)
                </label>
                <input
                  type="text"
                  value={newTool.audienceMr || ''}
                  onChange={(e) => setNewTool({ ...newTool, audienceMr: e.target.value })}
                  placeholder="उदा. 👥 सर्व, व्यावसायिक, शिक्षक"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  वेबसाइट लिंक (Official Website URL)
                </label>
                <input
                  type="url"
                  value={newTool.websiteUrl || ''}
                  onChange={(e) => setNewTool({ ...newTool, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddToolOpen(false)}
                  className="py-2 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm cursor-pointer"
                >
                  टूल जोडा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: EDIT TOOL */}
      {/* ============================================================= */}
      {editingTool && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">टूल माहिती बदला: {editingTool.name}</h4>
              <button
                onClick={() => setEditingTool(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateToolSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">टूलचे नाव</label>
                <input
                  type="text"
                  value={editingTool.name}
                  onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">वर्ग (Category)</label>
                  <select
                    value={editingTool.category}
                    onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="all">👥 General All-Round</option>
                    <option value="pro">💼 Professional / Office</option>
                    <option value="research">📚 Research & Documents</option>
                    <option value="creative">🎨 Design, Video & Presentation</option>
                    <option value="automation">⚡ Automation & Workflows</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">बॅज टॅग</label>
                  <input
                    type="text"
                    value={editingTool.badgeText}
                    onChange={(e) => setEditingTool({ ...editingTool, badgeText: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">मुख्य उपयोग (मराठी)</label>
                <textarea
                  rows={2}
                  value={editingTool.primaryUseMr}
                  onChange={(e) => setEditingTool({ ...editingTool, primaryUseMr: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">कोणासाठी उपयुक्त</label>
                <input
                  type="text"
                  value={editingTool.audienceMr}
                  onChange={(e) => setEditingTool({ ...editingTool, audienceMr: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">वेबसाइट URL</label>
                <input
                  type="url"
                  value={editingTool.websiteUrl || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="py-2 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm cursor-pointer"
                >
                  बदल सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: EDIT PILLAR */}
      {/* ============================================================= */}
      {editingPillar && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">
                पिलर संपादित करा: {editingPillar.nameEn}
              </h4>
              <button
                onClick={() => setEditingPillar(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePillarSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">मराठी शीर्षक (Title)</label>
                <input
                  type="text"
                  value={editingPillar.titleMr}
                  onChange={(e) => setEditingPillar({ ...editingPillar, titleMr: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">हेडलाईन (Headline)</label>
                <input
                  type="text"
                  value={editingPillar.headlineMr}
                  onChange={(e) => setEditingPillar({ ...editingPillar, headlineMr: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">वर्णन (Description)</label>
                <textarea
                  rows={3}
                  value={editingPillar.descMr}
                  onChange={(e) => setEditingPillar({ ...editingPillar, descMr: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  चेकपॉईंट स्टेप्स (स्वल्पविरामाने वेगळे करा)
                </label>
                <input
                  type="text"
                  value={editingPillar.steps?.map((s) => s.labelMr).join(', ') || ''}
                  onChange={(e) => {
                    const parts = e.target.value.split(',').map((p) => p.trim());
                    setEditingPillar({
                      ...editingPillar,
                      steps: parts.map((label) => ({ labelMr: label, labelHi: label })),
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPillar(null)}
                  className="py-2 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm cursor-pointer"
                >
                  बदल सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT CHALLENGE */}
      {/* ============================================================= */}
      {(isAddChallengeOpen || editingChallenge) && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">
                {isAddChallengeOpen ? 'नवीन प्रोजेक्ट चॅलेंज जोडा' : `चॅलेंज संपादित करा: ${editingChallenge?.roleMr}`}
              </h4>
              <button
                onClick={() => {
                  setIsAddChallengeOpen(false);
                  setEditingChallenge(null);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAddChallengeOpen ? handleAddChallengeSubmit : handleUpdateChallengeSubmit}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  क्षेत्र / व्यक्तीचे पद (Role Name)*
                </label>
                <input
                  type="text"
                  value={isAddChallengeOpen ? newChallenge.roleMr : editingChallenge?.roleMr}
                  onChange={(e) => {
                    if (isAddChallengeOpen) setNewChallenge({ ...newChallenge, roleMr: e.target.value });
                    else if (editingChallenge) setEditingChallenge({ ...editingChallenge, roleMr: e.target.value });
                  }}
                  placeholder="उदा. पत्रकार, वकील, डॉक्टर, दुकानदार"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  वर्कफ्लो स्टेप्स (Workflow Pipeline)*
                </label>
                <input
                  type="text"
                  value={isAddChallengeOpen ? newChallenge.pipelineTextMr : editingChallenge?.pipelineTextMr}
                  onChange={(e) => {
                    if (isAddChallengeOpen) setNewChallenge({ ...newChallenge, pipelineTextMr: e.target.value });
                    else if (editingChallenge) setEditingChallenge({ ...editingChallenge, pipelineTextMr: e.target.value });
                  }}
                  placeholder="विषय → संशोधन → ड्राफ्ट → फायनल"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  वापरलेली टूल्स (स्वल्पविरामाने वेगळे करा)
                </label>
                <input
                  type="text"
                  value={
                    isAddChallengeOpen
                      ? (newChallenge.toolsUsed || []).join(', ')
                      : (editingChallenge?.toolsUsed || []).join(', ')
                  }
                  onChange={(e) => {
                    const tools = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                    if (isAddChallengeOpen) setNewChallenge({ ...newChallenge, toolsUsed: tools });
                    else if (editingChallenge) setEditingChallenge({ ...editingChallenge, toolsUsed: tools });
                  }}
                  placeholder="ChatGPT, Perplexity, Canva AI"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  थेट फायदा (Practical Outcome)
                </label>
                <textarea
                  rows={2}
                  value={isAddChallengeOpen ? newChallenge.outcomeMr : editingChallenge?.outcomeMr}
                  onChange={(e) => {
                    if (isAddChallengeOpen) setNewChallenge({ ...newChallenge, outcomeMr: e.target.value });
                    else if (editingChallenge) setEditingChallenge({ ...editingChallenge, outcomeMr: e.target.value });
                  }}
                  placeholder="या प्रोजेक्टमुळे वेळेची किती बचत होते व काय साध्य होते..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  नमुना प्रॉम्प्ट (Sample Prompt)
                </label>
                <textarea
                  rows={3}
                  value={isAddChallengeOpen ? newChallenge.samplePrompt : editingChallenge?.samplePrompt}
                  onChange={(e) => {
                    if (isAddChallengeOpen) setNewChallenge({ ...newChallenge, samplePrompt: e.target.value });
                    else if (editingChallenge) setEditingChallenge({ ...editingChallenge, samplePrompt: e.target.value });
                  }}
                  placeholder="AI ला द्यायचा प्रत्यक्ष मराठी प्रॉम्प्ट येथे टाका..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddChallengeOpen(false);
                    setEditingChallenge(null);
                  }}
                  className="py-2 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm cursor-pointer"
                >
                  सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT BATCH */}
      {/* ============================================================= */}
      {(isAddBatchOpen || editingBatch) && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">
                {isAddBatchOpen ? 'नवीन बॅच जोडा' : `बॅच संपादित करा`}
              </h4>
              <button
                onClick={() => {
                  setIsAddBatchOpen(false);
                  setEditingBatch(null);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isAddBatchOpen ? handleAddBatchSubmit : handleUpdateBatchSubmit}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">बॅच नाव / शीर्षक*</label>
                <input
                  type="text"
                  value={isAddBatchOpen ? newBatch.title : editingBatch?.title}
                  onChange={(e) => {
                    if (isAddBatchOpen) setNewBatch({ ...newBatch, title: e.target.value });
                    else if (editingBatch) setEditingBatch({ ...editingBatch, title: e.target.value });
                  }}
                  placeholder="उदा. बॅच ३: पुणे ऑफलाइन + Zoom Live"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">तारीख (Date)</label>
                <input
                  type="text"
                  value={isAddBatchOpen ? newBatch.date : editingBatch?.date}
                  onChange={(e) => {
                    if (isAddBatchOpen) setNewBatch({ ...newBatch, date: e.target.value });
                    else if (editingBatch) setEditingBatch({ ...editingBatch, date: e.target.value });
                  }}
                  placeholder="उदा. आगामी रविवार / १५ मे २०२६"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">वेळ (Timing)</label>
                <input
                  type="text"
                  value={isAddBatchOpen ? newBatch.time : editingBatch?.time}
                  onChange={(e) => {
                    if (isAddBatchOpen) setNewBatch({ ...newBatch, time: e.target.value });
                    else if (editingBatch) setEditingBatch({ ...editingBatch, time: e.target.value });
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">एकूण जागा</label>
                  <input
                    type="number"
                    value={isAddBatchOpen ? newBatch.seatsTotal : editingBatch?.seatsTotal}
                    onChange={(e) => {
                      if (isAddBatchOpen) setNewBatch({ ...newBatch, seatsTotal: Number(e.target.value) });
                      else if (editingBatch) setEditingBatch({ ...editingBatch, seatsTotal: Number(e.target.value) });
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">बुक झालेल्या जागा</label>
                  <input
                    type="number"
                    value={isAddBatchOpen ? newBatch.seatsBooked : editingBatch?.seatsBooked}
                    onChange={(e) => {
                      if (isAddBatchOpen) setNewBatch({ ...newBatch, seatsBooked: Number(e.target.value) });
                      else if (editingBatch) setEditingBatch({ ...editingBatch, seatsBooked: Number(e.target.value) });
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">स्थिती (Status)</label>
                <select
                  value={isAddBatchOpen ? newBatch.status : editingBatch?.status}
                  onChange={(e) => {
                    if (isAddBatchOpen) setNewBatch({ ...newBatch, status: e.target.value as any });
                    else if (editingBatch) setEditingBatch({ ...editingBatch, status: e.target.value as any });
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Open">Open (नावनोंदणी सुरू)</option>
                  <option value="Filling Fast">Filling Fast (काही जागा शिल्लक)</option>
                  <option value="Sold Out">Sold Out (जागा भरल्या)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddBatchOpen(false);
                    setEditingBatch(null);
                  }}
                  className="py-2 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm cursor-pointer"
                >
                  सेव्ह करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
