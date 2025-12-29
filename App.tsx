import React, { useState, useEffect } from 'react';
import { GameState, Language, LanguageConfig, LeaderboardEntry, InterfaceLanguage } from './types';
import { LANGUAGES, SORTED_LANGUAGES, UI_STRINGS } from './constants';
import GameEngine from './components/GameEngine';
import Leaderboard from './components/Leaderboard';
import Manual from './components/Manual';

const STORAGE_KEY = 'penko_leaderboard';

// Language names for UI dropdown
const INTERFACE_LANGUAGE_NAMES: Record<InterfaceLanguage, string> = {
  [InterfaceLanguage.ENGLISH]: 'English',
  [InterfaceLanguage.SPANISH]: 'Español',
  [InterfaceLanguage.FRENCH]: 'Français',
  [InterfaceLanguage.GERMAN]: 'Deutsch',
  [InterfaceLanguage.ITALIAN]: 'Italiano',
  [InterfaceLanguage.PORTUGUESE]: 'Português',
  [InterfaceLanguage.RUSSIAN]: 'Русский',
  [InterfaceLanguage.KOREAN]: '한국어',
  [InterfaceLanguage.JAPANESE]: '日本語',
  [InterfaceLanguage.CHINESE]: '中文',
  [InterfaceLanguage.ARABIC]: 'العربية',
  [InterfaceLanguage.HEBREW]: 'עברית'
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedLang, setSelectedLang] = useState<Language>(Language.ENGLISH);
  const [uiLang, setUiLang] = useState<InterfaceLanguage>(InterfaceLanguage.ENGLISH);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const [stats, setStats] = useState({ score: 0, wpm: 0 });
  const [showHands, setShowHands] = useState(true);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');

  const ui = UI_STRINGS[uiLang];

  // Load leaderboard on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLeaderboard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load leaderboard");
      }
    }
  }, []);

  const saveScore = () => {
    if (!playerName) return;
    
    const newEntry: LeaderboardEntry = {
      name: playerName.toUpperCase().slice(0, 3), // Arcade style 3 letters
      score: stats.score,
      wpm: stats.wpm,
      date: Date.now(),
      languageId: selectedLang
    };

    const updated = [...leaderboard, newEntry];
    setLeaderboard(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setGameState(GameState.LEADERBOARD);
  };

  const startGame = () => {
      setPlayerName('');
      setGameState(GameState.PLAYING);
  };
  
  const handleGameOver = (score: number, wpm: number) => {
    setStats({ score, wpm });
    setGameState(GameState.GAME_OVER);
  };

  const toMenu = () => setGameState(GameState.MENU);

  return (
    <div className="h-full bg-slate-900 text-cyan-400 font-mono flex flex-col relative z-10 overflow-hidden">
      
      {/* Top Bar for UI Language (Only show on MENU) */}
      {gameState === GameState.MENU && (
        <div className="absolute top-4 right-4 z-50">
           <div className="relative">
             <button
               onClick={() => setLangDropdownOpen(!langDropdownOpen)}
               className="flex items-center gap-2 px-3 py-2 bg-slate-800/90 border border-cyan-500/50 rounded text-xs font-bold text-cyan-300 hover:bg-slate-700 hover:border-cyan-400 transition-all shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
             >
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
               </svg>
               <span className="tracking-wide">{INTERFACE_LANGUAGE_NAMES[uiLang]}</span>
               <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
             </button>

             {/* Dropdown Menu */}
             {langDropdownOpen && (
               <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-cyan-500/50 rounded shadow-[4px_4px_0_rgba(0,0,0,0.5)] overflow-hidden max-h-80 overflow-y-auto custom-scrollbar">
                 {Object.values(InterfaceLanguage).map((lang) => (
                   <button
                     key={lang}
                     onClick={() => {
                       setUiLang(lang);
                       setLangDropdownOpen(false);
                     }}
                     className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                       uiLang === lang
                         ? 'bg-cyan-600 text-white'
                         : 'text-cyan-300 hover:bg-slate-700 hover:text-cyan-100'
                     }`}
                   >
                     {INTERFACE_LANGUAGE_NAMES[lang]}
                   </button>
                 ))}
               </div>
             )}
           </div>
        </div>
      )}

      {/* Manual Overlay (handled independently) */}
      {gameState === GameState.MANUAL && (
        <Manual uiLanguage={uiLang} onClose={toMenu} />
      )}

      {/* Main Content Switch */}
      {gameState === GameState.PLAYING ? (
        <GameEngine 
          language={LANGUAGES[selectedLang]} 
          showHands={showHands}
          uiLanguage={uiLang}
          onGameOver={handleGameOver}
          onExit={toMenu}
        />
      ) : (
        /* Scrollable Container for Non-Game Views */
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
           <div className="min-h-full flex flex-col">
              
              {/* MENU VIEW */}
              {gameState === GameState.MENU && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 md:space-y-12 min-h-full">
                  
                  {/* Logo Section */}
                  <div className="text-center flex flex-col items-center animate-bounce-slow mt-8 md:mt-0">
                     <div className="w-24 h-24 mb-4 text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                           <path d="M6 2C4 2 3 3 3 5V19C3 21 4 22 6 22H18C20 22 21 21 21 19V5C21 3 20 2 18 2H6M8 6H10V8H8V6M14 6H16V8H14V6M11 10H13V12H11V10M6 14H18V18H6V14Z" />
                           <rect x="9" y="8" width="2" height="2" className="text-slate-900 fill-current" />
                           <rect x="13" y="8" width="2" height="2" className="text-slate-900 fill-current" />
                           <rect x="10" y="11" width="4" height="2" className="text-amber-400 fill-current" />
                        </svg>
                     </div>
                     <h1 className="text-5xl md:text-7xl font-retro text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 to-cyan-600 glow-text mb-2">
                      PENKO TYPING
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 font-vt323 tracking-widest">
                      {ui.subtitle}
                    </p>
                  </div>

                  <div className="w-full max-w-4xl space-y-6">
                    {/* Arcade-Style Language Selector */}
                    <div className="bg-black/50 border-4 border-double border-cyan-600 p-6 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                      <h2 className="text-center text-xl font-retro text-amber-400 uppercase mb-6 tracking-widest animate-pulse">
                        {ui.selectLang}
                      </h2>

                      {/* Compact Grid */}
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
                        {SORTED_LANGUAGES.map((key) => {
                          const lang = LANGUAGES[key];
                          const isSelected = selectedLang === lang.id;

                          return (
                            <button
                              key={lang.id}
                              onClick={() => setSelectedLang(lang.id)}
                              className={`relative aspect-square p-2 border-2 transition-all font-vt323 text-center flex flex-col items-center justify-center
                                ${isSelected
                                  ? 'bg-cyan-500 border-amber-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.8)] scale-105'
                                  : 'bg-slate-900 border-slate-700 text-cyan-400 hover:border-cyan-500 hover:bg-slate-800'
                                }`}
                            >
                              {/* Script Sample - Large */}
                              <div className={`text-2xl md:text-3xl mb-1 ${isSelected ? 'text-black font-bold' : 'text-cyan-300'}`}>
                                {lang.mappings[0]?.char || 'A'}
                              </div>

                              {/* Language Code - Small */}
                              <div className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                {lang.id.slice(0, 3)}
                              </div>

                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 animate-ping"></div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Language Name Display */}
                      <div className="text-center py-3 bg-slate-950 border-2 border-cyan-800">
                        <div className="font-retro text-cyan-300 text-sm uppercase tracking-widest">
                          ▶ {LANGUAGES[selectedLang].name} ◀
                        </div>
                      </div>
                    </div>

                    {/* Selected Language Info & Controls */}
                    <div className="bg-slate-800 p-6 border-4 border-cyan-600 rounded-sm shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
                      {/* Language Description */}
                      <div className="p-4 bg-slate-900/50 border border-slate-700 rounded text-center mb-6">
                        <p className="text-lg text-slate-300 font-vt323 mb-2">
                          {LANGUAGES[selectedLang].description}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center opacity-70 mt-3">
                           {LANGUAGES[selectedLang].mappings.slice(0, 8).map(m => (
                             <span key={m.code} className="bg-slate-800 border border-slate-600 px-2 py-1 text-sm text-cyan-200 rounded">{m.char}</span>
                           ))}
                           <span className="text-slate-500 px-2 py-1">...</span>
                        </div>
                      </div>

                      {/* Hand Toggle */}
                      <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded border border-slate-700 cursor-pointer hover:bg-slate-800 transition mb-6" onClick={() => setShowHands(!showHands)}>
                         <span className="text-cyan-300 font-bold uppercase text-sm">{ui.showHands}</span>
                         <div className={`w-12 h-6 rounded-full p-1 transition-colors ${showHands ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${showHands ? 'translate-x-6' : 'translate-x-0'}`}></div>
                         </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                         <button
                            onClick={startGame}
                            className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-retro text-xl shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none transition-all rounded-sm"
                          >
                            {ui.start}
                          </button>
                          <button
                            onClick={() => setGameState(GameState.LEADERBOARD)}
                            className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-retro text-lg shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none transition-all rounded-sm"
                            title="Leaderboard"
                          >
                            🏆
                          </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 text-center flex gap-4 items-center pb-8">
                     <span>{ui.offlineCapable}</span> 
                     <span>•</span> 
                     <button onClick={() => setGameState(GameState.MANUAL)} className="underline hover:text-white font-bold tracking-widest uppercase">
                        {ui.manual}
                     </button>
                  </div>
                </div>
              )}

              {/* GAME OVER VIEW */}
              {gameState === GameState.GAME_OVER && (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/95 p-6 md:p-8 text-center z-50 min-h-full">

                  {/* Title */}
                  <h2 className="text-4xl md:text-6xl font-retro text-cyan-400 glow-text mb-12">
                    {ui.sessionComplete}
                  </h2>

                  {/* Stats Panel */}
                  <div className="w-full max-w-2xl bg-slate-800 border-4 border-cyan-600 shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-8 mb-8">
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="bg-slate-900/50 p-6 border-2 border-amber-500/50 rounded">
                        <p className="text-slate-400 text-sm font-vt323 uppercase mb-2">{ui.score}</p>
                        <p className="text-5xl md:text-6xl text-amber-400 font-retro">{stats.score}</p>
                      </div>
                      <div className="bg-slate-900/50 p-6 border-2 border-cyan-500/50 rounded">
                        <p className="text-slate-400 text-sm font-vt323 uppercase mb-2">{ui.wpm}</p>
                        <p className="text-5xl md:text-6xl text-cyan-400 font-retro">{stats.wpm}</p>
                      </div>
                    </div>

                    {/* Initials Input */}
                    <div className="border-t-2 border-slate-700 pt-6">
                       <p className="text-cyan-300 font-vt323 text-lg uppercase mb-4 tracking-wider">{ui.enterInitials}</p>
                       <input
                         autoFocus
                         maxLength={3}
                         value={playerName}
                         onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                         className="bg-black text-amber-400 font-retro text-3xl text-center w-56 px-6 py-4 tracking-[0.3em] border-4 border-amber-600 focus:outline-none focus:border-amber-400 focus:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all"
                         placeholder="___"
                       />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={saveScore}
                      disabled={!playerName}
                      className="px-8 py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-retro text-lg shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0_rgba(0,0,0,0.8)] transition-all"
                    >
                      {ui.save}
                    </button>
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-retro text-lg shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none transition-all"
                    >
                      {ui.skip}
                    </button>
                    <button
                      onClick={toMenu}
                      className="px-8 py-3 border-2 border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 font-retro text-lg shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
                    >
                      {ui.backToMenu}
                    </button>
                  </div>
                </div>
              )}

              {/* LEADERBOARD VIEW */}
              {gameState === GameState.LEADERBOARD && (
                <Leaderboard 
                  entries={leaderboard} 
                  currentLanguage={selectedLang} 
                  onClose={toMenu} 
                />
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;