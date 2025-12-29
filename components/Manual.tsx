
import React from 'react';
import { InterfaceLanguage } from '../types';
import { UI_STRINGS, MANUAL_CONTENT } from '../constants';

interface ManualProps {
  uiLanguage: InterfaceLanguage;
  onClose: () => void;
}

const Manual: React.FC<ManualProps> = ({ uiLanguage, onClose }) => {
  const ui = UI_STRINGS[uiLanguage];
  const content = MANUAL_CONTENT[uiLanguage];

  const isRTL = [InterfaceLanguage.ARABIC, InterfaceLanguage.HEBREW].includes(uiLanguage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="bg-[#e2e8f0] text-slate-900 w-full max-w-2xl h-[80vh] overflow-y-auto rounded shadow-[10px_10px_0_#0f172a] border-4 border-slate-800 flex flex-col relative font-vt323"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 border-b-4 border-slate-900 sticky top-0 z-10 flex justify-between items-center shrink-0">
           <h2 className="text-3xl font-retro text-amber-400">{ui.manualTitle}</h2>
           <button onClick={onClose} className="text-white hover:text-red-400 font-bold text-xl px-2">X</button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 text-lg md:text-xl leading-relaxed">
           
           <section>
              <h3 className="text-2xl font-bold mb-2 uppercase border-b-2 border-slate-400 pb-1">{content.welcomeTitle}</h3>
              <p>{content.welcomeText}</p>
           </section>

           <section>
              <h3 className="text-2xl font-bold mb-2 uppercase border-b-2 border-slate-400 pb-1">{content.howToPlayTitle}</h3>
              <ul className={`list-disc space-y-2 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                 {content.howToPlaySteps.map((step, i) => (
                    <li key={i}>{step}</li>
                 ))}
              </ul>
           </section>

           <section>
              <h3 className="text-2xl font-bold mb-2 uppercase border-b-2 border-slate-400 pb-1">{content.tipsTitle}</h3>
              <ul className={`list-disc space-y-2 ${isRTL ? 'pr-6' : 'pl-6'}`}>
                 {content.tipsSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                 ))}
              </ul>
           </section>

           <div className="flex justify-center mt-8">
              <div className="bg-slate-800 text-cyan-400 px-4 py-2 rounded text-sm font-retro">
                 {content.footerInfo}
              </div>
           </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-200 border-t-4 border-slate-800 sticky bottom-0 text-center shrink-0">
            <button 
              onClick={onClose}
              className="px-8 py-2 bg-slate-800 text-white font-retro hover:bg-slate-700 active:translate-y-1 shadow-[4px_4px_0_#94a3b8]"
            >
              {ui.manualClose}
            </button>
        </div>

      </div>
    </div>
  );
};

export default Manual;
