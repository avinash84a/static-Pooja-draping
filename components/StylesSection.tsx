'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Eye,
  Check,
  X,
  ArrowRight,
  Search,
  MessageCircle,
  Tag,
  Calendar,
  Layers,
  Sparkle,
  Camera,
  Upload,
  RotateCcw,
} from 'lucide-react';
import businessData from '../data/business-data.json';
import {
  compressImageFile,
  getInitialStyles,
  loadStylesAsync,
  saveStylesAsync,
} from '../lib/galleryStorage';

interface StylesSectionProps {
  onBookClick: (styleName?: string) => void;
  refreshKey?: number;
  customImages?: Record<string | number, string>;
}

export default function StylesSection({ onBookClick, refreshKey, customImages: propCustomImages }: StylesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<any | null>(null);

  // Custom Images state with server & IndexedDB persistence
  const [localCustomImages, setLocalCustomImages] = useState<Record<string | number, string>>(() => getInitialStyles());

  const customImages = propCustomImages || localCustomImages;

  useEffect(() => {
    const handleSync = (e?: Event) => {
      if (e instanceof CustomEvent && e.detail) {
        const stylesPayload = (e.detail as any).styles || e.detail;
        if (stylesPayload && typeof stylesPayload === 'object') {
          setLocalCustomImages((prev) => ({ ...prev, ...stylesPayload }));
          return;
        }
      }
      loadStylesAsync().then((s) => {
        if (s) setLocalCustomImages(s);
      });
    };

    loadStylesAsync().then((s) => {
      if (s) setLocalCustomImages(s);
    });

    window.addEventListener('pooja_styles_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('pooja_styles_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refreshKey]);

  // Modal for changing photo of a style
  const [editingPhotoStyle, setEditingPhotoStyle] = useState<any | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [photoError, setPhotoError] = useState<string>('');
  const styleFileInputRef = useRef<HTMLInputElement | null>(null);

  const styles = businessData.drapingStyles;

  const getStyleImage = (style: any) => {
    if (customImages[style.id]) {
      return customImages[style.id];
    }
    return style.image;
  };

  const handleOpenPhotoUpload = (style: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPhotoStyle(style);
    setPhotoPreview(customImages[style.id] || style.image || '');
    setPhotoError('');
  };

  const handleStyleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('कृपया केवळ इमेज फाईल (JPG, PNG, WebP) निवडा.');
      return;
    }

    try {
      const compressed = await compressImageFile(file);
      setPhotoPreview(compressed);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStylePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoPreview) {
      setPhotoError('कृपया इमेज निवडा.');
      return;
    }

    if (editingPhotoStyle) {
      const updated = {
        ...customImages,
        [editingPhotoStyle.id]: photoPreview,
      };
      setLocalCustomImages(updated);
      await saveStylesAsync(updated);

      // Also update selectedStyle if open
      if (selectedStyle && selectedStyle.id === editingPhotoStyle.id) {
        setSelectedStyle({
          ...selectedStyle,
          image: photoPreview,
        });
      }
    }

    setEditingPhotoStyle(null);
    setPhotoPreview('');
    setPhotoError('');
  };

  const handleResetStylePhoto = async () => {
    if (!editingPhotoStyle) return;
    const updated = { ...customImages };
    delete updated[editingPhotoStyle.id];
    setLocalCustomImages(updated);
    await saveStylesAsync(updated);
    if (selectedStyle && selectedStyle.id === editingPhotoStyle.id) {
      setSelectedStyle({
        ...selectedStyle,
        image: editingPhotoStyle.image,
      });
    }
    setEditingPhotoStyle(null);
  };

  const categories = [
    { id: 'all', label: 'सर्व 16 प्रकार (All 16)' },
    { id: 'Gauri Mahalakshmi', label: '🌸 गौरी महालक्ष्मी पॅटर्न' },
    { id: 'Maharashtrian Classic', label: '✨ अस्सल नऊवारी व काष्टा' },
    { id: 'Designer Royal', label: '👑 रॉयल व डिझायनर पॅटर्न' },
  ];

  const filteredStyles = useMemo(() => {
    return styles.filter((s) => {
      // Category filter
      let matchesCat = true;
      if (activeCategory === 'Gauri Mahalakshmi') {
        matchesCat = s.category.includes('Gauri') || s.nameMarathi.includes('गौरी') || s.nameMarathi.includes('रुक्मिणी');
      } else if (activeCategory === 'Maharashtrian Classic') {
        matchesCat = s.category.includes('Maharashtrian') || s.nameMarathi.includes('नऊवारी') || s.nameMarathi.includes('काष्टा') || s.nameMarathi.includes('ब्राह्मणी') || s.nameMarathi.includes('कोल्हापुरी') || s.nameMarathi.includes('मस्तानी') || s.nameMarathi.includes('राजलक्ष्मी');
      } else if (activeCategory === 'Designer Royal') {
        matchesCat = s.category.includes('Designer') || s.nameMarathi.includes('अप्सरा') || s.nameMarathi.includes('देवसेना') || s.nameMarathi.includes('कमळ') || s.nameMarathi.includes('पंखा') || s.nameMarathi.includes('डबल पदर') || s.nameMarathi.includes('गोल') || s.nameMarathi.includes('बटरफ्लाय');
      }

      // Search query filter
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        s.nameMarathi.toLowerCase().includes(q) ||
        s.nameEnglish.toLowerCase().includes(q) ||
        (s.desc && s.desc.toLowerCase().includes(q)) ||
        (s.accent && s.accent.toLowerCase().includes(q)) ||
        ((s as any).fabric && (s as any).fabric.toLowerCase().includes(q)) ||
        ((s as any).occasion && (s as any).occasion.toLowerCase().includes(q))
      );
    });
  }, [styles, activeCategory, searchQuery]);

  const handleWhatsAppEnquiry = (style: any) => {
    const text = `नमस्कार पूजा मॅडम,\n\nमला पूजा साडी ड्रॅपिंगच्या "${style.nameMarathi} (${style.nameEnglish})" या साडी ड्रॅपिंग प्रकाराबद्दल माहिती हवी आहे. कृपया पुढील बॅचची माहिती द्या. धन्यवाद!`;
    const url = `https://wa.me/918446917187?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="styles" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F3] text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            14+ सुंदर साडी ड्रॅपिंग प्रकार
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            14+ सुंदर साडी ड्रॅपिंग प्रकार (गौरी व महिलांसाठी)
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2 max-w-2xl mx-auto leading-relaxed">
            गौरी महालक्ष्मी सण, लग्नकार्य, नवरी, मंगळागौर, फोटोशूट आणि सणांसाठी लागणारे सर्व पारंपारिक व डिझायनर पॅटर्न प्रत्यक्ष हँड्स-ऑन सरावासह शिकवले जातात.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Controls & Quick Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#8B1E3F] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#5B454A] hover:bg-[#F2EAE0] border border-[#EADBCE]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="पॅटर्न किंवा साडी शोधा..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-full bg-[#FAF7F2] border border-[#EADBCE] text-[#3B1F25] placeholder:text-gray-400 focus:outline-none focus:border-[#8B1E3F] focus:ring-1 focus:ring-[#8B1E3F] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Count & Help text */}
        <div className="flex items-center justify-between text-xs text-[#7A585F] mb-6 px-1">
          <span>
            दर्शवत आहे: <strong>{filteredStyles.length}</strong> साडी ड्रॅपिंग प्रकार
          </span>
          <span className="hidden sm:inline text-[#8B1E3F] font-medium">
            💡 कोणत्याही कार्डवर क्लिक करून सविस्तर माहिती व प्रसंग पहा
          </span>
        </div>

        {/* Saree Styles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStyles.map((item) => {
            const currentImg = getStyleImage(item);
            const isCustom = Boolean(customImages[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedStyle(item)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EAE2D7] hover:border-[#8B1E3F]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Preview Container */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <img
                    src={currentImg || item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                    alt={item.nameMarathi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Number Badge */}
                  <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#581825]/90 text-amber-200 text-xs font-bold flex items-center justify-center shadow-md">
                    #{item.id}
                  </div>

                  {/* Accent Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#8B1E3F] shadow-xs">
                    {item.accent}
                  </div>

                  {/* Change Photo Button on Card */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenPhotoUpload(item, e)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-[#8B1E3F] shadow-md transition-all cursor-pointer z-10"
                    title="या प्रकारचा फोटो बदला (Upload/Change Photo)"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>

                  {/* Fabric Badge */}
                  {(item as any).fabric && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-[#3B1F25]/85 backdrop-blur-xs text-[10px] font-medium text-amber-200">
                      {(item as any).fabric}
                    </div>
                  )}

                  {/* Custom Photo indicator */}
                  {isCustom && (
                    <div className="absolute top-11 left-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
                      अपलोड केलेला फोटो
                    </div>
                  )}

                  {/* Hover overlay hint */}
                  <div className="absolute inset-0 bg-[#36111B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#36111B] text-xs font-bold shadow-md">
                      <Eye className="w-4 h-4 text-[#8B1E3F]" />
                      तपशील व प्रसंग पहा
                    </span>
                  </div>
                </div>

              {/* Card Information */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#3B1F25] group-hover:text-[#8B1E3F] transition-colors font-serif">
                      {item.nameMarathi}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-[#7A585F] font-medium tracking-wide">
                    {item.nameEnglish}
                  </p>

                  {(item as any).occasion && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
                      <Sparkle className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{(item as any).occasion}</span>
                    </div>
                  )}

                  <p className="text-xs text-[#5B454A] mt-2.5 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3.5 mt-3.5 border-t border-[#EAE2D7] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8B1E3F] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    वर्कशॉपमध्ये समाविष्ट
                  </span>
                  <span className="text-xs font-semibold text-[#8B1E3F] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    शिकायचे आहे? →
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredStyles.length === 0 && (
          <div className="text-center py-12 bg-[#FAF7F2] rounded-2xl border border-[#EADBCE] mt-6">
            <p className="text-base font-semibold text-[#3B1F25]">
              आपल्या शोधानुसार कोणताही साडी प्रकार सापडला नाही.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-full bg-[#8B1E3F] text-white text-xs font-semibold"
            >
              सर्व साडी प्रकार पुन्हा पहा
            </button>
          </div>
        )}

        {/* Bottom Banner for All 14+ / 16 Styles */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAF4EE] via-[#FDFBF8] to-[#FAF4EE] border border-[#EADBCE] max-w-3xl mx-auto shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] text-xs font-bold uppercase mb-2">
                100% प्रॅक्टिकल हँड्स-ऑन ट्रेनिंग
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#3B1F25] font-serif">
                हे सर्व 14+ प्रकार तुम्ही 1-डे वर्कशॉपमध्ये शिकू शकता!
              </h3>
              <p className="text-xs sm:text-sm text-[#6E4F55] mt-1 leading-relaxed">
                उभारलेल्या व बसलेल्या गौरीसाठी, नऊवारी, ब्राह्मणी, काष्टा आणि डिझायनर प्रकारांचे संपूर्ण मार्गदर्शन व सराव साडी सपोर्ट.
              </p>
            </div>
            
            <button
              onClick={() => onBookClick()}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-105"
            >
              <span>वर्कशॉप सीट बुक करा</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Style Details Modal */}
      {selectedStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EADBCE]">
            
            {/* Modal Image */}
            <div className="relative h-64 sm:h-72 w-full bg-gray-100">
              <img
                src={getStyleImage(selectedStyle) || selectedStyle.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                alt={selectedStyle.nameMarathi}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedStyle(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo replace button inside modal */}
              <button
                type="button"
                onClick={() => handleOpenPhotoUpload(selectedStyle)}
                className="absolute top-4 right-16 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-xs font-semibold text-gray-800 shadow-md transition-all cursor-pointer"
                title="फोटो बदला / इमेज अपलोड करा"
              >
                <Camera className="w-3.5 h-3.5 text-[#8B1E3F]" />
                <span>फोटो बदला</span>
              </button>

              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-[#36111B] text-xs font-bold shadow-md">
                {selectedStyle.accent}
              </div>
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#581825]/90 text-amber-200 text-xs font-bold shadow-md">
                #{selectedStyle.id}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-7">
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1E3F]">
                  {selectedStyle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#3B1F25] mt-1">
                  {selectedStyle.nameMarathi}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{selectedStyle.nameEnglish}</p>
              </div>

              {/* Attributes Chips */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                {(selectedStyle as any).fabric && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADBCE]">
                    <span className="text-gray-500 block text-[10px] font-semibold uppercase">शिफारस केलेली साडी</span>
                    <span className="font-bold text-[#3B1F25]">{(selectedStyle as any).fabric}</span>
                  </div>
                )}
                {(selectedStyle as any).occasion && (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADBCE]">
                    <span className="text-gray-500 block text-[10px] font-semibold uppercase">योग्य प्रसंग / सण</span>
                    <span className="font-bold text-[#8B1E3F]">{(selectedStyle as any).occasion}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-[#4A3E3D] leading-relaxed mb-5">
                {selectedStyle.desc}
              </p>

              {/* Training details */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EADBCE] space-y-2 mb-6 text-xs text-[#5B454A]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>प्रत्यक्ष प्रात्यक्षिक व स्वतः हाताने सराव (Hands-on Practice)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>परफेक्ट प्लीट्स, पिनिंग आणि पदर सेटिंगचे बारकावे</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>पूजा मॅडमचे वैयक्तिक लक्ष व त्रुटी दुरुस्ती</span>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    const name = selectedStyle.nameMarathi;
                    setSelectedStyle(null);
                    onBookClick(name);
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all text-center cursor-pointer"
                >
                  हा प्रकार शिकण्यासाठी नोंदणी करा
                </button>
                <button
                  onClick={() => handleWhatsAppEnquiry(selectedStyle)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp वर विचारा</span>
                </button>
              </div>

              <div className="text-center mt-3">
                <button
                  onClick={() => setSelectedStyle(null)}
                  className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors cursor-pointer"
                >
                  बंद करा (Close)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Change Photo Upload Modal */}
      {editingPhotoStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#EADBCE]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FAF0F3] text-[#8B1E3F] flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#3B1F25] font-serif">
                    {editingPhotoStyle.nameMarathi}
                  </h3>
                  <p className="text-[11px] text-gray-500">फोटो बदला / इमेज अपलोड करा</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPhotoStyle(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStylePhoto} className="space-y-4">
              {/* File Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  मोबाईल किंवा कॉम्प्युटरवरून फोटो निवडा (Select from Device / WhatsApp)
                </label>
                <div
                  onClick={() => styleFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#EADBCE] hover:border-[#8B1E3F] rounded-2xl p-4 text-center cursor-pointer bg-[#FAF7F2] transition-colors"
                >
                  {photoPreview ? (
                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={photoPreview}
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
                        येथे क्लिक करून नवीन फोटो निवडा
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        JPG, PNG किंवा WebP इमेज
                      </p>
                    </div>
                  )}
                  <input
                    ref={styleFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleStyleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Or Direct URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  किंवा थेट इमेज URL टाका (Optional URL)
                </label>
                <input
                  type="url"
                  value={photoPreview.startsWith('data:') ? '' : photoPreview}
                  onChange={(e) => setPhotoPreview(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B1E3F] outline-none"
                />
              </div>

              {photoError && (
                <p className="text-xs text-red-600 font-medium">{photoError}</p>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer text-center"
                >
                  फोटो सेव्ह करा (Save Photo)
                </button>

                {customImages[editingPhotoStyle.id] && (
                  <button
                    type="button"
                    onClick={handleResetStylePhoto}
                    className="px-3 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold inline-flex items-center gap-1"
                    title="मूळ फोटो रिस्टोअर करा"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>मूळ फोटो</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setEditingPhotoStyle(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm hover:bg-gray-50"
                >
                  रद्द
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
