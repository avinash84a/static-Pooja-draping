'use client';

import React from 'react';
import { MapPin, Navigation, Phone, MessageCircle, Clock, Bus, Building } from 'lucide-react';
import businessData from '../data/business-data.json';

export default function LocationSection() {
  const { business } = businessData;
  const address = business.address;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Saiprabha House, Opposite Jagtap Hospital, Sinhgad Road, Nandadeep Society, Anand Nagar, Pune 411051'
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Saiprabha House Sinhgad Road Anand Nagar Pune 411051'
  )}`;

  return (
    <section id="location" className="py-16 sm:py-24 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#8B1E3F] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#EADBCE]">
            <MapPin className="w-3.5 h-3.5 text-[#8B1E3F]" />
            Find Us in Pune
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3B1F25] font-serif">
            📍 आमचे ठिकाण
          </h2>
          <p className="text-sm sm:text-base text-[#6E4F55] mt-2">
            सिंहगड रोड, आनंद नगर, पुणे येथील सुलभ व मध्यवर्ती ठिकाणी आमचा स्टुडिओ स्थित आहे.
          </p>
          <div className="w-16 h-1 bg-[#8B1E3F] mx-auto mt-4 rounded-full" />
        </div>

        {/* Location Grid: Details on Left, Map on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Address Card & Contact Buttons */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-[#8B1E3F]/10 text-[#8B1E3F] flex items-center justify-center shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#3B1F25] font-serif">
                    {business.name}
                  </h3>
                  <p className="text-xs text-[#7A585F] font-medium">
                    {address.primaryLocation}
                  </p>
                </div>
              </div>

              {/* Detailed Address */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#8B1E3F] shrink-0 mt-1" />
                  <div>
                    <span className="text-xs font-bold text-[#3B1F25] uppercase tracking-wider">
                      संपूर्ण पत्ता (Address):
                    </span>
                    <p className="text-sm text-[#4A3E3D] font-medium leading-relaxed mt-0.5">
                      {address.building},<br />
                      {address.landmark},<br />
                      {address.street},<br />
                      {address.area}, {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs font-bold text-[#3B1F25] uppercase tracking-wider">
                      वेळ (Visiting Hours):
                    </span>
                    <p className="text-xs sm:text-sm text-[#4A3E3D] mt-0.5">
                      दररोज सकाळी 10:00 ते संध्याकाळी 7:00<br />
                      <span className="text-[11px] text-[#8B1E3F] font-medium">
                        (कृपया येण्यापूर्वी कॉल किंवा WhatsApp वर वेळ निश्चित करा)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Bus className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs font-bold text-[#3B1F25] uppercase tracking-wider">
                      कसे पोहोचावे (Landmark):
                    </span>
                    <p className="text-xs sm:text-sm text-[#4A3E3D] mt-0.5">
                      सिंहगड रोड वरील जगताप हॉस्पिटलच्या बरोबर समोर. आनंद नगर बस स्टॉपवरून 2 मिनिटांचे अंतर.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B1E3F] hover:bg-[#721531] text-white text-sm font-semibold shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions (गुगल मॅप्सवर दिशा पहा)</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="tel:8446917187"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#8B1E3F] text-[#8B1E3F] hover:bg-[#FAF0F3] text-xs font-semibold transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 84469 17187</span>
                </a>

                <a
                  href="https://wa.me/918446917187?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%A1%E0%A4%AE%2C%0A%E0%A4%AE%E0%A4%B2%E0%A4%BE%20%E0%A4%A4%E0%A5%81%E0%A4%AE%E0%A4%9A%E0%A5%8D%E0%A4%AF%E0%A4%BE%20%E0%A4%B8%E0%A4%BE%E0%A4%88%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%AD%E0%A4%BE%20%E0%A4%B9%E0%A4%BE%E0%A4%8a%E0%A4%B8%2C%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9%E0%A4%97%E0%A4%A1%20%E0%A4%B0%E0%A5%8B%E0%A4%A1%20%E0%A4%B8%E0%A5%8D%E0%A4%9F%E0%A5%81%E0%A4%A1%E0%A4%BF%E0%A4%93%E0%A4%B2%E0%A4%BE%20%E0%A4%AD%E0%A5%87%E0%A4%9F%20%E0%A4%A6%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%AF%E0%A4%9A%E0%A5%80%20%E0%A4%86%E0%A4%B9%E0%A5%87."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed Frame */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#EADBCE] shadow-sm min-h-[360px] lg:min-h-[460px] relative">
            <iframe
              title="Pooja Saree Draping Pune Location Map"
              src="https://maps.google.com/maps?q=Saiprabha+House+Opposite+Jagtap+Hospital+Sinhgad+Road+Anand+Nagar+Pune+411051&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[380px] lg:min-h-[460px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Map overlay hint badge */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-gray-200 shadow-md text-xs font-bold text-[#3B1F25] flex items-center gap-1.5 pointer-events-none">
              <MapPin className="w-3.5 h-3.5 text-[#8B1E3F]" />
              <span>Saiprabha House, Sinhgad Road, Pune</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
