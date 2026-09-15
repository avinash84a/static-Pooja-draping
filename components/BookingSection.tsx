'use client';

import React, { useState } from 'react';
import {
  Ticket,
  MessageCircle,
  Phone,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { addLeadAsync, BookingLead } from '../lib/galleryStorage';

interface BookingSectionProps {
  preselectedStyle?: string;
}

export default function BookingSection({ preselectedStyle }: BookingSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    workshopType: preselectedStyle ? `स्पेशल प्रकार: ${preselectedStyle}` : '1 डे साडी ड्रॅपिंग वर्कशॉप (गौरी महालक्ष्मी स्पेशल)',
    participants: '1',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const workshopOptions = [
    '1 डे साडी ड्रॅपिंग वर्कशॉप (गौरी महालक्ष्मी स्पेशल)',
    'नऊवारी व काष्टा साडी ड्रॅपिंग मास्टरक्लास',
    'पारंपरिक गौरी साडी ड्रॅपिंग (उभारलेल्या व बसलेल्या)',
    'डिझायनर साडी ड्रॅपिंग व प्री-प्लीटिंग क्लास',
    'वन-ऑन-वन पर्सनल साडी ट्रेनिंग सेशन',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Save registration to local & server storage for Admin Panel
    const newLead: BookingLead = {
      id: `lead-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      workshopType: formData.workshopType,
      participants: formData.participants,
      message: formData.message.trim(),
      date: new Date().toLocaleString('mr-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'new',
    };
    addLeadAsync(newLead).catch((err) => console.warn('Could not save lead:', err));

    // Create customized WhatsApp booking message
    const waText = `नमस्कार पूजा मॅडम,\n\nमी वर्कशॉपसाठी नावनोंदणी करू इच्छिते:\n- नाव: ${formData.name}\n- मोबाईल: ${formData.phone}\n- वर्कशॉप प्रकार: ${formData.workshopType}\n- सहभागी संख्या: ${formData.participants}\n${formData.message ? `- संदेश: ${formData.message}\n` : ''}\nकृपया पुढील बॅचची कन्फर्मेशन द्या. धन्यवाद!`;

    const waUrl = `https://wa.me/918446917187?text=${encodeURIComponent(waText)}`;

    // Show on-screen confirmation
    setSubmitted(true);

    // Also open WhatsApp in new tab for instant reach
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
  };

  return (
    <section id="booking" className="py-16 sm:py-24 bg-gradient-to-b from-white via-[#FAF5EE] to-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E3F]/10 text-[#8B1E3F] text-xs font-bold uppercase tracking-wider mb-3">
            <Ticket className="w-3.5 h-3.5 text-[#8B1E3F]" />
            Fast & Easy Registration
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            तुमची साडी ड्रॅपिंगची सुरुवात आजच करा!
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2 max-w-xl mx-auto">
            खालील फॉर्म भरा किंवा थेट कॉल व WhatsApp करून तुमची जागा निश्चित करा. मर्यादित जागा उपलब्ध.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Booking Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#EADBCE] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Form Benefits & Direct Contact */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#581825] via-[#7B1B36] to-[#581825] p-6 sm:p-8 text-white flex flex-col justify-between">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-400/90 text-[#36111B] text-xs font-bold uppercase tracking-wider mb-3">
                  पूजा साडी ड्रॅपिंग पुणे
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif leading-snug">
                  आत्मविश्वासाने साडी नेसायला शिका
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/90 mt-2 leading-relaxed">
                  गौरी सण असो, लग्नकार्य असो किंवा खास सोहळा — स्वतःच्या हाताने नेसलेल्या परिपूर्ण साडीचे समाधान वेगळेच असते!
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    </div>
                    <span>केवळ 8-10 महिलांची छोटी बॅच</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    </div>
                    <span>हँड्स-ऑन सराव व साहित्य सपोर्ट</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    </div>
                    <span>अधिकृत सहभाग प्रमाणपत्र</span>
                  </div>
                </div>
              </div>

              {/* Direct Instant Action Quick Box */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-xs text-amber-200 font-medium mb-3">
                  थेट संपर्क करण्यासाठी खालील पर्याय वापरा:
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href="tel:8446917187"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-300" />
                    <span>कॉल करा: 84469 17187</span>
                  </a>

                  <a
                    href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%A1%E0%A4%AE%2C%0A%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%A1%E0%A5%80%20%E0%A4%A1%E0%A5%8D%E0%A4%B0%E0%A5%85%E0%A4%AA%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%8Params%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87.%0A%E0%A4%95%E0%A5%83%E0%A4%AA%E0%A4%AF%E0%A4%BE%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%AA%E0%A5%81%E0%A4%A2%E0%A5%80%E0%A4%B2%20workshop%20%E0%A4%9A%E0%A5%80%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%AA%E0%A4%BE%E0%A4%A0%E0%A4%B5%E0%A4%BE."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10">
              {submitted ? (
                <div className="text-center py-10 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-[#3B1F25]">
                    धन्यवाद {formData.name}!
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                    तुमची वर्कशॉप नावनोंदणी विनंती प्राप्त झाली आहे. पूजा मॅडम लवकरच तुमच्याशी <span className="font-semibold text-emerald-700">{formData.phone}</span> या नंबरवर संपर्क करतील.
                  </p>
                  <p className="text-xs text-[#8B1E3F] mt-3 font-semibold">
                    (तुमच्या सोयीसाठी WhatsApp वर संदेश तयार झाला आहे)
                  </p>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        workshopType: '1 डे साडी ड्रॅपिंग वर्कशॉप (गौरी महालक्ष्मी स्पेशल)',
                        participants: '1',
                        message: '',
                      });
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    दुसरा फॉर्म भरा
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-[#3B1F25] font-serif">
                      सीट आरक्षित करा (Book My Seat)
                    </h3>
                    <p className="text-xs text-gray-500">
                      कृपया आपले नाव आणि मोबाईल नंबर अचूक भरा
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      आपले पूर्ण नाव (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. सौ. स्नेहा जोशी"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-[#FAF7F2] border border-[#EAE2D7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      मोबाईल नंबर (WhatsApp Number) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="उदा. 98XXXXXXXX किंवा 8446917187"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-[#FAF7F2] border border-[#EAE2D7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                        पसंतीचा वर्कशॉप (Preferred Workshop)
                      </label>
                      <select
                        value={formData.workshopType}
                        onChange={(e) => setFormData({ ...formData, workshopType: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#EAE2D7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none transition-all"
                      >
                        {workshopOptions.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                        सहभागी संख्या
                      </label>
                      <select
                        value={formData.participants}
                        onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#EAE2D7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none transition-all"
                      >
                        <option value="1">1 व्यक्ती</option>
                        <option value="2">2 व्यक्ती (मैत्रीण/बहिण)</option>
                        <option value="3">3 व्यक्ती</option>
                        <option value="4+">4+ ग्रुप</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E3D] mb-1">
                      संदेश किंवा विशेष प्रश्न (Message - Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="कोणत्याही विशेष साडी प्रकाराबद्दल विचारायचे असल्यास येथे लिहा..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 text-sm bg-[#FAF7F2] border border-[#EAE2D7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                    >
                      <Ticket className="w-4 h-4 text-amber-300" />
                      <span>Book My Seat (नोंदणी पूर्ण करा)</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 text-center mt-2">
                    🔒 तुमची माहिती सुरक्षित राहील. आम्ही स्पॅम कॉल करत नाही.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
