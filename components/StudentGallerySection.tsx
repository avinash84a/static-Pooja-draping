'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Plus,
  Upload,
  Trash2,
  Edit3,
  RefreshCw,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import businessData from '../data/business-data.json';
import {
  GalleryItem,
  getInitialGallery,
  loadGalleryAsync,
  saveGalleryAsync,
  compressImageFile,
} from '../lib/galleryStorage';

export type { GalleryItem };

const CATEGORY_OPTIONS = [
  { value: 'Gauri Draping', label: '🌸 गौरी महालक्ष्मी (Gauri Draping)', marathi: 'गौरी महालक्ष्मी' },
  { value: 'Nauvari', label: '✨ नऊवारी व काष्टा (Nauvari)', marathi: 'नऊवारी व काष्टा' },
  { value: 'Designer', label: '👑 डिझायनर व रॉयल (Designer)', marathi: 'डिझायनर व रॉयल' },
  { value: 'Workshops', label: '📸 वर्कशॉप सराव (Workshops)', marathi: 'वर्कशॉप सराव' },
  { value: 'Certificates', label: '🎓 प्रमाणपत्र (Certificates)', marathi: 'प्रमाणपत्र' },
];

export interface StudentGallerySectionProps {
  refreshKey?: number;
  items?: GalleryItem[];
}

export default function StudentGallerySection({ refreshKey, items: propItems }: StudentGallerySectionProps = {}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Main gallery items state with robust multi-tier persistence
  const [localGalleryItems, setLocalGalleryItems] = useState<GalleryItem[]>(() => getInitialGallery());
  const galleryItems = (propItems && propItems.length > 0) ? propItems : localGalleryItems;

  // Helper to persist gallery items
  const persistGallery = async (items: GalleryItem[]) => {
    setLocalGalleryItems(items);
    await saveGalleryAsync(items);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Synchronize with Admin Panel updates & IndexedDB
  useEffect(() => {
    // Asynchronously fetch latest data from IndexedDB / Storage
    loadGalleryAsync().then((items) => {
      if (items && items.length > 0) {
        setLocalGalleryItems(items);
      }
    });

    const handleSync = (e?: Event) => {
      if (e instanceof CustomEvent && e.detail && Array.isArray(e.detail)) {
        setLocalGalleryItems(e.detail);
        return;
      }
      loadGalleryAsync().then((items) => {
        if (items && items.length > 0) {
          setLocalGalleryItems(items);
        }
      });
    };

    window.addEventListener('pooja_gallery_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('pooja_gallery_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refreshKey]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [replacingItem, setReplacingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Add Modal Form State
  const [addTitle, setAddTitle] = useState('');
  const [addSubtitle, setAddSubtitle] = useState('');
  const [addCategory, setAddCategory] = useState('Gauri Draping');
  const [addPreviewUrl, setAddPreviewUrl] = useState<string>('');
  const [addError, setAddError] = useState<string>('');
  const addFileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit Modal Form State
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPreviewUrl, setEditPreviewUrl] = useState('');
  const [editError, setEditError] = useState('');
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick Replace Modal Form State
  const [replacePreviewUrl, setReplacePreviewUrl] = useState('');
  const [replaceError, setReplaceError] = useState('');
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter logic
  const categories = useMemo(() => {
    return [
      { id: 'all', label: `सर्व फोटो (${galleryItems.length})` },
      { id: 'Gauri Draping', label: '🌸 गौरी महालक्ष्मी' },
      { id: 'Nauvari', label: '✨ नऊवारी व काष्टा' },
      { id: 'Designer', label: '👑 डिझायनर व रॉयल' },
      { id: 'Workshops', label: '📸 वर्कशॉप सराव' },
      { id: 'Certificates', label: '🎓 प्रमाणपत्र' },
    ];
  }, [galleryItems.length]);

  const filteredGallery = useMemo(() => {
    if (activeFilter === 'all') return galleryItems;
    return galleryItems.filter((item) => item.category === activeFilter);
  }, [galleryItems, activeFilter]);

  const totalFiltered = filteredGallery.length;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) =>
          prev === null || prev === 0 ? totalFiltered - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) =>
          prev === null || prev === totalFiltered - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, totalFiltered]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === null || prev === 0 ? totalFiltered - 1 : prev - 1
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) =>
      prev === null || prev === totalFiltered - 1 ? 0 : prev + 1
    );
  };

  // --- ADD PHOTO HANDLERS ---
  const handleOpenAddModal = () => {
    setAddTitle('');
    setAddSubtitle('');
    setAddCategory('Gauri Draping');
    setAddPreviewUrl('');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleAddFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAddError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAddError('कृपया केवळ इमेज फाईल (JPG, PNG, WebP) निवडा.');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setAddPreviewUrl(compressed);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveNewPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPreviewUrl) {
      setAddError('कृपया फोटो निवडा किंवा इमेज URL टाका.');
      return;
    }

    const categoryObj = CATEGORY_OPTIONS.find((c) => c.value === addCategory);

    const newItem: GalleryItem = {
      id: `custom-${Date.now()}`,
      title: addTitle.trim() || 'नवीन साडी ड्रॅपिंग फोटो',
      subtitle: addSubtitle.trim() || 'पूजा साडी ड्रॅपिंग वर्कशॉप',
      category: addCategory,
      categoryMarathi: categoryObj ? categoryObj.marathi : addCategory,
      image: addPreviewUrl,
      isCustom: true,
    };

    const updated = [newItem, ...galleryItems];
    persistGallery(updated);
    setIsAddModalOpen(false);
    showToast('नवीन फोटो गॅलरीमध्ये यशस्वीरित्या जोडला गेला! ✨');
  };

  // --- EDIT / UPDATE PHOTO HANDLERS ---
  const handleOpenEditModal = (item: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingItem(item);
    setEditTitle(item.title);
    setEditSubtitle(item.subtitle);
    setEditCategory(item.category);
    setEditPreviewUrl(item.image);
    setEditError('');
  };

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setEditError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setEditError('कृपया केवळ इमेज फाईल निवडा.');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setEditPreviewUrl(compressed);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEditPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editPreviewUrl) {
      setEditError('इमेज रिकामी ठेवता येत नाही.');
      return;
    }

    const categoryObj = CATEGORY_OPTIONS.find((c) => c.value === editCategory);

    const updated = galleryItems.map((item) => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          title: editTitle.trim() || item.title,
          subtitle: editSubtitle.trim() || item.subtitle,
          category: editCategory,
          categoryMarathi: categoryObj ? categoryObj.marathi : item.categoryMarathi,
          image: editPreviewUrl,
          isCustom: true,
        };
      }
      return item;
    });

    persistGallery(updated);
    setEditingItem(null);
    showToast('फोटोचे तपशील यशस्वीरित्या अपडेट झाले! ✅');
  };

  // --- QUICK REPLACE PHOTO HANDLERS ---
  const handleOpenReplaceModal = (item: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReplacingItem(item);
    setReplacePreviewUrl(item.image);
    setReplaceError('');
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setReplaceError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setReplaceError('कृपया केवळ इमेज फाईल निवडा.');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setReplacePreviewUrl(compressed);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplacePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveReplacedPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingItem) return;
    if (!replacePreviewUrl) {
      setReplaceError('कृपया नवीन फोटो निवडा.');
      return;
    }

    const updated = galleryItems.map((item) => {
      if (item.id === replacingItem.id) {
        return {
          ...item,
          image: replacePreviewUrl,
          isCustom: true,
        };
      }
      return item;
    });

    persistGallery(updated);
    setReplacingItem(null);
    showToast('फोटो यशस्वीरित्या बदलला गेला (Replaced)! 📸');
  };

  // --- DELETE PHOTO HANDLERS ---
  const handleOpenDeleteModal = (item: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeletingItem(item);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const updated = galleryItems.filter((item) => item.id !== deletingItem.id);
    persistGallery(updated);
    setDeletingItem(null);
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(null);
    }
    showToast('फोटो गॅलरीतून हटवला गेला! 🗑️');
  };

  // --- RESET DEFAULT GALLERY ---
  const handleResetToDefaultGallery = () => {
    const resetList = (businessData.galleryItems as GalleryItem[]).map((item) => ({
      ...item,
      isCustom: false,
    }));
    persistGallery(resetList);
    setIsResetConfirmOpen(false);
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(null);
    }
    showToast('मूळ गॅलरी फोटो रिस्टोअर झाले! 🔄');
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#3B1F25] text-amber-100 px-5 py-3 rounded-2xl shadow-2xl border border-amber-300/40 animate-fadeIn">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          </div>
        )}
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#EADBCE]">
            <Camera className="w-3.5 h-3.5 text-[#8B1E3F]" />
            Photo Gallery & CMS Actions
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            साडी ड्रॅपिंग फोटो गॅलरी
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2">
            गौरी महालक्ष्मी, अस्सल नऊवारी, काष्टा, डिझायनर प्रकार आणि वर्कशॉपमधील प्रत्यक्ष सरावाची क्षणचित्रे.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Action Toolbar: Add Photo, Reset Option, and Filter Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Categories Tab */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id);
                  setSelectedImageIndex(null);
                }}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFilter === cat.id
                    ? 'bg-[#8B1E3F] text-white shadow-sm'
                    : 'bg-white text-[#5B454A] hover:bg-gray-50 border border-[#EADBCE]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Management Buttons: Add Photo & Reset */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-gray-50 border border-[#EADBCE] text-gray-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="मूळ फोटो रिस्टोअर करा"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">मूळ गॅलरी</span>
              <span>रिसेट</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन फोटो जोडा (Add Photo)</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl bg-white border border-[#EADBCE] cursor-pointer transition-all transform hover:-translate-y-1"
            >
              {/* Photo Container */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E0B14]/90 via-[#2E0B14]/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                {/* Category Badge & Action Buttons */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {/* Category Pill */}
                  <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#8B1E3F] shadow-xs pointer-events-auto">
                    {item.categoryMarathi || item.category}
                  </div>

                  {/* Top Action Buttons (Replace, Edit, Delete) */}
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    {/* Replace Photo Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenReplaceModal(item, e)}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#8B1E3F] shadow-md transition-all cursor-pointer"
                      title="फोटो बदला (Replace Photo)"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Details Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditModal(item, e)}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-amber-700 shadow-md transition-all cursor-pointer"
                      title="माहिती व शीर्षक बदला (Edit Details)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenDeleteModal(item, e)}
                      className="p-1.5 rounded-full bg-red-600/90 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer"
                      title="फोटो हटवा (Delete Photo)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {item.isCustom && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
                        Custom
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg drop-shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-amber-200 mt-0.5 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                {/* Zoom hint on hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/85 text-[#36111B] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                  <ZoomIn className="w-5 h-5 text-[#8B1E3F]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGallery.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EADBCE] p-8 max-w-lg mx-auto mt-6">
            <Camera className="w-12 h-12 text-[#8B1E3F]/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#3B1F25]">या कॅटेगरीमध्ये सध्या फोटो उपलब्ध नाहीत</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4">
              तुम्ही वरील &quot;नवीन फोटो जोडा&quot; बटनावर क्लिक करून स्वतःचा फोटो सहज जोडू शकता.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B1E3F] text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>पहिला फोटो जोडा</span>
            </button>
          </div>
        )}

        {/* Gallery Lightbox Modal */}
        {selectedImageIndex !== null && filteredGallery[selectedImageIndex] && (
          <div
            onClick={() => setSelectedImageIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          >
            {/* Top Bar inside Lightbox */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-50"
            >
              <span className="text-xs text-amber-200 font-semibold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
                {selectedImageIndex + 1} / {filteredGallery.length} फोटो
              </span>

              <div className="flex items-center gap-2">
                {/* Quick Replace in Lightbox */}
                <button
                  type="button"
                  onClick={() => handleOpenReplaceModal(filteredGallery[selectedImageIndex])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
                  title="फोटो बदला"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">फोटो बदला</span>
                </button>

                {/* Edit in Lightbox */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(filteredGallery[selectedImageIndex])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
                  title="माहिती एडिट करा"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">एडिट करा</span>
                </button>

                {/* Delete in Lightbox */}
                <button
                  type="button"
                  onClick={() => handleOpenDeleteModal(filteredGallery[selectedImageIndex])}
                  className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="फोटो हटवा"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer ml-2"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Image Box */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            >
              <img
                src={filteredGallery[selectedImageIndex]?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                alt={filteredGallery[selectedImageIndex]?.title || 'गॅलरी फोटो'}
                className="max-w-full max-h-[68vh] object-contain rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />

              <div className="mt-4 text-center text-white px-4">
                <span className="inline-block text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  {filteredGallery[selectedImageIndex]?.categoryMarathi ||
                    filteredGallery[selectedImageIndex]?.category}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl">
                  {filteredGallery[selectedImageIndex]?.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                  {filteredGallery[selectedImageIndex]?.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1. ADD PHOTO MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#EADBCE] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF0F3] text-[#8B1E3F] flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#3B1F25] font-serif">
                    गॅलरीमध्ये नवीन फोटो जोडा
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNewPhoto} className="space-y-4">
                {/* File Upload / Image Picker */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    फोटो निवडा (मोबाईल / कॉम्प्युटर / WhatsApp इमेज)
                  </label>
                  <div
                    onClick={() => addFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#EADBCE] hover:border-[#8B1E3F] rounded-2xl p-4 text-center cursor-pointer bg-[#FAF7F2] transition-colors"
                  >
                    {addPreviewUrl ? (
                      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={addPreviewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                          फोटो बदलण्यासाठी क्लिक करा
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload className="w-8 h-8 text-[#8B1E3F] mx-auto mb-2" />
                        <p className="text-xs font-semibold text-[#3B1F25]">
                          येथे क्लिक करून फोटो निवडा
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          PNG, JPG, JPEG किंवा WebP फाईल
                        </p>
                      </div>
                    )}
                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAddFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Or Direct Image URL Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    किंवा थेट इमेज URL टाका (Optional URL)
                  </label>
                  <input
                    type="url"
                    value={addPreviewUrl.startsWith('data:') ? '' : addPreviewUrl}
                    onChange={(e) => setAddPreviewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    फोटोचे नाव / शीर्षक (Title) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    placeholder="उदा. गौरी महालक्ष्मी नऊवारी लूक"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    माहिती / उपशीर्षक (Caption / Details)
                  </label>
                  <input
                    type="text"
                    value={addSubtitle}
                    onChange={(e) => setAddSubtitle(e.target.value)}
                    placeholder="उदा. विद्यार्थिनींनी प्रत्यक्ष हाताने नेसवलेली साडी"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    कॅटेगरी निवडा (Category)
                  </label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {addError && (
                  <p className="text-xs text-red-600 font-medium">{addError}</p>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer text-center"
                  >
                    फोटो जोडा (Save Photo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    रद्द
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. EDIT / UPDATE PHOTO DETAILS MODAL */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#EADBCE] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF0F3] text-[#8B1E3F] flex items-center justify-center font-bold">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-[#3B1F25] font-serif">
                    फोटो तपशील अपडेट करा
                  </h3>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditPhoto} className="space-y-4">
                {/* Current Image & Change Option */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    चालू फोटो (बदलण्यासाठी खाली क्लिक करा)
                  </label>
                  <div
                    onClick={() => editFileInputRef.current?.click()}
                    className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-[#EADBCE] hover:border-[#8B1E3F] cursor-pointer"
                  >
                    {editPreviewUrl ? (
                      <img
                        src={editPreviewUrl}
                        alt="Edit preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
                        फोटो निवडण्यासाठी क्लिक करा
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-semibold gap-1.5">
                      <Camera className="w-4 h-4" />
                      नवीन फोटो निवडा
                    </div>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    फोटोचे शीर्षक (Title)
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    माहिती / उपशीर्षक (Caption / Subtitle)
                  </label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    कॅटेगरी (Category)
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {editError && (
                  <p className="text-xs text-red-600 font-medium">{editError}</p>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer text-center"
                  >
                    बदल सेव्ह करा (Save Changes)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    रद्द
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. QUICK REPLACE PHOTO MODAL */}
        {replacingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#EADBCE]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FAF0F3] text-[#8B1E3F] flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#3B1F25] font-serif">
                      फोटो बदला (Replace Photo)
                    </h3>
                    <p className="text-[11px] text-gray-500">{replacingItem.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReplacingItem(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReplacedPhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    नवीन फोटो निवडा (मोबाईल / WhatsApp / कॉम्प्युटर)
                  </label>
                  <div
                    onClick={() => replaceFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#EADBCE] hover:border-[#8B1E3F] rounded-2xl p-4 text-center cursor-pointer bg-[#FAF7F2] transition-colors"
                  >
                    {replacePreviewUrl ? (
                      <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={replacePreviewUrl}
                          alt="Replace preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                          दुसरा फोटो निवडण्यासाठी क्लिक करा
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload className="w-8 h-8 text-[#8B1E3F] mx-auto mb-2" />
                        <p className="text-xs font-semibold text-[#3B1F25]">
                          येथे क्लिक करून नवीन फोटो निवडा
                        </p>
                      </div>
                    )}
                    <input
                      ref={replaceFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReplaceFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    किंवा थेट इमेज लिंक (URL) टाका
                  </label>
                  <input
                    type="url"
                    value={replacePreviewUrl.startsWith('data:') ? '' : replacePreviewUrl}
                    onChange={(e) => setReplacePreviewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                  />
                </div>

                {replaceError && (
                  <p className="text-xs text-red-600 font-medium">{replaceError}</p>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer text-center"
                  >
                    नवीन फोटो सेव्ह करा (Replace)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplacingItem(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    रद्द
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. DELETE CONFIRMATION MODAL */}
        {deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#EADBCE]">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#3B1F25] font-serif mb-1">
                हा फोटो गॅलरीतून हटवायचा का?
              </h3>
              <p className="text-xs text-gray-500 mb-4 px-2">
                &quot;{deletingItem.title}&quot; हा फोटो गॅलरीमधून काढला जाईल.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
                >
                  होय, हटवा (Delete)
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm hover:bg-gray-50 cursor-pointer"
                >
                  रद्द
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. RESET GALLERY CONFIRMATION MODAL */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#EADBCE]">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#3B1F25] font-serif mb-1">
                मूळ फोटो गॅलरी रिस्टोअर करायची का?
              </h3>
              <p className="text-xs text-gray-500 mb-4 px-2">
                यामुळे सर्व मूळ default फोटो पूर्ववत लोड होतील.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetToDefaultGallery}
                  className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
                >
                  होय, रिस्टोअर करा
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm hover:bg-gray-50 cursor-pointer"
                >
                  रद्द
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}


