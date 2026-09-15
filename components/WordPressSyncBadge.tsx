'use client';

import React, { useState } from 'react';
import { Globe, RefreshCw, CheckCircle, ExternalLink, ChevronDown, ChevronUp, Server } from 'lucide-react';
import { WP_URL, WP_API } from '../lib/wordpress';

interface WordPressSyncBadgeProps {
  mediaCount?: number;
  isOnline?: boolean;
}

export default function WordPressSyncBadge({ mediaCount = 8, isOnline = true }: WordPressSyncBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <div className="relative">
        
        {/* Collapsed Pill */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#36111B]/90 hover:bg-[#36111B] text-amber-200 text-xs font-semibold shadow-xl border border-amber-300/30 backdrop-blur-md transition-all duration-200"
          title="WordPress Headless CMS माहिती"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <Globe className="w-3.5 h-3.5" />
          <span>WordPress CMS Connected</span>
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>

        {/* Expanded Popup */}
        {isExpanded && (
          <div className="absolute bottom-10 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-amber-200 p-4 space-y-3 text-xs text-stone-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-1.5 font-bold text-[#581825]">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>Headless WordPress CMS</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Live REST API
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-stone-600">
              <div className="flex justify-between">
                <span className="font-semibold text-stone-700">CMS URL:</span>
                <span className="font-mono text-stone-900 truncate max-w-[180px]">
                  avipatil.live/cmspooja
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-stone-700">API Endpoint:</span>
                <span className="font-mono text-stone-900 truncate max-w-[180px]">
                  /wp-json/wp/v2
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-stone-700">लाइव्ह फोटो (Media):</span>
                <span className="font-bold text-emerald-700">{mediaCount} WordPress Photos</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-stone-700">ISR कॅशिंग:</span>
                <span className="font-semibold text-stone-800">६० सेकंद (Auto-revalidate)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <a
                  href="https://avipatil.live/cmspooja/wp-admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#581825] hover:bg-[#722031] text-amber-200 font-bold text-[11px] transition-colors"
                >
                  <span>WP-Admin डॅशबोर्ड</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-stone-400 hover:text-stone-600 text-[11px]"
                >
                  बंद करा
                </button>
              </div>

              <a
                href="/api/download-plugin"
                download="pooja-saree-draping-cms.php"
                className="w-full text-center px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-[#581825] font-bold text-[10px] transition-colors border border-amber-300"
              >
                📥 WordPress CMS प्लगइन डाउनलोड करा (.php)
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
