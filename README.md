<p align="center">
  <img src="https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

<h1 align="center">🎓 LearnHub</h1>
<p align="center"><strong>Education Without Boundaries. Learning Without Barriers.</strong></p>

<p align="center">
  An AI-powered accessible education platform ensuring every student can learn,<br/>
  regardless of their physical, sensory, or cognitive abilities.
</p>

---

## 🌟 The Problem

Over **1 billion people** worldwide live with some form of disability. Yet, most educational platforms present significant barriers:

- 📖 **Visual impairments** → Text-heavy content without audio narration or braille support
- 👂 **Hearing impairments** → Video content without captions or sign language
- 🖐️ **Motor disabilities** → Interfaces requiring precise mouse/keyboard control
- 🧠 **Cognitive disabilities** → Overwhelming, distraction-heavy interfaces

**LearnHub** breaks down these barriers using the power of **Google Gemini AI**.

---

## ✨ Core Features

### 🎙️ AI Voice Agent
Navigate the entire platform using natural voice commands. Powered by **Gemini Live API**, students can:
- Say *"Open Chemistry Chapter 3"* to navigate
- Say *"Play the lesson"* to start narration
- Say *"What chapters do I have?"* for discovery
- Completely hands-free operation for motor-impaired students

### 📖 Text-to-Speech Narration
Every lesson can be read aloud with **Gemini TTS**, featuring:
- Natural, expressive voice synthesis
- Multi-language support (English, Spanish, Hindi)
- Play, pause, resume controls
- Automatic narration on page load option

### ⠿ Braille Conversion
Educational content converted to Grade 2 Braille:
- **Nemeth Code** for mathematical equations
- Support for LaTeX math expressions
- BRF (Braille Ready Format) export
- Seamless reading for visually impaired students

### 🎨 AI-Generated Diagrams
Complex concepts visualized using **Imagen 4.0**:
- Automatic diagram generation from lesson descriptions
- Educational illustrations created on-demand
- Visual aids for every core concept

### 🎯 Focus Mode
Distraction-free learning environment:
- Simplified interface for ADHD/cognitive disabilities
- Reduced visual clutter
- Adjustable text size
- Motion reduction option

### ✋ Sign Language Support
Supporting deaf and hard-of-hearing students:
- Sign language video overlays
- Closed captions for all content
- Visual-first learning approach

### 🌐 Multi-Language
Breaking language barriers:
- English, Spanish, Hindi support
- Localized interface
- Language-aware TTS voices

---

## 🚀 Gemini API Integration

LearnHub leverages the full power of Google Gemini's AI capabilities:

| Gemini Feature | Use Case | Implementation |
|----------------|----------|----------------|
| **Gemini Live API** | Real-time voice agent for hands-free navigation | `VoiceAgentProvider.tsx` - Bidirectional audio streaming with automatic speech detection, tool calling for navigation commands |
| **Gemini 2.0 Flash** | Content generation & lesson parsing | `gemini.ts` - PDF parsing, lesson structuring, JSON extraction with robust LaTeX handling |
| **Gemini TTS** | High-quality speech synthesis | `tts.ts` - Multi-language voice synthesis with PCM/WAV encoding for lesson narration |
| **Imagen 4.0** | Educational diagram generation | `imageGen.ts` - Auto-generate visual diagrams from lesson concept descriptions |
| **Tool Calling** | Voice command execution | Function declarations for `navigate_to_chapter`, `lesson_control`, `list_subjects`, etc. |
| **Structured Output** | Reliable JSON responses | Schema-based output for consistent lesson data parsing |

### Voice Agent Architecture

```
┌─────────────┐    Audio Stream    ┌──────────────────┐
│   Browser   │ ─────────────────► │  Gemini Live API │
│   (Mic)     │                    │                  │
└─────────────┘                    │  - Speech Recognition
       ▲                           │  - Intent Detection
       │                           │  - Tool Execution
       │      Audio Response       │                  │
       └─────────────────────────  └──────────────────┘
                                          │
                                          ▼
                               ┌──────────────────┐
                               │  CommandExecutor │
                               │  - Navigation    │
                               │  - Playback      │
                               │  - Discovery     │
                               └──────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL with Drizzle ORM |
| **AI/ML** | Google Gemini AI Suite |
| **Accessibility** | LibLouis Braille, Web Speech API |
| **Deployment** | Render (API), Vercel (Web) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Gemini API Key

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/learnhub.git
cd learnhub

# Install dependencies
npm install
cd api && npm install
cd ../web && npm install

# Configure environment
cp api/.env.example api/.env
# Add your GEMINI_API_KEY

# Start development servers
npm run dev
```

### Environment Variables

Create `.env` files in both the `api/` and `web/` directories:

#### 📁 `api/.env`

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gemini_hack

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-exp

# S3-compatible Storage (MinIO for local dev)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=lesson-media
S3_REGION=us-east-1

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### 📁 `web/.env`

```env
# API Backend URL
VITE_API_URL=http://localhost:3000

# Gemini API Key (for client-side Live API)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

---

## 🎯 Accessibility Features Matrix

| Disability Type | Feature | Gemini AI Role |
|-----------------|---------|----------------|
| **Blind / Low Vision** | Braille output, Audio narration | TTS synthesis |
| **Motor Impairment** | Voice navigation, Hands-free control | Live API + Tool Calling |
| **Deaf / Hard of Hearing** | Captions, Sign language | Content structuring |
| **Cognitive / ADHD** | Focus mode, Simplified UI | - |
| **Learning Disabilities** | Multi-modal content, Visual diagrams | Imagen generation |

---

## 🏆 Hackathon Details

**Built for:** Google Gemini AI Hackathon 2025

**Demo:** [\[Link to deployed app\]](https://gemini-hack-puce.vercel.app/)

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Every student deserves the right to learn. LearnHub makes it possible.</strong>
</p>
