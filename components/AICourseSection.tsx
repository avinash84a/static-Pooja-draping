'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DEFAULT_AI_COURSE_DATA,
  loadAICourseDataAsync,
  AICourseData,
} from '../lib/galleryStorage';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  Users,
  Music,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Languages,
  MessageCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Send,
  Zap,
  Target,
  Wrench,
  BookOpen,
  FileText,
  Palette,
  Workflow,
  Laptop,
  Home,
  Landmark,
  Rocket,
  Search,
  ArrowRight,
  Filter,
  CheckCircle,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Briefcase,
  Laptop,
  Home,
  Landmark,
  Rocket,
  Target,
  Users,
  Building2,
  Music,
  Bot,
};

function renderChallengeIcon(icon: any, className = 'w-4 h-4') {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    const Component = icon;
    return <Component className={className} />;
  }
  if (typeof icon === 'string' && iconMap[icon]) {
    const Component = iconMap[icon];
    return <Component className={className} />;
  }
  return <Target className={className} />;
}

export default function AICoursePage() {
  const [lang, setLang] = useState<'mr' | 'hi'>('mr');
  const [activeAudience, setActiveAudience] = useState<string>('business');
  const [activeChallengeId, setActiveChallengeId] = useState<string>('teacher');
  const [toolFilter, setToolFilter] = useState<string>('all');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Teacher',
    langPref: 'मराठी',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const [courseData, setCourseData] = useState<AICourseData>(DEFAULT_AI_COURSE_DATA);

  useEffect(() => {
    let mounted = true;
    loadAICourseDataAsync().then((res) => {
      if (mounted && res) {
        setCourseData(res);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const whatsappNum = courseData.config?.whatsapp || '8446917187';
    const msg = encodeURIComponent(
      `नमस्कार, मला 1 Day AI Workshop (Basic to Advanced) साठी नाव नोंदवायचे आहे!\n\nनाव: ${formData.name}\nमोबाईल: ${formData.phone}\nक्षेत्र: ${formData.category}\nभाषा: ${formData.langPref}\nनोंद: ${formData.notes || 'नवीन बॅच माहिती हवी आहे.'}`
    );
    window.open(`https://wa.me/91${whatsappNum.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  const coursePillars =
    courseData.pillars && courseData.pillars.length > 0
      ? courseData.pillars
      : DEFAULT_AI_COURSE_DATA.pillars;

  const coreToolsList =
    courseData.tools && courseData.tools.length > 0
      ? courseData.tools
      : DEFAULT_AI_COURSE_DATA.tools;

  const realLifeChallenges =
    courseData.challenges && courseData.challenges.length > 0
      ? courseData.challenges
      : DEFAULT_AI_COURSE_DATA.challenges;

  const currentChallenge =
    realLifeChallenges.find((c) => c.id === activeChallengeId) || realLifeChallenges[0];

  const filteredTools =
    toolFilter === 'all'
      ? coreToolsList
      : coreToolsList.filter((t) => t.category === toolFilter || t.category === 'all');

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#4A121E] via-[#581825] to-[#36111B] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Language Toggle Pill */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>१ डे प्रॅक्टिकल AI कार्यशाळा (Basic to Advanced)</span>
            </div>

            <div className="inline-flex items-center bg-black/40 border border-white/20 rounded-full p-1 text-xs">
              <button
                onClick={() => setLang('mr')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  lang === 'mr' ? 'bg-amber-400 text-stone-950 shadow' : 'text-stone-300 hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  lang === 'hi' ? 'bg-amber-400 text-stone-950 shadow' : 'text-stone-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white mb-4 leading-tight">
            {lang === 'mr' ? (
              <>
                <span className="text-amber-300">AI फक्त IT लोकांसाठी नाही</span> — <br className="hidden sm:inline" />
                AI प्रत्येकासाठी आहे!
              </>
            ) : (
              <>
                <span className="text-amber-300">AI सिर्फ टेक वालों के लिए नहीं</span> — <br className="hidden sm:inline" />
                AI हर किसी के लिए है!
              </>
            )}
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-xl text-[#F3E5E7] leading-relaxed mb-8">
            {lang === 'mr'
              ? '४०-५० टूल्स शिकून गोंधळ करू नका! १०-१२ कोर टूल्स, ५ मुख्य Pillars आणि शेवटी तुमच्या क्षेत्राचा थेट Real-Life प्रोजेक्ट चॅलेंज — मराठीत अगदी सोप्या भाषेत.'
              : '40-50 टूल्स का कोई भ्रम नहीं! 10-12 कोर टूल्स, 5 मजबूत Pillars और अंत में अपने प्रोफेशन का लाइव Real-Life प्रोजेक्ट चैलेंज — आसान हिंदी में।'}
          </p>

          {/* Key Value Stats */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-10">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <Target className="w-4 h-4" />
                <span>५ Pillars</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">Understand to Automate</div>
              <div className="text-[11px] text-stone-300">पद्धतशीर ५ टप्पे</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <Wrench className="w-4 h-4" />
                <span>१०–१२ Core Tools</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">No Confusion Policy</div>
              <div className="text-[11px] text-stone-300">फक्त उपयोगी टूल्स</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <Award className="w-4 h-4" />
                <span>Real-Life Challenge</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">८+ क्षेत्रांचे प्रोजेक्ट्स</div>
              <div className="text-[11px] text-stone-300">प्रत्यक्ष हँड्स-ऑन सराव</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <Languages className="w-4 h-4" />
                <span>माध्यम</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">मराठी आणि हिंदी</div>
              <div className="text-[11px] text-stone-300">१००% सोपी बोलीभाषा</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#register"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Zap className="w-5 h-5 fill-stone-950" />
              <span>{lang === 'mr' ? 'सीट बुक करा (नोंदणी सुरू)' : 'सीट बुक करें (रजिस्ट्रेशन खुला)'}</span>
            </a>

            <a
              href="#pillars"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base transition-all flex items-center gap-2"
            >
              <span>{lang === 'mr' ? '५ मुख्य Pillars पहा' : '5 मुख्य Pillars देखें'}</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. ⭐ COURSE CHE 5 MAIN PILLARS SECTION */}
      <section id="pillars" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#581825] text-xs font-bold border border-amber-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>⭐ अभ्यासक्रमाचा सुवर्ण पाया (Course Framework)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#4A1521]">
            {lang === 'mr' ? 'Course चे ५ मुख्य Pillars' : 'Course के 5 मुख्य Pillars'}
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base mt-2">
            {lang === 'mr'
              ? 'संपूर्ण अभ्यासक्रम लक्षात ठेवण्यासाठी आणि रोजच्या जीवनात वापरण्यासाठी आम्ही तो ५ सुस्पष्ट भागात विभागला आहे:'
              : 'पूरे सिलेबस को आसानी से याद रखने और दैनिक जीवन में उपयोग करने के लिए 5 सुव्यवस्थित चरण:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coursePillars.map((pillar, idx) => (
            <div
              key={pillar.id}
              className={`rounded-2xl border p-6 transition-all duration-300 hover:shadow-md ${pillar.color} flex flex-col justify-between ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black shadow-sm ${pillar.badgeBg}`}>
                    Pillar {pillar.number}
                  </span>
                  <span className="text-xs font-bold text-stone-500 tracking-wider uppercase">
                    {pillar.nameEn}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-serif mb-2 text-stone-900">
                  {lang === 'mr' ? pillar.titleMr : pillar.titleHi}
                </h3>

                {/* Arrow flow */}
                <div className="my-3 px-3 py-2 bg-white/90 rounded-lg border border-stone-200/80 font-mono text-xs font-bold text-stone-800 leading-relaxed">
                  {lang === 'mr' ? pillar.headlineMr : pillar.headlineHi}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                  {lang === 'mr' ? pillar.descMr : pillar.descHi}
                </p>
              </div>

              {/* Progress Steps List */}
              <div className="pt-3 border-t border-stone-200/60 space-y-1.5">
                {pillar.steps.map((st, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-xs text-stone-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{lang === 'mr' ? st.labelMr : st.labelHi}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 🛠️ COURSE MADHYE KITI TOOLS SHIKWAYCHE? (10-12 CORE TOOLS PHILOSOPHY) */}
      <section className="bg-[#FAF3EA] py-16 px-4 sm:px-6 lg:px-8 border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          {/* Philosophy Banner Box */}
          <div className="bg-gradient-to-r from-[#581825] to-[#722031] text-white rounded-2xl p-6 sm:p-8 shadow-lg mb-10 border border-amber-900/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>🛠️ Course मध्ये किती Tools शिकवायचे?</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                  माझा सल्ला: ४०–५० AI tools शिकवू नका!
                </h3>
                <p className="text-sm sm:text-base text-[#F3E5E7] leading-relaxed max-w-3xl">
                  ३०–५०+ नवशिक्यांसाठी (Beginners) <strong className="text-amber-300 font-bold">१०–१२ core tools पुरेसे आहेत.</strong> सर्वसामान्य माणसाला गोंधळात न टाकता ज्या टूल्सने रोजचे काम होते तेच बारकाईने शिकणे हा यशाचा मार्ग आहे.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center shrink-0 min-w-[170px]">
                <div className="text-3xl font-extrabold text-amber-300">१०–१२</div>
                <div className="text-xs text-white font-medium mt-1">निवडक Core Tools</div>
                <div className="text-[10px] text-amber-200/80">१००% कामाचे व प्रॅक्टिकल</div>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                {lang === 'mr' ? 'वर्कशॉपमधील १२ निवडक टूल्सची यादी' : 'वर्कशॉप में सिखाए जाने वाले 12 कोर टूल्स'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                प्रत्येक टूलचा मुख्य उपयोग आणि ते कोणासाठी उपयुक्त आहे ते पहा:
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'all', label: 'सर्व टूल्स (All 12)' },
                { id: 'pro', label: 'ऑफिस & प्रोफेशनल्स' },
                { id: 'research', label: 'रिसर्च & अभ्यास' },
                { id: 'creative', label: 'डिझाईन & व्हिडिओ' },
                { id: 'automation', label: 'ऑटोमेशन' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setToolFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    toolFilter === f.id
                      ? 'bg-[#581825] text-white shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table / Grid for 10-12 Tools */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-900 text-xs sm:text-sm font-bold">
                    <th className="py-3.5 px-4 sm:px-6">Tool नाव</th>
                    <th className="py-3.5 px-4 sm:px-6">मुख्य उपयोग (Primary Use)</th>
                    <th className="py-3.5 px-4 sm:px-6">कोणासाठी (Target Audience)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                  {filteredTools.map((tool, idx) => (
                    <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-stone-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm sm:text-base font-extrabold text-[#581825]">
                            {tool.name}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${tool.badgeColor}`}>
                            {tool.badgeText}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-stone-700 leading-relaxed">
                        {lang === 'mr' ? tool.primaryUseMr : tool.primaryUseHi}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-stone-800 whitespace-nowrap">
                        {lang === 'mr' ? tool.audienceMr : tool.audienceHi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 🎯 SHETI EK "REAL-LIFE CHALLENGE" (CAPSTONE PROJECT BY PROFESSION) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-[#722031] text-xs font-bold border border-rose-200 mb-3">
            <Target className="w-4 h-4 text-rose-600" />
            <span>🎯 शेवटच्या क्लासचा प्रत्यक्ष हँड्स-ऑन सराव</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#4A1521]">
            शेवटी एक &ldquo;Real-Life Challenge&rdquo;
          </h2>
          <p className="text-stone-700 max-w-3xl mx-auto text-sm sm:text-base mt-2 leading-relaxed">
            Course च्या शेवटच्या class मध्ये प्रत्येक participant ला त्याच्या <strong>professionनुसार एक real-life project</strong> दिला जाईल. यामुळे शेवटी <em>&ldquo;AI बद्दल नुसती माहिती मिळाली&rdquo;</em> असे नाही, तर <strong>&ldquo;मी माझ्या रोजच्या जीवनात AI वापरू शकतो&rdquo;</strong> असा प्रत्यक्ष आत्मविश्वास (Confidence) मिळेल! 🚀
          </p>
        </div>

        {/* 8 Professions Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {realLifeChallenges.map((item) => {
            const isSelected = activeChallengeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveChallengeId(item.id)}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#581825] text-white border-[#581825] shadow-md scale-105'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-stone-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-amber-400 text-stone-900' : 'bg-rose-50 text-[#722031]'
                  }`}
                >
                  {renderChallengeIcon(item.icon, 'w-4 h-4')}
                </div>
                <div className="font-bold text-[11px] sm:text-xs leading-tight line-clamp-2">
                  {lang === 'mr' ? item.roleMr.split(' (')[0] : item.roleHi.split(' (')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Challenge Detailed Showcase Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#581825] text-amber-300 flex items-center justify-center shadow-inner">
                {renderChallengeIcon(currentChallenge.icon, 'w-6 h-6')}
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  Real-Life Project Track
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900 mt-0.5">
                  {lang === 'mr' ? currentChallenge.roleMr : currentChallenge.roleHi}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-stone-500 font-medium">वापरली जाणारी टूल्स:</span>
              {currentChallenge.toolsUsed.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Pipeline Visualization */}
          <div className="my-6">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              {lang === 'mr' ? 'प्रोजेक्ट वर्कफ्लो पायऱ्या (Step-by-Step Pipeline):' : 'प्रोजेक्ट वर्कफ्लो चरण:'}
            </div>

            <div className="flex flex-wrap items-center gap-2 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80">
              {currentChallenge.pipeline.map((step, sIdx) => (
                <React.Fragment key={sIdx}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300/80 text-xs sm:text-sm font-bold text-stone-900 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-[#581825] text-white text-[10px] flex items-center justify-center font-mono">
                      {sIdx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                  {sIdx < currentChallenge.pipeline.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-amber-700 shrink-0 hidden sm:inline" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-stone-700 mt-2">
              👉 {lang === 'mr' ? currentChallenge.pipelineTextMr : currentChallenge.pipelineTextHi}
            </p>
          </div>

          {/* Outcome & Confidence */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs sm:text-sm leading-relaxed mb-6">
            <strong>🎯 हा प्रोजेक्ट पूर्ण केल्यावर मिळणारा फायदा: </strong>
            {lang === 'mr' ? currentChallenge.outcomeMr : currentChallenge.outcomeHi}
          </div>

          {/* Live Hands-On Prompt Template */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>नमुना चॅलेंज प्रॉम्प्ट (Live Challenge Prompt):</span>
              </span>

              <button
                onClick={() => copyPrompt(currentChallenge.id, currentChallenge.samplePrompt)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-xs font-bold text-stone-800 shadow-xs transition-all"
              >
                {copiedPromptId === currentChallenge.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">कॉपी झाले!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>प्रॉम्प्ट कॉपी करा</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm font-mono bg-white p-3.5 rounded-xl border border-stone-200 text-stone-800 leading-relaxed">
              &ldquo;{currentChallenge.samplePrompt}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 5. WORKSHOP REGISTRATION & OFFER SECTION */}
      <section id="register" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#581825] to-[#36111B] rounded-3xl text-white shadow-xl overflow-hidden border border-amber-900/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12">
            {/* Left Column: Workshop Inclusions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-300/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>मर्यादित २५ जागा • नावनोंदणी सुरू</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                {lang === 'mr' ? '१ डे AI कार्यशाळेसाठी आजच सीट बुक करा' : '1 डे AI वर्कशॉप के लिए आज ही सीट बुक करें'}
              </h2>

              <p className="text-sm sm:text-base text-[#F3E5E7] leading-relaxed">
                {lang === 'mr'
                  ? '५ Pillars, १०-१२ Core Tools चे प्रत्यक्ष प्रशिक्षण, तुमच्या क्षेत्राचा Real-Life Project सराव आणि अधिकृत डिजिटल प्रमाणपत्र.'
                  : '5 Pillars, 10-12 Core Tools का हैंड्स-ऑन प्रैक्टिकल, रियल-लाइफ प्रोजेक्ट और सर्टिफिकेशन।'}
              </p>

              {/* Pricing Box */}
              <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-300">
                    ₹{courseData.config?.fees || 1499}/-
                  </span>
                  <span className="text-lg text-stone-300 line-through">
                    ₹{courseData.config?.originalFees || 4999}/-
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-xs">
                    ७०% सवलत (Early Bird)
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-2">
                  *आगामी बॅचमध्ये फक्त {courseData.config?.seatsPerBatch || 25} जागा उपलब्ध आहेत. टोकन रक्कम ₹{courseData.config?.advanceFee || 499}/- भरून सीट आरक्षित करा.
                </p>

                {/* Show upcoming batches if available */}
                {courseData.batches && courseData.batches.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                    <div className="text-[11px] font-semibold text-amber-200">
                      📅 उपलब्ध आगामी बॅचेस:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {courseData.batches.map((batch) => (
                        <div
                          key={batch.id}
                          className="bg-black/20 p-2 rounded-lg border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-amber-300">{batch.title}</div>
                            <div className="text-[10px] text-stone-300">
                              {batch.date} • {batch.time}
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded">
                            {Math.max(0, batch.seatsTotal - batch.seatsBooked)} जागा शिल्लक
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>५ Pillars वर आधारित संपूर्ण रेडीमेड प्रॉम्प्ट बँक मोफत</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>१०-१२ कोर टूल्सचे चीट-शीट्स (Cheat Sheets) व नोट्स</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>प्रत्येक प्रोफेशनसाठी Real-Life Challenge प्रोजेक्ट गाईड</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>सहभाग प्रमाणपत्र (Certificate of Completion)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Registration Form */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 text-stone-800 shadow-lg">
              <h3 className="text-xl font-serif font-bold text-[#4A1521] mb-1">
                {lang === 'mr' ? 'थेट नावनोंदणी फॉर्म' : 'रजिस्ट्रेशन फॉर्म'}
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                {lang === 'mr' ? 'माहिती भरा आणि WhatsApp वर कन्फर्मेशन मिळवा.' : 'विवरण भरें और तुरंत WhatsApp पर पुष्टि पाएं।'}
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'mr' ? 'पूर्ण नाव *' : 'पूरा नाम *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. राहुल पाटील / स्मिता जोशी"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#722031] focus:ring-2 focus:ring-[#722031]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'mr' ? 'WhatsApp मोबाईल नंबर *' : 'WhatsApp मोबाइल नंबर *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="१० अंकी मोबाईल नंबर (उदा. 9876543210)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#722031] focus:ring-2 focus:ring-[#722031]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'mr' ? 'तुमचे क्षेत्र (Profession)' : 'आपका क्षेत्र (Profession)'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#722031]"
                    >
                      <option value="Teacher">शिक्षक (Teacher)</option>
                      <option value="Business Owner">दुकानदार / व्यावसायिक (Business Owner)</option>
                      <option value="Working Professional">ऑफिस कर्मचारी (Working Professional)</option>
                      <option value="Homemaker / Parent">गृहिणी / पालक (Homemaker / Parent)</option>
                      <option value="Government Employee">शासकीय कर्मचारी (Government Employee)</option>
                      <option value="Freelancer">फ्रीलान्सर (Freelancer)</option>
                      <option value="Entrepreneur">स्टार्टअप / उद्योजक (Entrepreneur)</option>
                      <option value="General 40+">ज्येष्ठ नागरिक / ४०+ नागरिक (General 40+)</option>
                      <option value="Student">विद्यार्थी (Student)</option>
                      <option value="Other">इतर (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {lang === 'mr' ? 'पसंतीची भाषा' : 'पसंदीदा भाषा'}
                    </label>
                    <select
                      value={formData.langPref}
                      onChange={(e) => setFormData({ ...formData, langPref: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-[#722031]"
                    >
                      <option value="मराठी">मराठी</option>
                      <option value="हिंदी">हिंदी</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {lang === 'mr' ? 'काही प्रश्न किंवा अपेक्षा?' : 'कोई सवाल या नोट?'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="उदा. रविवार बॅच वेळ, लॅपटॉप आणायचा का..."
                    className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:border-[#722031]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{lang === 'mr' ? 'WhatsApp वर नाव नोंदवा' : 'WhatsApp पर रजिस्टर करें'}</span>
                </button>

                <p className="text-[11px] text-center text-stone-500">
                  🔒 तुमची माहिती १००% सुरक्षित आहे. स्पॅम मेसेज पाठवले जात नाहीत.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQS SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-[#4A1521] mb-8">
          {lang === 'mr' ? 'नेहमी विचारले जाणारे प्रश्न (FAQs)' : 'अक्सर पूछे जाने वाले सवाल (FAQs)'}
        </h2>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h4 className="font-bold text-stone-900 text-base mb-1">
              {lang === 'mr'
                ? '१. मला कम्प्युटर किंवा कोडिंग येत नाही, मी हा वर्कशॉप करू शकतो का?'
                : '1. मुझे कंप्यूटर या कोडिंग नहीं आती, क्या मैं यह वर्कशॉप कर सकता हूँ?'}
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? 'होय, नक्कीच! हा वर्कशॉप अशा लोकांसाठीच डिझाईन केला आहे ज्यांना कोडिंगची कोणतीही माहिती नाही. फक्त एक साधा स्मार्टफोन किंवा लॅपटॉप वापरता येत असला तरी तुम्ही हे सहज शिकू शकता.'
                : 'बिल्कुल! यह वर्कशॉप विशेष रूप से गैर-तकनीकी लोगों के लिए डिजाइन की गई है। अगर आप स्मार्टफोन इस्तेमाल कर लेते हैं, तो आप इसे आसानी से सीख सकते हैं।'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h4 className="font-bold text-stone-900 text-base mb-1">
              {lang === 'mr'
                ? '२. ४०-५० टूल्स ऐवजी १०-१२ कोर टूल्स का?'
                : '2. 40-50 टूल्स के बजाय 10-12 कोर टूल्स क्यों?'}
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? 'अनेक कोर्सेसमध्ये ५० टूल्सची नावे सांगून विद्यार्थ्यांचा गोंधळ उडवला जातो. प्रत्यक्षात दैनंदिन कामासाठी ChatGPT, Gemini, Copilot, Canva, NotebookLM सारखी १०-१२ टूल्स १००% पुरेशी आहेत. आमचा भर प्रत्यक्ष कामावर आहे, दिखाव्यावर नाही.'
                : 'अधिकांश कोर्सेज में बहुत सारे टूल्स दिखाकर भ्रमित कर दिया जाता है। वास्तव में रोजमर्रा के काम के लिए 10-12 कोर टूल्स ही सर्वोत्तम परिणाम देते हैं।'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h4 className="font-bold text-stone-900 text-base mb-1">
              {lang === 'mr'
                ? '३. Real-Life Challenge काय आहे?'
                : '3. Real-Life Challenge क्या है?'}
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? 'क्लास संपण्यापूर्वी शिक्षक, दुकानदार, गृहिणी किंवा नोकरदार - प्रत्येकाला त्याच्या रोजच्या कामाशी संबंधित एक प्रत्यक्ष टास्क दिली जाईल आणि ती AI च्या मदतीने पूर्ण करून घेतली जाईल. यामुळे आत्मविश्वास १००% वाढतो.'
                : 'क्लास समाप्त होने से पहले आपके पेशे के अनुसार एक लाइव प्रोजेक्ट AI से करवाया जाएगा ताकि आप घर जाकर तुरंत उसका इस्तेमाल कर सकें।'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
