import React, { useState } from 'react';
import { siteData } from '../data/siteData';
import { HelpCircle, ChevronDown, MessageCircleQuestion } from 'lucide-react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 md:py-24 bg-white text-slate-900 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-red-600" />
            <span>Tanya Jawab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Informasi seputar keanggotaan alumni, peran organisasi, dan kegiatan PPI di Kabupaten Soppeng.
          </p>
        </div>

        <div className="space-y-3.5">
          {siteData.faq.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all duration-200 bg-[#F8FAFC]"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-900 hover:text-red-600 transition-colors focus:outline-none"
                >
                  <span className="pr-4">{item.tanya}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-red-600 text-white rotate-180'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60" data-placeholder="true">
                    {item.jawab}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
