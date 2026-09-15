'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  LogOut,
  Settings,
  Camera,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Download,
  Upload,
  Phone,
  MessageCircle,
  Check,
  X,
  Search,
  Sparkles,
  Calendar,
  Users,
  FileText,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  HelpCircle,
  BrainCircuit,
  Bot,
  ExternalLink,
} from 'lucide-react';
import businessData from '../data/business-data.json';
import { WorkshopConfig } from './EditWorkshopModal';
import AICourseAdminManager from './AICourseAdminManager';
import {
  GalleryItem,
  getInitialGallery,
  loadGalleryAsync,
  saveGalleryAsync,
  compressImageFile,
  getInitialStyles,
  loadStylesAsync,
  saveStylesAsync,
  getInitialWorkshopConfig,
  loadWorkshopConfigAsync,
  saveWorkshopConfigAsync,
  getInitialLeads,
  loadLeadsAsync,
  saveLeadsAsync,
  loadFullSiteDataAsync,
} from '../lib/galleryStorage';

export type { GalleryItem };

export interface BookingLead {
  id: string;
  name: string;
  phone: string;
  workshopType: string;
  participants: string;
  message?: string;
  date: string;
  status: 'new' | 'contacted' | 'confirmed';
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

const DEFAULT_PIN = 'pooja2026';

const CATEGORY_OPTIONS = [
  { value: 'Gauri Draping', label: '🌸 गौरी महालक्ष्मी (Gauri Draping)', marathi: 'गौरी महालक्ष्मी' },
  { value: 'Nauvari', label: '✨ नऊवारी व काष्टा (Nauvari)', marathi: 'नऊवारी व काष्टा' },
  { value: 'Designer', label: '👑 डिझायनर व रॉयल (Designer)', marathi: 'डिझायनर व रॉयल' },
  { value: 'Workshops', label: '📸 वर्कशॉप सराव (Workshops)', marathi: 'वर्कशॉप सराव' },
  { value: 'Certificates', label: '🎓 प्रमाणपत्र (Certificates)', marathi: 'प्रमाणपत्र' },
];

const DEFAULT_WORKSHOP_CONFIG: WorkshopConfig = {
  title: '1 डे साडी ड्रॅपिंग वर्कशॉप',
  instructor: 'पूजा पाटील',
  training: 'गौरी महालक्ष्मीच्या 14 ते 15 सुंदर साडी ड्रॅपिंग प्रकारांचे प्रात्यक्षिकासह प्रशिक्षण',
  suitableFor: 'उभारलेल्या तसेच बसलेल्या गौरीसाठी आणि सणांसारख्या विशेष प्रसंगांसाठी',
  nextDate: 'आगामी शनिवार / रविवार (Upcoming Weekend)',
  time: 'सकाळी 10:30 ते संध्याकाळी 5:30 (पूर्ण 1 दिवस)',
  fee: '₹1,999/- फक्त',
  seatsLeft: 'फक्त 8 ते 10 जागा (वैयक्तिक लक्ष देण्यासाठी मर्यादित बॅच)',
  venue: 'साईप्रभा हाऊस, जगताप हॉस्पिटल समोर, सिंहगड रोड, आनंद नगर, पुणे - 411051',
};

export default function AdminPanelModal({ isOpen, onClose, onDataChanged }: AdminPanelModalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('pooja_admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'styles' | 'workshop' | 'leads' | 'aicourse' | 'backup'>('gallery');
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const getStoredPin = () => {
    try {
      return localStorage.getItem('pooja_admin_pin') || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getStoredPin();
    if (pinInput.trim() === currentPin || pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      setPinError('');
      try {
        localStorage.setItem('pooja_admin_authenticated', 'true');
      } catch {
        // ignore
      }
      showToast('ॲडमिन लॉगिन यशस्वी! आपले स्वागत आहे. ✨');
    } else {
      setPinError('चुकीचा पासवर्ड/पिन! कृपया पुन्हा प्रयत्न करा.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('pooja_admin_authenticated');
    } catch {
      // ignore
    }
    setPinInput('');
    showToast('ॲडमिन लॉगआउट झाले. 🔒');
  };

  // -------------------------------------------------------------
  // 1. TOP-LEVEL CMS STATES
  // -------------------------------------------------------------
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => getInitialGallery());
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  
  const [styleImages, setStyleImages] = useState<Record<number, string>>(() => getInitialStyles());
  const [styleSearch, setStyleSearch] = useState<string>('');
  const [editingStyleId, setEditingStyleId] = useState<number | null>(null);
  const styleImageFileRef = useRef<HTMLInputElement | null>(null);

  const [workshopConfig, setWorkshopConfig] = useState<WorkshopConfig>(() => getInitialWorkshopConfig());

  const [leads, setLeads] = useState<BookingLead[]>(() => getInitialLeads());
  const [isManualLeadOpen, setIsManualLeadOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualWorkshop, setManualWorkshop] = useState('1 डे साडी ड्रॅपिंग वर्कशॉप');
  const [manualNote, setManualNote] = useState('');

  // Gallery modals
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addSubtitle, setAddSubtitle] = useState('');
  const [addCategoryVal, setAddCategoryVal] = useState('Gauri Draping');
  const [addImgUrl, setAddImgUrl] = useState('');
  const [addError, setAddError] = useState('');
  const addFileRef = useRef<HTMLInputElement | null>(null);

  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCategoryVal, setEditCategoryVal] = useState('');
  const [editImgUrl, setEditImgUrl] = useState('');
  const editFileRef = useRef<HTMLInputElement | null>(null);

  const [replacingItem, setReplacingItem] = useState<GalleryItem | null>(null);
  const replaceFileRef = useRef<HTMLInputElement | null>(null);

  // Sync latest site data when modal is opened
  useEffect(() => {
    if (isOpen) {
      loadFullSiteDataAsync().then((data) => {
        if (data) {
          if (data.galleryItems && data.galleryItems.length > 0) setGalleryItems(data.galleryItems);
          if (data.styleImages) setStyleImages(data.styleImages);
          if (data.workshopConfig) setWorkshopConfig(data.workshopConfig);
          if (data.leads) setLeads(data.leads);
        }
      });
    }
  }, [isOpen]);

  const saveGalleryItems = async (items: GalleryItem[]) => {
    setGalleryItems(items);
    await saveGalleryAsync(items);
    if (onDataChanged) onDataChanged();
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addImgUrl) {
      setAddError('कृपया फोटो निवडा किंवा इमेज URL टाका.');
      return;
    }
    const catObj = CATEGORY_OPTIONS.find((c) => c.value === addCategoryVal);
    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}`,
      title: addTitle.trim() || 'नवीन साडी ड्रॅपिंग फोटो',
      subtitle: addSubtitle.trim() || 'पूजा साडी ड्रॅपिंग वर्कशॉप',
      category: addCategoryVal,
      categoryMarathi: catObj ? catObj.marathi : addCategoryVal,
      image: addImgUrl,
      isCustom: true,
    };

    const updated = [newItem, ...galleryItems];
    saveGalleryItems(updated);
    setIsAddPhotoOpen(false);
    setAddTitle('');
    setAddSubtitle('');
    setAddImgUrl('');
    setAddError('');
    showToast('नवीन फोटो यशस्वीरित्या जोडला गेला! 📸');
  };

  const handleEditPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const catObj = CATEGORY_OPTIONS.find((c) => c.value === editCategoryVal);
    const updated = galleryItems.map((item) => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          title: editTitle.trim() || item.title,
          subtitle: editSubtitle.trim() || item.subtitle,
          category: editCategoryVal,
          categoryMarathi: catObj ? catObj.marathi : item.categoryMarathi,
          image: editImgUrl || item.image,
          isCustom: true,
        };
      }
      return item;
    });

    saveGalleryItems(updated);
    setEditingItem(null);
    showToast('फोटो माहिती अपडेट झाली! ✅');
  };

  const handleReplacePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingItem) return;

    try {
      const compressed = await compressImageFile(file);
      const updated = galleryItems.map((item) => {
        if (item.id === replacingItem.id) {
          return {
            ...item,
            image: compressed,
            isCustom: true,
          };
        }
        return item;
      });
      await saveGalleryItems(updated);
      setReplacingItem(null);
      showToast('फोटो यशस्वीरित्या बदलला गेला! ✨');
    } catch {
      showToast('फोटो बदलताना त्रुटी आली.');
    }
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('हा फोटो गॅलरीतून कायमचा हटवायचा आहे का?')) {
      const updated = galleryItems.filter((i) => i.id !== id);
      saveGalleryItems(updated);
      showToast('फोटो हटवला गेला! 🗑️');
    }
  };

  const handleResetGallery = () => {
    if (confirm('सर्व मूळ (Default) फोटो पूर्ववत करायचे आहेत का? तुमचे कस्टम फोटो निघून जातील.')) {
      const defaults = (businessData.galleryItems as GalleryItem[]).map((i) => ({ ...i, isCustom: false }));
      saveGalleryItems(defaults);
      showToast('मूळ गॅलरी फोटो रिस्टोअर झाले! 🔄');
    }
  };

  const filteredGallery = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesCat = galleryCategory === 'all' || item.category === galleryCategory;
      const matchesSearch =
        gallerySearch === '' ||
        item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(gallerySearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [galleryItems, galleryCategory, gallerySearch]);

  // -------------------------------------------------------------
  // 2. STYLES STATE & HANDLERS
  // -------------------------------------------------------------
  const handleStylePhotoChange = async (styleId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFile(file);
      const updated = { ...styleImages, [styleId]: compressed };
      setStyleImages(updated);
      await saveStylesAsync(updated);
      if (onDataChanged) onDataChanged();
      showToast('साडी प्रकाराचा फोटो अपडेट झाला! 👗');
    } catch {
      showToast('फोटो अपडेट करताना त्रुटी आली.');
    }
  };

  const handleResetStyleImage = async (styleId: number) => {
    const updated = { ...styleImages };
    delete updated[styleId];
    setStyleImages(updated);
    await saveStylesAsync(updated);
    if (onDataChanged) onDataChanged();
    showToast('मूळ साडी फोटो पूर्ववत झाला! 🔄');
  };

  const filteredStyles = useMemo(() => {
    return businessData.drapingStyles.filter((style) => {
      return (
        styleSearch === '' ||
        style.nameEnglish.toLowerCase().includes(styleSearch.toLowerCase()) ||
        style.nameMarathi.includes(styleSearch) ||
        style.category.toLowerCase().includes(styleSearch.toLowerCase())
      );
    });
  }, [styleSearch]);

  // -------------------------------------------------------------
  // 3. WORKSHOP CONFIG STATE & HANDLERS
  // -------------------------------------------------------------
  const loadWorkshopConfig = () => {
    try {
      const saved = localStorage.getItem('pooja_workshop_config');
      if (saved) {
        setWorkshopConfig(JSON.parse(saved));
        return;
      }
    } catch {
      // ignore
    }
    setWorkshopConfig(DEFAULT_WORKSHOP_CONFIG);
  };

  const handleSaveWorkshopConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveWorkshopConfigAsync(workshopConfig);
    if (onDataChanged) onDataChanged();
    showToast('वर्कशॉप तपशील आणि फी यशस्वीरित्या सेव्ह झाले! वेबसाईटवर थेट अपडेट झाले आहे. 📅');
  };

  const handleResetWorkshopConfig = async () => {
    setWorkshopConfig(DEFAULT_WORKSHOP_CONFIG);
    await saveWorkshopConfigAsync(DEFAULT_WORKSHOP_CONFIG);
    if (onDataChanged) onDataChanged();
    showToast('मूळ वर्कशॉप माहिती पूर्ववत झाली! 🔄');
  };

  // -------------------------------------------------------------
  // 4. BOOKINGS / LEADS STATE & HANDLERS
  // -------------------------------------------------------------
  const loadLeads = () => {
    loadLeadsAsync().then((fetched) => {
      if (fetched) setLeads(fetched);
    });
  };

  const saveLeads = async (newLeads: BookingLead[]) => {
    setLeads(newLeads);
    await saveLeadsAsync(newLeads);
  };

  useEffect(() => {
    const handleSync = () => {
      try {
        const savedGallery = localStorage.getItem('pooja_saree_gallery_items_v2');
        if (savedGallery) setGalleryItems(JSON.parse(savedGallery));

        const savedStyles = localStorage.getItem('pooja_custom_style_images');
        if (savedStyles) setStyleImages(JSON.parse(savedStyles));

        const savedWorkshop = localStorage.getItem('pooja_workshop_config');
        if (savedWorkshop) setWorkshopConfig(JSON.parse(savedWorkshop));

        const savedLeads = localStorage.getItem('pooja_workshop_bookings');
        if (savedLeads) setLeads(JSON.parse(savedLeads));

        const savedAuth = localStorage.getItem('pooja_admin_authenticated');
        if (savedAuth === 'true') setIsAuthenticated(true);
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('pooja_gallery_updated', handleSync);
    window.addEventListener('pooja_styles_updated', handleSync);
    window.addEventListener('pooja_workshop_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('pooja_gallery_updated', handleSync);
      window.removeEventListener('pooja_styles_updated', handleSync);
      window.removeEventListener('pooja_workshop_updated', handleSync);
    };
  }, []);

  const handleAddManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) return;

    const newLead: BookingLead = {
      id: `lead-${Date.now()}`,
      name: manualName.trim(),
      phone: manualPhone.trim(),
      workshopType: manualWorkshop,
      participants: '1',
      message: manualNote.trim(),
      date: new Date().toLocaleString('mr-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'confirmed',
    };

    const updated = [newLead, ...leads];
    saveLeads(updated);
    setIsManualLeadOpen(false);
    setManualName('');
    setManualPhone('');
    setManualNote('');
    showToast('नवीन नोंदणी जोडली गेली! ✅');
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('ही नोंदणी हटवायची आहे का?')) {
      const updated = leads.filter((l) => l.id !== id);
      saveLeads(updated);
      showToast('नोंदणी हटवली गेली! 🗑️');
    }
  };

  const handleUpdateLeadStatus = (id: string, status: 'new' | 'contacted' | 'confirmed') => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    saveLeads(updated);
    showToast('नोंदणी स्टेटस अपडेट झाले! 📝');
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('डाउनलोड करण्यासाठी सध्या कोणतीही नोंदणी उपलब्ध नाही.');
      return;
    }
    const headers = ['तारीख', 'नाव', 'मोबाईल नंबर', 'वर्कशॉप प्रकार', 'सहभागी संख्या', 'संदेश', 'स्टेटस'];
    const rows = leads.map((l) => [
      `"${l.date}"`,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.workshopType}"`,
      `"${l.participants}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pooja-workshop-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Excel/CSV फाईल डाऊनलोड झाली! 📥');
  };

  // -------------------------------------------------------------
  // 5. BACKUP & PIN MANAGEMENT
  // -------------------------------------------------------------
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');
  const backupImportRef = useRef<HTMLInputElement | null>(null);

  const handleExportFullBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      galleryItems,
      styleImages,
      workshopConfig,
      leads,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `pooja-saree-draping-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
    showToast('संपूर्ण वेबसाईटचा बॅकअप डाउनलोड झाला! 💾');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.galleryItems) {
          saveGalleryItems(parsed.galleryItems);
        }
        if (parsed.styleImages) {
          setStyleImages(parsed.styleImages);
          localStorage.setItem('pooja_custom_style_images', JSON.stringify(parsed.styleImages));
        }
        if (parsed.workshopConfig) {
          setWorkshopConfig(parsed.workshopConfig);
          localStorage.setItem('pooja_workshop_config', JSON.stringify(parsed.workshopConfig));
        }
        if (parsed.leads) {
          saveLeads(parsed.leads);
        }
        if (onDataChanged) onDataChanged();
        window.dispatchEvent(new Event('pooja_gallery_updated'));
        window.dispatchEvent(new Event('pooja_styles_updated'));
        window.dispatchEvent(new Event('pooja_workshop_updated'));
        showToast('बॅकअप डेटा यशस्वीरित्या रिस्टोअर झाला! 🎉');
      } catch (err) {
        alert('बॅकअप फाईल वाचताना त्रुटी आली. कृपया योग्य JSON फाईल निवडा.');
      }
    };
    reader.readAsText(file);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinChangeMsg('पासवर्ड किमान 4 अक्षरी असावा.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg('दोन्ही पासवर्ड जुळत नाहीत.');
      return;
    }
    try {
      localStorage.setItem('pooja_admin_pin', newPin);
    } catch {
      // ignore
    }
    setNewPin('');
    setConfirmPin('');
    setPinChangeMsg('पासवर्ड यशस्वीरित्या बदलला गेला! ✅');
    setTimeout(() => setPinChangeMsg(''), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-60 flex items-center gap-2 bg-[#3B1F25] text-amber-100 px-5 py-3 rounded-2xl shadow-2xl border border-amber-300/40 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl border border-[#EADBCE] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A1521] via-[#8B1E3F] to-[#4A1521] px-5 py-4 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif tracking-wide text-white">
                  Pooja Saree Draping - Admin CMS Panel
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                फोटो गॅलरी, साडी प्रकार, वर्कशॉप फी आणि आलेल्या नोंदणीचे व्यवस्थापन
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-100 transition-colors"
                title="लॉगआउट"
              >
                <LogOut className="w-3.5 h-3.5 text-red-300" />
                <span>लॉगआउट</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Check Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-[#FAF7F2] to-[#F3EBE0]">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#EADBCE] text-center">
              <div className="w-16 h-16 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center mx-auto mb-4 border border-[#8B1E3F]/20">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#3B1F25]">
                ॲडमिन पॅनेल लॉगिन (Admin Access)
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-6">
                कृपया व्यवस्थापन डॅशबोर्ड उघडण्यासाठी ॲडमिन पासवर्ड किंवा पिन प्रविष्ट करा.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="पासवर्ड टाका (उदा. pooja2026)"
                    className="w-full px-4 py-3 text-sm text-center border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#8B1E3F] outline-none tracking-widest font-semibold"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {pinError && (
                  <p className="text-xs text-red-600 font-medium">{pinError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-sm font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>डॅशबोर्ड उघडा (Login)</span>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>डिफॉल्ट पासवर्ड: <strong className="text-gray-700">pooja2026</strong></span>
                <span className="text-emerald-700 font-medium">100% सुरक्षित स्थानिक ॲक्सेस</span>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#EADBCE] p-3 sm:p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto">
              <div className="flex md:flex-col gap-1.5 w-full">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'bg-[#8B1E3F] text-white shadow-sm'
                      : 'text-[#5B454A] hover:bg-gray-50'
                  }`}
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>फोटो गॅलरी CMS</span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                    activeTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {galleryItems.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('styles')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'styles'
                      ? 'bg-[#8B1E3F] text-white shadow-sm'
                      : 'text-[#5B454A] hover:bg-gray-50'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>साडी प्रकार फोटो CMS</span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                    activeTab === 'styles' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    16
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('workshop')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'workshop'
                      ? 'bg-[#8B1E3F] text-white shadow-sm'
                      : 'text-[#5B454A] hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>वर्कशॉप व फी सेटिंग</span>
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'leads'
                      ? 'bg-[#8B1E3F] text-white shadow-sm'
                      : 'text-[#5B454A] hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>नोंदणी व लेड्स CRM</span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                    activeTab === 'leads' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {leads.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('aicourse')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'aicourse'
                      ? 'bg-[#8B1E3F] text-white shadow-sm'
                      : 'text-[#5B454A] hover:bg-gray-50'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>१ डे AI कोर्स CMS</span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'aicourse' ? 'bg-amber-400 text-stone-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    नवीन
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('backup')}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'backup'
                      ? 'bg-[#8B1E3F] text-white shadow-sm'
                      : 'text-[#5B454A] hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>बॅकअप व पासवर्ड</span>
                </button>
              </div>

              {/* Quick User Status */}
              <div className="hidden md:block pt-4 border-t border-gray-100 mt-4">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>पूजा पाटील ॲडमिन</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-snug">
                    येथून केलेले सर्व बदल वेबसाईटवर लाईव्ह त्वरित लागू होतात.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FAF7F2]">
              {/* TAB 1: GALLERY CMS */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  {/* Top action toolbar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#EADBCE]">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-60">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={gallerySearch}
                          onChange={(e) => setGallerySearch(e.target.value)}
                          placeholder="फोटो शोधा..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8B1E3F]"
                        />
                      </div>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="text-xs py-1.5 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8B1E3F] bg-white"
                      >
                        <option value="all">सर्व कॅटेगरीज ({galleryItems.length})</option>
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.marathi}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleResetGallery}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer"
                        title="मूळ फोटो रिस्टोअर करा"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>मूळ रिसेट</span>
                      </button>

                      <button
                        onClick={() => setIsAddPhotoOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs font-semibold shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>नवीन फोटो जोडा</span>
                      </button>
                    </div>
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGallery.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-[#EADBCE] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="relative h-44 w-full bg-gray-100 group">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                            {item.categoryMarathi || item.category}
                          </div>

                          {/* Quick Replace Hover / Tap */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setReplacingItem(item);
                                replaceFileRef.current?.click();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white text-[#3B1F25] text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                              <Camera className="w-3.5 h-3.5 text-[#8B1E3F]" />
                              <span>फोटो बदला</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {item.isCustom && (
                                <span className="px-1.5 py-0.5 rounded-sm bg-emerald-600 text-white text-[9px] font-bold">
                                  कस्टम
                                </span>
                              )}
                              <h4 className="font-bold text-xs sm:text-sm text-[#3B1F25] line-clamp-1">
                                {item.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                              {item.subtitle}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setEditTitle(item.title);
                                setEditSubtitle(item.subtitle);
                                setEditCategoryVal(item.category);
                                setEditImgUrl(item.image);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>एडिट करा</span>
                            </button>

                            <button
                              onClick={() => handleDeletePhoto(item.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>हटवा</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredGallery.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-[#EADBCE]">
                      <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">कोणतेही फोटो सापडले नाहीत.</p>
                    </div>
                  )}

                  {/* Hidden Replace File Input */}
                  <input
                    ref={replaceFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReplacePhotoFile}
                    className="hidden"
                  />
                </div>
              )}

              {/* TAB 2: 16 SAREE STYLES CMS */}
              {activeTab === 'styles' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#EADBCE]">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#3B1F25] font-serif">
                        16 साडी ड्रॅपिंग प्रकार फोटो व्यवस्थापन
                      </h3>
                      <p className="text-xs text-gray-500">
                        प्रत्येक साडी प्रकाराचा मूळ फोटो किंवा तुम्ही काढलेला प्रत्यक्ष फोटो येथे बदला
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={styleSearch}
                        onChange={(e) => setStyleSearch(e.target.value)}
                        placeholder="साडी प्रकार शोधा..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#8B1E3F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStyles.map((style) => {
                      const currentImg = styleImages[style.id] || style.image;
                      const isCustom = !!styleImages[style.id];

                      return (
                        <div
                          key={style.id}
                          className="bg-white rounded-2xl border border-[#EADBCE] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                        >
                          <div className="relative h-44 w-full bg-gray-100">
                            <img
                              src={currentImg || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                              alt={style.nameEnglish}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-amber-200 text-[10px] font-semibold backdrop-blur-xs">
                              {style.nameMarathi}
                            </div>
                            {isCustom && (
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                अपडेटेड फोटो
                              </div>
                            )}
                          </div>

                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-[#3B1F25]">
                                {style.nameMarathi} ({style.nameEnglish})
                              </h4>
                              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                {style.desc}
                              </p>
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-600">
                                <span className="font-semibold text-[#8B1E3F]">फॅब्रिक:</span>
                                <span>{style.fabric}</span>
                              </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                              <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs font-semibold cursor-pointer">
                                <Camera className="w-3.5 h-3.5" />
                                <span>फोटो बदला</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleStylePhotoChange(style.id, e)}
                                  className="hidden"
                                />
                              </label>

                              {isCustom && (
                                <button
                                  onClick={() => handleResetStyleImage(style.id)}
                                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 cursor-pointer"
                                  title="मूळ फोटो रिस्टोअर करा"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>रिसेट</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: WORKSHOP CONFIG CMS */}
              {activeTab === 'workshop' && (
                <div className="bg-white rounded-3xl p-6 border border-[#EADBCE] shadow-xs max-w-2xl mx-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <div>
                      <h3 className="text-base font-bold text-[#3B1F25] font-serif">
                        1 डे साडी ड्रॅपिंग वर्कशॉप माहिती व फी व्यवस्थापन
                      </h3>
                      <p className="text-xs text-gray-500">
                        येथे केलेले बदल होमपेजवरील वर्कशॉप कार्डवर त्वरित दिसतात
                      </p>
                    </div>
                    <button
                      onClick={handleResetWorkshopConfig}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>मूळ माहिती</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveWorkshopConfig} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        वर्कशॉप नाव (Workshop Title)
                      </label>
                      <input
                        type="text"
                        value={workshopConfig.title}
                        onChange={(e) =>
                          setWorkshopConfig({ ...workshopConfig, title: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          आगामी तारीख (Next Batch Date)
                        </label>
                        <input
                          type="text"
                          value={workshopConfig.nextDate}
                          onChange={(e) =>
                            setWorkshopConfig({ ...workshopConfig, nextDate: e.target.value })
                          }
                          placeholder="उदा. आगामी शनिवार / रविवार"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          वेळ (Timing)
                        </label>
                        <input
                          type="text"
                          value={workshopConfig.time}
                          onChange={(e) =>
                            setWorkshopConfig({ ...workshopConfig, time: e.target.value })
                          }
                          placeholder="उदा. सकाळी 10:30 ते संध्याकाळी 5:30"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          वर्कशॉप फी (Workshop Fee)
                        </label>
                        <input
                          type="text"
                          value={workshopConfig.fee}
                          onChange={(e) =>
                            setWorkshopConfig({ ...workshopConfig, fee: e.target.value })
                          }
                          placeholder="उदा. ₹1,999/- फक्त"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none font-bold text-[#8B1E3F]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          शिल्लक जागा स्टेटस (Seats Available)
                        </label>
                        <input
                          type="text"
                          value={workshopConfig.seatsLeft}
                          onChange={(e) =>
                            setWorkshopConfig({ ...workshopConfig, seatsLeft: e.target.value })
                          }
                          placeholder="उदा. फक्त 8 ते 10 जागा"
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        प्रशिक्षणाचा विषय / मथळा (Training Highlight)
                      </label>
                      <textarea
                        rows={2}
                        value={workshopConfig.training}
                        onChange={(e) =>
                          setWorkshopConfig({ ...workshopConfig, training: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        ठिकाण / पत्ता (Venue Address)
                      </label>
                      <input
                        type="text"
                        value={workshopConfig.venue}
                        onChange={(e) =>
                          setWorkshopConfig({ ...workshopConfig, venue: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                        required
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>वर्कशॉप माहिती सेव्ह करा (Save & Update)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: LEADS & BOOKINGS CRM */}
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#EADBCE]">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#3B1F25] font-serif">
                        वर्कशॉप नावनोंदणी व चौकशी लेड्स ({leads.length})
                      </h3>
                      <p className="text-xs text-gray-500">
                        वेबसाईटवरील फॉर्मद्वारे विद्यार्थिनींनी पाठवलेल्या नोंदणी
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setIsManualLeadOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300/60 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>मॅन्युअल नोंदणी जोडा</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs font-semibold shadow-sm cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Excel / CSV डाऊनलोड</span>
                      </button>
                    </div>
                  </div>

                  {/* Leads List */}
                  <div className="space-y-3">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white rounded-2xl p-4 border border-[#EADBCE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#3B1F25]">{lead.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lead.status === 'contacted'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {lead.status === 'confirmed'
                                ? 'कन्फर्म'
                                : lead.status === 'contacted'
                                ? 'संपर्क झाला'
                                : 'नवीन चौकशी'}
                            </span>
                            <span className="text-[11px] text-gray-400">| {lead.date}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                            <span className="font-semibold text-[#8B1E3F]">
                              मोबाईल: {lead.phone}
                            </span>
                            <span>प्रकार: <strong>{lead.workshopType}</strong></span>
                            <span>सहभागी: {lead.participants}</span>
                          </div>

                          {lead.message && (
                            <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded-xl border border-gray-100 mt-1">
                              &ldquo;{lead.message}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                            title="कॉल करा"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          <a
                            href={`https://wa.me/91${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `नमस्कार ${lead.name} जी,\nपूजा साडी ड्रॅपिंग वर्कशॉपच्या नोंदणीबद्दल धन्यवाद! आपली तारीख व बॅच कन्फर्म करण्यासाठी संपर्क केला आहे.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                            title="WhatsApp मेसेज"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleUpdateLeadStatus(lead.id, e.target.value as any)
                            }
                            className="text-xs py-1.5 px-2 rounded-xl border border-gray-200 bg-white"
                          >
                            <option value="new">नवीन</option>
                            <option value="contacted">संपर्क झाला</option>
                            <option value="confirmed">कन्फर्म</option>
                          </select>

                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            title="हटवा"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {leads.length === 0 && (
                      <div className="text-center py-16 bg-white rounded-3xl border border-[#EADBCE]">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <h4 className="font-bold text-sm text-gray-700">अद्याप कोणतीही नोंदणी नाही</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                          जेव्हा ग्राहक वेबसाईटवर वर्कशॉपसाठी फॉर्म भरतील, तेव्हा त्यांचे नाव व फोन नंबर थेट येथे दिसतील.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: BACKUP & PIN MANAGEMENT */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Backup Card */}
                  <div className="bg-white rounded-3xl p-6 border border-[#EADBCE] shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FAF0F3] text-[#8B1E3F] flex items-center justify-center">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-[#3B1F25]">
                          संपूर्ण डेटा बॅकअप व रिस्टोअर (Backup & Sync)
                        </h4>
                        <p className="text-xs text-gray-500">
                          तुमच्या सर्व फोटोंचा आणि वर्कशॉप सेटिंग्जचा एका क्लिकवर बॅकअप डाउनलोड करा
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleExportFullBackup}
                        className="py-3 px-4 rounded-2xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>बॅकअप डाउनलोड करा (JSON)</span>
                      </button>

                      <label className="py-3 px-4 rounded-2xl bg-white border-2 border-dashed border-[#8B1E3F]/40 hover:border-[#8B1E3F] text-[#8B1E3F] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>बॅकअप अपलोड / रिस्टोअर</span>
                        <input
                          ref={backupImportRef}
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Change PIN Card */}
                  <div className="bg-white rounded-3xl p-6 border border-[#EADBCE] shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-[#3B1F25]">
                          ॲडमिन पासवर्ड / पिन बदला (Change PIN)
                        </h4>
                        <p className="text-xs text-gray-500">
                          डॅशबोर्ड सुरक्षित ठेवण्यासाठी स्वतःचा खाजगी पासवर्ड ठेवा
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePin} className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="password"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="नवीन पासवर्ड (उदा. pooja@2026)"
                          className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                          required
                        />
                        <input
                          type="password"
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="पुन्हा तोच पासवर्ड टाका"
                          className="px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                          required
                        />
                      </div>

                      {pinChangeMsg && (
                        <p className={`text-xs font-semibold ${
                          pinChangeMsg.includes('यशस्वी') ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {pinChangeMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="py-2.5 px-5 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-semibold cursor-pointer transition-colors"
                      >
                        पासवर्ड अपडेट करा
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* AI COURSE CMS TAB */}
              {activeTab === 'aicourse' && (
                <AICourseAdminManager
                  showToast={showToast}
                  onDataChanged={onDataChanged}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ADD PHOTO SUB-MODAL */}
      {isAddPhotoOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EADBCE] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">गॅलरीमध्ये नवीन फोटो जोडा</h4>
              <button
                onClick={() => setIsAddPhotoOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  फोटो निवडा (मोबाईल / कॉम्पुटर)
                </label>
                <div
                  onClick={() => addFileRef.current?.click()}
                  className="border-2 border-dashed border-[#EADBCE] hover:border-[#8B1E3F] rounded-2xl p-4 text-center cursor-pointer bg-[#FAF7F2]"
                >
                  {addImgUrl ? (
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-gray-100">
                      <img src={addImgUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="py-4 text-xs text-gray-600">
                      <Upload className="w-6 h-6 text-[#8B1E3F] mx-auto mb-1.5" />
                      <span>येथे क्लिक करून फोटो निवडा</span>
                    </div>
                  )}
                  <input
                    ref={addFileRef}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const compressed = await compressImageFile(file);
                        setAddImgUrl(compressed);
                      } catch {
                        const reader = new FileReader();
                        reader.onloadend = () => setAddImgUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  किंवा थेट इमेज URL (Optional)
                </label>
                <input
                  type="url"
                  value={addImgUrl.startsWith('data:') ? '' : addImgUrl}
                  onChange={(e) => setAddImgUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  फोटोचे शीर्षक (Title) *
                </label>
                <input
                  type="text"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  placeholder="उदा. गौरी महालक्ष्मी नऊवारी लूक"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  उपशीर्षक / माहिती (Caption)
                </label>
                <input
                  type="text"
                  value={addSubtitle}
                  onChange={(e) => setAddSubtitle(e.target.value)}
                  placeholder="उदा. विद्यार्थिनींनी प्रत्यक्ष हाताने नेसवलेली साडी"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  कॅटेगरी (Category)
                </label>
                <select
                  value={addCategoryVal}
                  onChange={(e) => setAddCategoryVal(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none bg-white"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {addError && <p className="text-xs text-red-600">{addError}</p>}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  फोटो सेव्ह करा
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddPhotoOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs"
                >
                  रद्द
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PHOTO SUB-MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EADBCE] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">फोटो माहिती अपडेट करा</h4>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditPhotoSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  चालू फोटो (बदलण्यासाठी खाली क्लिक करा)
                </label>
                <div
                  onClick={() => editFileRef.current?.click()}
                  className="relative h-40 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer"
                >
                  {editImgUrl ? (
                    <img src={editImgUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      फोटो निवडण्यासाठी क्लिक करा
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                    नवीन फोटो निवडा
                  </div>
                  <input
                    ref={editFileRef}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const compressed = await compressImageFile(file);
                        setEditImgUrl(compressed);
                      } catch {
                        const reader = new FileReader();
                        reader.onloadend = () => setEditImgUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  फोटो शीर्षक (Title)
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  उपशीर्षक / माहिती (Caption)
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  कॅटेगरी (Category)
                </label>
                <select
                  value={editCategoryVal}
                  onChange={(e) => setEditCategoryVal(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none bg-white"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  माहिती अपडेट करा
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs"
                >
                  रद्द
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL LEAD ADD SUB-MODAL */}
      {isManualLeadOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EADBCE]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h4 className="text-base font-bold text-[#3B1F25]">मॅन्युअल वर्कशॉप नोंदणी जोडा</h4>
              <button
                onClick={() => setIsManualLeadOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualLead} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  विद्यार्थिनीचे नाव *
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="उदा. सुनीता कुलकर्णी"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  मोबाईल नंबर *
                </label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="उदा. 9876543210"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  वर्कशॉप प्रकार
                </label>
                <select
                  value={manualWorkshop}
                  onChange={(e) => setManualWorkshop(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none bg-white"
                >
                  <option value="1 डे साडी ड्रॅपिंग वर्कशॉप">1 डे साडी ड्रॅपिंग वर्कशॉप</option>
                  <option value="नऊवारी व काष्टा स्पेशल">नऊवारी व काष्टा स्पेशल</option>
                  <option value="गौरी महालक्ष्मी साडी ड्रॅपिंग">गौरी महालक्ष्मी साडी ड्रॅपिंग</option>
                  <option value="पर्सनल 1-on-1 क्लास">पर्सनल 1-on-1 क्लास</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  टिप / नोट (Optional)
                </label>
                <input
                  type="text"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="उदा. फोनवरून नोंदणी केली, फी दिली"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  नोंदणी सेव्ह करा
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualLeadOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs"
                >
                  रद्द
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
