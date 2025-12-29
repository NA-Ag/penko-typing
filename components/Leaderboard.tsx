import React from 'react';
import { LeaderboardEntry, Language } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentLanguage: Language;
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentLanguage, onClose }) => {
  const filteredEntries = entries
    .filter(e => e.languageId === currentLanguage)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl bg-slate-800 border-4 border-amber-500 shadow-[8px_8px_0_rgba(0,0,0,0.5)] relative">

        {/* Header */}
        <div className="bg-gradient-to-b from-amber-600 to-amber-500 p-6 border-b-4 border-amber-700">
          <h2 className="text-4xl md:text-5xl font-retro text-slate-900 text-center drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
            🏆 HIGH SCORES 🏆
          </h2>
        </div>

        {/* Language Badge */}
        <div className="bg-slate-900 p-4 border-b-2 border-slate-700">
          <div className="text-center text-cyan-400 font-retro text-sm md:text-base uppercase tracking-widest">
            {currentLanguage.replace('_', ' ')}
          </div>
        </div>

        {/* Scores List */}
        <div className="p-6">
          {filteredEntries.length === 0 ? (
            <div className="text-center text-slate-500 py-16 font-vt323 text-2xl border-2 border-dashed border-slate-700 rounded-lg">
              NO RECORDS YET
              <div className="text-sm mt-2 text-slate-600">Be the first to set a high score!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header Row */}
              <div className="grid grid-cols-4 text-slate-400 font-retro text-xs md:text-sm border-b-2 border-amber-500/30 pb-3 mb-2">
                <div className="text-center">RANK</div>
                <div className="text-left pl-2">NAME</div>
                <div className="text-right">WPM</div>
                <div className="text-right pr-2">SCORE</div>
              </div>

              {/* Score Entries */}
              {filteredEntries.map((entry, idx) => {
                const isTopThree = idx < 3;
                const medalColor = idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600';
                const bgColor = idx === 0 ? 'bg-gradient-to-r from-amber-900/30 to-amber-800/20' :
                                idx === 1 ? 'bg-gradient-to-r from-slate-700/30 to-slate-600/20' :
                                idx === 2 ? 'bg-gradient-to-r from-amber-900/20 to-amber-800/10' :
                                'bg-slate-900/30';

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-4 font-vt323 text-lg md:text-xl items-center p-3 rounded-lg border-2 ${
                      isTopThree ? 'border-amber-500/50' : 'border-slate-700/50'
                    } ${bgColor} hover:bg-slate-700/50 transition-all`}
                  >
                    <div className={`text-center font-retro text-base ${medalColor} ${isTopThree ? 'font-bold' : ''}`}>
                      {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}`}
                    </div>
                    <div className="uppercase tracking-widest text-cyan-200 pl-2">{entry.name}</div>
                    <div className="text-right text-cyan-300">{entry.wpm}</div>
                    <div className="text-right text-white font-bold pr-2">{entry.score}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-retro text-base shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:shadow-none transition-all border-2 border-slate-600"
          >
            ← BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;