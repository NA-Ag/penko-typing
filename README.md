# Penko Typing

**Master non-Latin keyboard layouts through retro arcade-style typing games.**

A free, offline-first typing game designed to help you learn and practice typing in Korean Hangul, Russian Cyrillic, Japanese Kana, Greek, Arabic, Hebrew, and more. Perfect for language learners, polyglots, and anyone wanting to expand their keyboard skills beyond QWERTY.

---

## Why Penko Typing?

- **13 Non-Latin Keyboards** - Learn Korean, Russian, Japanese, Greek, Arabic, Hebrew, Thai, Hindi, and more
- **100% Free & Open Source** - No subscriptions, no ads, no tracking
- **Retro Arcade Aesthetic** - Nostalgic 8-bit gaming experience
- **Offline-First** - Works completely offline as a PWA
- **Visual Learning** - Color-coded finger mapping and hand visualization
- **Real-Time Feedback** - WPM tracking, accuracy metrics, and immediate corrections
- **Local Leaderboards** - Track your progress with arcade-style high scores

---

## Features

### Keyboard Layouts (13 Languages)
- **English** (QWERTY)
- **Spanish** (Español - QWERTY with Ñ)
- **French** (Français - AZERTY)
- **German** (Deutsch - QWERTZ)
- **Korean** (한국어 - Hangul 2-Set)
- **Russian** (Русский - Cyrillic)
- **Japanese** (日本語 - Hiragana/Katakana)
- **Greek** (Ελληνικά - Greek alphabet)
- **Arabic** (العربية - RTL layout)
- **Hebrew** (עברית - RTL layout)
- **Thai** (ไทย - Kedmanee layout)
- **Hindi** (हिन्दी - Devanagari)
- **Ukrainian** (Українська - Cyrillic)

### Learning Tools
- **Finger Mapping** - Visual guide showing which finger types each key
- **Hand Visualization** - Toggle hand display on/off during gameplay
- **Color-Coded Keys** - Each finger assigned a unique color
- **Real-Time WPM** - Words per minute tracking
- **Accuracy Metrics** - Track your typing precision
- **Score System** - Arcade-style points for correct typing

### Game Modes
- **Free Practice** - Type common words in your chosen language
- **Leaderboard** - Compete with yourself and track personal bests
- **Manual/Tutorial** - Learn keyboard layouts and finger positions

### Interface
- **Multilingual UI** - Interface available in English, Spanish, French, German, Korean, Russian, Japanese, Greek, Arabic, Hebrew, Thai, Hindi, Ukrainian
- **Retro Design** - Classic arcade terminal aesthetic with cyan/slate color scheme
- **Responsive** - Works on desktop and tablet (keyboard required)

---

## Getting Started

### Run Locally

**Prerequisites**: Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to http://localhost:3000/

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

### Install as PWA

When running in a browser, you can install Penko Typing as a desktop or mobile app for offline use:
1. Look for the install icon in your browser's address bar
2. Click "Install" to add it to your device
3. Launch it like any other application - no internet required!

---

## How to Play

1. **Select Language** - Choose which keyboard layout you want to practice
2. **Optional: Toggle Hands** - Show/hide hand visualization
3. **Start Game** - Click "Start" to begin
4. **Type Words** - Words fall from the top - type them before they reach the bottom
5. **Track Progress** - Watch your WPM and score increase
6. **Save Score** - Enter your 3-letter arcade name to save to leaderboard

### Controls
- **Type** - Use keyboard to type falling words
- **ESC** - Exit game and return to menu
- **Toggle Hands** - Show/hide finger guide during gameplay

---

## Supported Keyboards

Each language uses authentic keyboard layouts:
- **QWERTY** - English, Spanish
- **AZERTY** - French
- **QWERTZ** - German
- **Hangul** - Korean (2-Set layout)
- **Cyrillic** - Russian, Ukrainian
- **Kana** - Japanese (Hiragana/Katakana)
- **Greek Alphabet** - Greek
- **Arabic Script** - Arabic (RTL)
- **Hebrew Script** - Hebrew (RTL)
- **Kedmanee** - Thai
- **Devanagari** - Hindi

---

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (inline styles for retro arcade feel)
- **Storage**: Browser localStorage (leaderboards, preferences)
- **PWA**: Service Worker for offline support

---

## Development Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and improvements.

---

## Contributing

Contributions are welcome! Areas for improvement:
- Additional keyboard layouts (Chinese, Vietnamese, etc.)
- More game modes (timed tests, lesson mode, custom word lists)
- Accuracy tracking and detailed statistics
- Sound effects and audio feedback
- Additional UI language translations

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Penko Typing is licensed under the GNU General Public License v3.0. See [LICENSE.md](LICENSE.md) for details.

This means you can:
- Use it for any purpose
- Study and modify the source code
- Share copies
- Share your modifications

As long as you:
- Disclose the source code
- Keep the same GPL v3 license
- Document your changes

---

## Credits

- **Keyboard Layouts**: Authentic layouts based on international standards
- **Finger Mapping**: Standard touch-typing finger assignments
- **Design**: Inspired by classic arcade terminals and retro gaming aesthetics

---

## Support

Found a bug? Have a feature request? Want to add a new keyboard layout?

Please open an issue on GitHub.

---

**Part of the Penko Software Suite** - Free, open-source, privacy-first productivity tools.
