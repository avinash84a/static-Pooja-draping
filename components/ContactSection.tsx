'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Send,
  Sparkles,
  Navigation,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [workshopType, setWorkshopType] = useState('1 डे साडी ड्रॅपिंग वर्कशॉप (₹1,500)');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Pooja+Saree+Draping+Anand+Nagar+Sinhgad+Road+Pune';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Direct WhatsApp prefilled message
    const msg = encodeURIComponent(
      `*नवीन चौकशी / नाव नोंदणी:*\n` +
      `👤 नाव: ${name}\n` +
      `📱 फोन: ${phone}\n` +
      `📅 वर्कशॉप: ${workshopType}\n` +
      (message ? `📝 टीप: ${message}\n` : '') +
      `\nकृपया पुढील बॅचची तारीख आणि Google Pay माहिती पाठवा.`
    );

    setIsSubmitted(true);
    window.open(`https://wa.me/918446917187?text=${msg}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-[#581825] text-xs font-bold border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>थेट संपर्क व मार्गदर्शन</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#36111B]">
            पूजा साडी ड्रॅपिंग — संपर्क व स्टुडिओ ठिकाण
          </h2>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            सिंहगड रोड, आनंद नगर, पुणे. वर्कशॉपमधील जागा आरक्षित करण्यासाठी किंवा कोणत्याही चौकशीसाठी खालील फॉर्म भरा अथवा थेट WhatsApp करा.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Studio Details & Direct Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 border border-amber-200/70 space-y-6">
              <h3 className="text-2xl font-serif font-bold text-[#36111B]">
                पूजा साडी ड्रॅपिंग स्टुडिओ
              </h3>

              <div className="space-y-4 text-sm text-stone-700">
                
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#581825] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">स्टुडिओ पत्ता:</h4>
                    <p className="leading-relaxed">
                      सिंहगड रोड, आनंद नगर, पुणे - ४११०५१, महाराष्ट्र.
                    </p>
                    <span className="text-xs text-stone-500">
                      (आनंद नगर बस स्टॉप व मुख्य रस्त्यापासून अगदी २ मिनिटांच्या अंतरावर)
                    </span>
                  </div>
                </div>

                {/* WhatsApp / Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">थेट फोन / WhatsApp:</h4>
                    <a
                      href="tel:8446917187"
                      className="text-base font-bold text-emerald-800 hover:underline block"
                    >
                      84469 17187
                    </a>
                    <span className="text-xs text-stone-500">
                      (सकाळी ९:०० ते रात्री ९:०० उपलब्ध)
                    </span>
                  </div>
                </div>

                {/* Timing */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#581825] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">वर्कशॉप व भेटीची वेळ:</h4>
                    <p className="leading-relaxed">
                      दर रविवारी: सकाळी ११:०० ते ५:०० (वर्कशॉप बॅच)
                    </p>
                    <span className="text-xs text-stone-500">
                      इतर दिवशी पूर्वपरवानगीने भेट उपलब्ध
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A4%8F%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%A4%E0%A4%BE%E0%A4%88%2C%20%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A5%A7%20%E0%A4%A1%E0%A5%87%20%E0%A4%B8%E0%A4%BE%E0%A4%A1%E0%A5%80%20%E0%A4%A1%E0%A5%8D%E0%A4%B0%E0%A5%82%E0%A4%AA%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%95%E0%A4%B6%E0%A5%89%E0%A4%AA%E0%A4%AC%E0%A4%A6%E0%A5%8D%E0%A4%A6%E0%A4%B2%20%E0%A4%AE%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%80%20%E0%A4%B9%E0%A4%B5%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-sm shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp वर संपर्क</span>
                </a>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white hover:bg-stone-50 text-[#581825] font-bold text-sm border border-stone-300 shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-[#8C1D40]" />
                  <span>Google Maps वर पाहा</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Booking Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-6">
              
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#36111B]">
                  वर्कशॉप चौकशी व नाव नोंदणी
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  तुमची माहिती भरा, आम्ही तुम्हाला तत्काळ WhatsApp वर संपर्क करू.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-serif font-bold text-emerald-900">
                    धन्यवाद! तुमची नोंदणी सुरू झाली आहे.
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    तुमचा मेसेज WhatsApp वर उघडला आहे. कृपया WhatsApp वर &#39;Send&#39; बटण दाबा जेणेकरून पूजा ताई तुम्हाला तपशील पाठवू शकतील.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs font-semibold text-emerald-700 underline"
                  >
                    दुसरा फॉर्म भरा
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      तुमचे पूर्ण नाव (Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="उदा. स्नेहा कुलकर्णी"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8C1D40] text-sm text-stone-900 bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      WhatsApp / मोबाईल नंबर *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="उदा. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8C1D40] text-sm text-stone-900 bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      वर्कशॉप प्रकार
                    </label>
                    <select
                      value={workshopType}
                      onChange={(e) => setWorkshopType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8C1D40] text-sm text-stone-900 bg-stone-50/50"
                    >
                      <option value="1 डे साडी ड्रॅपिंग वर्कशॉप (₹1,500)">
                        १ डे साडी ड्रॅपिंग वर्कशॉप (रविवार स्पेशल - ₹1,500)
                      </option>
                      <option value="गौरी महालक्ष्मी विशेष साडी ड्रॅपिंग">
                        फक्त गौरी महालक्ष्मी विशेष साडी ड्रॅपिंग
                      </option>
                      <option value="नऊवारी व काष्टा साडी ड्रॅपिंग">
                        नऊवारी व काष्टा साडी ड्रॅपिंग
                      </option>
                      <option value="लग्न सोहळा साडी ड्रॅपिंग ऑर्डर">
                        लग्न सोहळा / कार्यक्रमासाठी साडी नेसवणे
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      काही विशेष प्रश्न किंवा तारीख? (पर्यायी)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="उदा. मला आगामी रविवारी यायचे आहे..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8C1D40] text-sm text-stone-900 bg-stone-50/50 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#581825] via-[#8C1D40] to-[#581825] hover:opacity-95 text-amber-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>WhatsApp वर नोंदणी पाठवा</span>
                  </button>

                  <p className="text-[11px] text-center text-stone-500">
                    🔒 तुमची माहिती १००% गोपनीय ठेवली जाते. थेट पूजा ताईंकडून कॉल किंवा मेसेज येईल.
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
