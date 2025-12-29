
import React, { useEffect, useState } from 'react';
import { KeyMapping } from '../types';
import HandOverlay from './HandOverlay';

interface VirtualKeyboardProps {
  mappings: KeyMapping[];
  activeKeyCode: string | null;
  lastPressedCode: string | null;
  needsShift: boolean;
  showHands: boolean; // Prop to toggle hand guides
  onKeyTap: (code: string) => void;
}

const ROWS = [
  ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal'],
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight']
];

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ mappings, activeKeyCode, lastPressedCode, needsShift, showHands, onKeyTap }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device has a coarse pointer (touch)
    const checkMobile = () => {
       const hasTouch = window.matchMedia('(pointer: coarse)').matches;
       setIsMobile(hasTouch);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getMapping = (code: string) => mappings.find(m => m.code === code);

  const handleTap = (e: React.TouchEvent | React.MouseEvent, code: string) => {
    if (!isMobile) return;
    
    // Prevent default to stop scrolling, zooming, or passing focus to underlying elements
    e.preventDefault();
    e.stopPropagation();
    onKeyTap(code);
  };

  return (
    <div className="w-full p-2 pb-0 relative">
      
      {/* Hand Overlay: Positioned absolute on top of the keyboard content. Pointer events none so clicks go through. */}
      {showHands && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
           <HandOverlay activeCode={activeKeyCode} />
        </div>
      )}

      <div className="flex flex-col gap-1.5 md:gap-2 relative z-10 pb-4 pt-2">
        {ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 md:gap-2">
            {row.map((code) => {
              const isShiftKey = code.includes('Shift');
              const mapping = getMapping(code);
              const isActive = activeKeyCode === code || (isShiftKey && needsShift);
              const isPressed = lastPressedCode === code || (isShiftKey && lastPressedCode?.includes('Shift'));
              
              let bgClass = "bg-slate-800 border-slate-700 shadow-sm";
              let textClass = "text-cyan-500";

              if (isActive) {
                // Highlight target key in Orange/Yellow for visibility
                bgClass = "bg-amber-600 border-amber-400 transform translate-y-[1px] shadow-[0_0_15px_rgba(245,158,11,0.6)] z-20";
                textClass = "text-white";
              } else if (isPressed) {
                // User pressed
                bgClass = "bg-cyan-600 border-cyan-400 transform translate-y-[2px]";
                textClass = "text-white";
              }
              
              const widthClass = isShiftKey ? "w-20 md:w-32" : "w-9 md:w-16 lg:w-20";
              const heightClass = "h-10 md:h-14 lg:h-16";
              
              const baseClasses = `
                relative flex flex-col items-center justify-center 
                ${widthClass} ${heightClass}
                border-b-4 border-r-2 border-l-2 border-t rounded-md
                transition-all duration-75 select-none
                ${bgClass}
                ${isMobile && !isShiftKey ? 'cursor-pointer active:scale-95 touch-manipulation' : 'cursor-default'}
              `;

              return (
                <div 
                  key={code} 
                  className={baseClasses}
                  onTouchStart={(e) => handleTap(e, code)}
                  onMouseDown={(e) => isMobile ? handleTap(e, code) : undefined}
                >
                  {isShiftKey ? (
                     <span className={`text-[10px] md:text-sm font-bold ${textClass}`}>SHIFT</span>
                  ) : (
                    <>
                      {/* QWERTY/Layout Label (Small) */}
                      <span className={`absolute top-1 left-1.5 text-[8px] md:text-[10px] uppercase opacity-40 ${textClass}`}>
                        {mapping?.label || code.replace('Key', '')}
                      </span>
                      
                      {/* Target Char (Large) */}
                      <span className={`text-sm md:text-2xl font-bold mb-0.5 ${textClass}`}>
                        {mapping?.char || ''}
                      </span>
                      
                      {/* Shift Char (Tiny) */}
                      {mapping?.shiftChar && (
                        <span className={`absolute bottom-1 right-1.5 text-[8px] md:text-[10px] opacity-60 ${textClass}`}>
                          {mapping.shiftChar}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {/* Space Bar */}
        <div className="flex justify-center mt-1 mb-6">
           <div 
              className={`
                w-64 md:w-96 h-10 md:h-12 border-b-4 border-r-2 border-l-2 border-t rounded-md bg-slate-800 border-slate-700
                flex items-center justify-center text-slate-500 text-xs tracking-[0.2em] font-bold
                ${lastPressedCode === 'Space' ? 'bg-cyan-700 border-cyan-500 text-white transform translate-y-[2px]' : ''}
                ${activeKeyCode === 'Space' ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]' : ''}
                ${isMobile ? 'cursor-pointer active:scale-95 touch-manipulation' : ''}
              `}
              onTouchStart={(e) => handleTap(e, 'Space')}
              onMouseDown={(e) => isMobile ? handleTap(e, 'Space') : undefined}
           >
             SPACE
           </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
