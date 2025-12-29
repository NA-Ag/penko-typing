
import React, { useEffect, useState, useRef } from 'react';
import { LanguageConfig, WordObject, Language, InterfaceLanguage } from '../types';
import { decomposeHangul, UI_STRINGS } from '../constants';
import VirtualKeyboard from './VirtualKeyboard';

interface GameEngineProps {
  language: LanguageConfig;
  showHands: boolean;
  uiLanguage: InterfaceLanguage;
  onGameOver: (score: number, wpm: number) => void;
  onExit: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ language, showHands, uiLanguage, onGameOver, onExit }) => {
  const [words, setWords] = useState<WordObject[]>([]);
  const [score, setScore] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Game state
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [needsShift, setNeedsShift] = useState(false);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  
  // Ref for focus and input capture
  const inputRef = useRef<HTMLInputElement>(null);

  const ui = UI_STRINGS[uiLanguage];

  // Initialize words
  useEffect(() => {
    // Generate 75 words for a session
    const initialWords = Array(75).fill(null).map((_, i) => {
      const originalText = language.sampleWords[Math.floor(Math.random() * language.sampleWords.length)];
      // For Korean, we decompose the text into Jamo so the user types individual keys
      const textToType = language.id === Language.KOREAN ? decomposeHangul(originalText) : originalText;
      
      return {
        id: `w-${i}`,
        text: textToType,
        display: originalText,
        typed: '',
        isCompleted: false,
        isError: false,
        isSuccess: false
      };
    });
    setWords(initialWords);
    inputRef.current?.focus();
    // Reset state on language change
    setScore(0);
    setTypedChars(0);
    setStartTime(null);
  }, [language]);

  // Check for Game Over condition
  useEffect(() => {
    if (words.length > 0 && words.every(w => w.isCompleted)) {
       const durationMin = (Date.now() - (startTime || Date.now())) / 60000;
       const wpm = Math.round((typedChars / 5) / (durationMin || 1));
       // Small delay to let the user see the last success
       setTimeout(() => {
         onGameOver(score, wpm);
       }, 500);
    }
  }, [words, startTime, typedChars, score, onGameOver]);

  // Determine current active character and visual hints
  useEffect(() => {
    const currentWord = words.find(w => !w.isCompleted);
    if (currentWord) {
      const nextChar = currentWord.text[currentWord.typed.length];
      
      // Find the key code for this char
      // 1. Exact match (lowercase/base)
      let mapping = language.mappings.find(m => m.char === nextChar);
      let shiftRequired = false;

      // 2. Shift match (uppercase/symbol)
      if (!mapping) {
        mapping = language.mappings.find(m => m.shiftChar === nextChar);
        if (mapping) shiftRequired = true;
      }
      
      // 3. Space
      if (!mapping && nextChar === ' ') {
         setActiveCode('Space');
         setNeedsShift(false);
      } else {
         setActiveCode(mapping ? mapping.code : null);
         setNeedsShift(shiftRequired);
      }

    } else {
      setActiveCode(null);
      setNeedsShift(false);
    }
  }, [words, language]);

  // Timer for WPM
  useEffect(() => {
    if (!startTime && typedChars > 0) {
      setStartTime(Date.now());
    }
  }, [typedChars, startTime]);

  // Unified input processing logic
  const processInput = (code: string, key: string | null, isShift: boolean, isVirtualTap: boolean = false) => {
    
    // Visual feedback
    setLastPressed(code);
    setTimeout(() => setLastPressed(null), 150);

    setWords(prev => {
      const newWords = [...prev];
      const activeIndex = newWords.findIndex(w => !w.isCompleted);
      
      if (activeIndex === -1) {
        return prev;
      }

      const activeWord = newWords[activeIndex];
      const nextCharNeeded = activeWord.text[activeWord.typed.length];
      
      let isCorrect = false;

      // Logic Split:
      // 1. Physical Keyboard: We check 'key' (the character produced) first for direct match
      // 2. If no direct match, fall back to positional checks for learning/virtual taps

      // Direct character match (Physical Keyboard with correct layout)
      if (!isVirtualTap && key === nextCharNeeded) {
        isCorrect = true;
      }
      // Positional/Simulation Logic (for virtual taps or learning mode)
      else {
        // Determine what the target CODE should be
        let targetMapping = language.mappings.find(m => m.char === nextCharNeeded);
        let requiresShift = false;

        if (!targetMapping) {
            targetMapping = language.mappings.find(m => m.shiftChar === nextCharNeeded);
            requiresShift = true;
        }

        // Special case for Space
        if (nextCharNeeded === ' ' && code === 'Space') {
           isCorrect = true;
        }
        // Check Mapping
        else if (targetMapping && code === targetMapping.code) {
           // If it's a virtual tap, we accept the correct KEY POSITION regardless of shift state
           // This provides a better mobile experience (tactile memory)
           if (isVirtualTap) {
             isCorrect = true;
           } else {
             // Physical keyboard must respect shift
             if (requiresShift && isShift) isCorrect = true;
             else if (!requiresShift && !isShift) isCorrect = true;
           }
        }
      }
      
      if (isCorrect) {
        // Correct Hit - advance to next letter
        const newTyped = activeWord.typed + nextCharNeeded;
        const isWordComplete = newTyped === activeWord.text;

        // Create new object instead of mutating
        newWords[activeIndex] = {
          ...activeWord,
          typed: newTyped,
          isCompleted: isWordComplete,
          isError: false,
          isSuccess: true
        };

        setTypedChars(c => c + 1);
        setScore(s => s + 10 + (isWordComplete ? 50 : 0));

        // Clear green flash after 300ms (slightly longer than transition)
        setTimeout(() => {
          setWords(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(w => w.id === activeWord.id);
            if (idx !== -1 && updated[idx]) {
              updated[idx] = { ...updated[idx], isSuccess: false };
            }
            return updated;
          });
        }, 300);

      } else {
        // Mistake - don't advance
        // Create new object instead of mutating
        newWords[activeIndex] = {
          ...activeWord,
          isError: true,
          isSuccess: false
        };

        setScore(s => Math.max(0, s - 5));

        // Clear red shake after 500ms
        setTimeout(() => {
          setWords(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(w => w.id === activeWord.id);
            if (idx !== -1 && updated[idx]) {
              updated[idx] = { ...updated[idx], isError: false };
            }
            return updated;
          });
        }, 500);
      }

      return newWords;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignore modifiers only
    if (['ShiftLeft', 'ShiftRight', 'ControlLeft', 'AltLeft'].includes(e.code)) {
       setLastPressed(e.code);
       setTimeout(() => setLastPressed(null), 200);
       return;
    }
    processInput(e.code, e.key, e.shiftKey, false);
  };

  const handleVirtualTap = (code: string) => {
    // For virtual taps, key char is null (we rely on code match), shift is ignored/auto-handled
    processInput(code, null, false, true);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Only focus input if we didn't click on a virtual key (which stops propagation)
    // This allows virtual keyboard use on mobile without popping up OS keyboard
    inputRef.current?.focus();
  };

  const activeWordIndex = words.findIndex(w => !w.isCompleted);
  const safeActiveIndex = activeWordIndex === -1 ? words.length : activeWordIndex;
  
  const cardWidth = 280; 
  const cardMargin = 40; 
  const totalCardWidth = cardWidth + cardMargin;
  const centerOffset = `calc(50vw - ${cardWidth/2}px - ${safeActiveIndex * totalCardWidth}px)`;

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 overflow-hidden relative" onClick={handleContainerClick}>
      
      <input 
        ref={inputRef}
        className="opacity-0 absolute top-0 left-0 h-0 w-0"
        onKeyDown={handleKeyDown}
        autoFocus
        autoComplete="off"
        onBlur={(e) => setTimeout(() => e.target.focus(), 10)}
      />

      {/* HUD - Fixed Top */}
      <div className="flex-none flex justify-between items-center px-6 py-3 bg-slate-800 border-b-4 border-cyan-700 z-40 shadow-xl">
        <div className="flex items-center gap-6">
            <div className="text-2xl font-retro text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
            {ui.score} <span className="text-white ml-2">{score}</span>
            </div>
            <div className="text-2xl font-retro text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]">
            {ui.wpm} <span className="text-white ml-2">
                {startTime ? Math.round((typedChars / 5) / ((Date.now() - startTime) / 60000)) : 0}
            </span>
            </div>
        </div>
        <button 
          onClick={onExit}
          className="px-6 py-2 bg-red-900/80 border-2 border-red-500 text-red-200 hover:bg-red-600 hover:text-white font-bold rounded shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all font-vt323 text-xl"
        >
          {ui.quit}
        </button>
      </div>

      {/* Main Game Area - Fills remaining space */}
      <div className="flex-1 relative flex flex-col justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)', 
               backgroundSize: '60px 60px',
               transform: 'perspective(500px) rotateX(20deg) scale(1.2)'
             }}>
        </div>

        {/* Floor Line */}
        <div className="absolute top-[60%] left-0 right-0 h-1 bg-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.4)] z-0"></div>

        {/* Penko Avatar */}
        <div className="absolute left-10 md:left-24 top-[60%] transform -translate-y-[80%] z-20">
            <div className={`w-24 h-24 relative transition-transform duration-75 ${lastPressed ? 'translate-y-1' : ''}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-white w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                   <path d="M6 2C4 2 3 3 3 5V19C3 21 4 22 6 22H18C20 22 21 21 21 19V5C21 3 20 2 18 2H6M8 6H10V8H8V6M14 6H16V8H14V6M11 10H13V12H11V10M6 14H18V18H6V14Z" />
                   <rect x="9" y="8" width="2" height="2" className="text-black fill-current" />
                   <rect x="13" y="8" width="2" height="2" className="text-black fill-current" />
                   <rect x="10" y="11" width="4" height="2" className="text-amber-400 fill-current" />
                   {lastPressed && (
                      <circle cx="24" cy="12" r="8" className="text-cyan-400 fill-current animate-ping opacity-75" />
                   )}
                </svg>
            </div>
        </div>

        {/* Word Track */}
        <div className="absolute top-[60%] -translate-y-[85%] left-0 flex items-end transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform h-48"
             style={{ transform: `translateX(${centerOffset})` }}>
           
           {words.map((word, idx) => {
             const isActive = idx === activeWordIndex;
             const isDone = idx < activeWordIndex;

             return (
               <div key={word.id} 
                    className={`
                      relative flex-shrink-0 mx-[20px] transition-all duration-300 flex flex-col justify-end w-[280px]
                      ${isActive ? 'z-10' : 'opacity-40 grayscale blur-[1px]'}
                      ${isDone ? 'opacity-0' : ''} 
                    `}
               >
                 {/* Floating Target Hint (Attached to Card) */}
                 {isActive && (
                    <div className="absolute -top-16 left-0 right-0 flex justify-center animate-bounce-slow z-30">
                         <div className="bg-amber-500 text-slate-900 px-3 py-1 rounded-full font-bold font-retro text-sm border-2 border-white shadow-lg">
                            TYPE: {word.text[word.typed.length] === ' ' ? 'SPACE' : word.text[word.typed.length]}
                         </div>
                    </div>
                 )}

                 <div className={`
                    h-40 rounded-xl border-4 shadow-xl flex flex-col items-center justify-center p-4
                    transition-colors duration-200
                    ${word.isSuccess ? '!border-green-400 !bg-green-900/50 !shadow-[0_0_40px_rgba(34,197,94,0.6)] animate-success' :
                      word.isError ? '!border-red-500 !bg-red-900 !shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-[shake_0.4s_ease-in-out]' :
                      isActive ? 'bg-slate-800 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.2)]' : 'bg-slate-800/80 border-slate-600'}
                  `}>
                    {/* Main Text */}
                    <div className="text-4xl font-bold font-mono tracking-wider text-center leading-none mb-2" dir={language.isRTL ? "rtl" : "ltr"}>
                        <span className="text-cyan-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{word.typed}</span>
                        <span className={`inline-block border-b-4 min-w-[20px] ${word.isError ? "text-red-400 border-red-500" : "text-white border-amber-400 bg-white/10 rounded px-1"}`}>
                            {word.text.slice(word.typed.length, word.typed.length + 1)}
                        </span>
                        <span className="text-slate-500">
                            {word.text.slice(word.typed.length + 1)}
                        </span>
                    </div>

                    {/* Subtext */}
                    {language.id === Language.KOREAN && (
                       <div className="text-lg text-slate-400 font-retro mt-2">
                          {word.display}
                       </div>
                    )}
                 </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* Bottom Keyboard Area - Fixed Height */}
      <div className="flex-none bg-slate-900 border-t-4 border-slate-800 relative z-30 w-full flex justify-center">
         <div className="w-full max-w-6xl">
            <VirtualKeyboard 
                mappings={language.mappings} 
                activeKeyCode={activeCode} 
                lastPressedCode={lastPressed}
                needsShift={needsShift}
                showHands={showHands}
                onKeyTap={handleVirtualTap}
            />
         </div>
      </div>
      
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60% { transform: translate3d(6px, 0, 0); }
        }
        @keyframes success-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        .animate-success {
          animation: success-pulse 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default GameEngine;
