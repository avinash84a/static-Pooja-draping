'use client';

import React, { useState } from 'react';
import { X, Check, RotateCcw, AlertCircle } from 'lucide-react';

export interface WorkshopConfig {
  title: string;
  instructor: string;
  nextDate: string;
  time: string;
  fee: string;
  seatsLeft: string;
  venue: string;
  suitableFor: string;
  training: string;
}

interface EditWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WorkshopConfig;
  onSave: (newConfig: WorkshopConfig) => void;
  defaultConfig: WorkshopConfig;
}

export default function EditWorkshopModal({
  isOpen,
  onClose,
  config,
  onSave,
  defaultConfig,
}: EditWorkshopModalProps) {
  const [formData, setFormData] = useState<WorkshopConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof WorkshopConfig, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setFormData({ ...defaultConfig });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#EADBCE] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#3B1F25]">
              वर्कशॉप तपशील संपादित करा (Edit Workshop Details)
            </h3>
            <p className="text-xs text-gray-500">
              पुढील वर्कशॉपची तारीख, वेळ, आणि फी तात्काळ अपडेट करा
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              वर्कशॉप नाव (Title)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                प्रशिक्षिका (Instructor)
              </label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                वर्कशॉप फी (Workshop Fee)
              </label>
              <input
                type="text"
                value={formData.fee}
                onChange={(e) => handleChange('fee', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                पुढील तारीख (Next Batch Date)
              </label>
              <input
                type="text"
                value={formData.nextDate}
                onChange={(e) => handleChange('nextDate', e.target.value)}
                placeholder="उदा. आगामी शनिवार / रविवार"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                वेळ (Time)
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                placeholder="सकाळी 10:30 ते संध्याकाळी 5:30"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              उपलब्ध जागा / बॅच माहिती (Seats / Batch Note)
            </label>
            <input
              type="text"
              value={formData.seatsLeft}
              onChange={(e) => handleChange('seatsLeft', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              प्रशिक्षण तपशील (Training Highlight)
            </label>
            <textarea
              rows={2}
              value={formData.training}
              onChange={(e) => handleChange('training', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ठिकाण (Venue)
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F] focus:border-transparent outline-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              डीफॉल्ट रिसेट करा
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#8B1E3F] hover:bg-[#721531] rounded-lg shadow-sm"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> सेव्ह झाले!
                  </>
                ) : (
                  'बदल सेव्ह करा'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
