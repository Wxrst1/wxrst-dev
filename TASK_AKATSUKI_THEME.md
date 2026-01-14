# TASK: Ultimate Akatsuki Theme Implementation Roadmap

This document outlines the systematic implementation of the "Akatsuki Recruitment" theme as specified in `akatsuki_theme.md`.

## 🏗️ Phase 1: Foundation & Global State
- [ ] **Theme Registration**: Ensure `ThemeType.AKATSUKI` is correctly mapped in `App.tsx` and `types.ts`.
- [ ] **Global State Setup**: Extend `UserProfile` or create a dedicated state hook/context for Akatsuki-specific data:
    - [ ] `ringsFound: boolean[10]`
    - [ ] `abilitiesUnlocked: string[]`
    - [ ] `currentRank: string`
    - [ ] `recruitCodename: string`
    - [ ] `recruitmentStage: 'COLD_OPEN' | 'CHARACTER_CREATION' | 'TRIALS' | 'MEMBER'`
- [ ] **Assets & Styling**:
    - [ ] Import "Pirata One" and "Fira Code" fonts.
    - [ ] Setup global CSS for Rain particles (Amegakure vibe).
    - [ ] Add `Rinnegan Ripple` mouse cursor effect.

## 🌧️ Phase 2: The Recruitment (Intro Flow)
- [ ] **Cold Open Component**:
    - [ ] Implementation of the black screen + rain + blood-red text intro.
    - [ ] "Any key to accept" logic.
- [ ] **Character Creation UI**:
    - [ ] Ninja Dossier form (Codename, Village, Specialty).
    - [ ] Persistence of these choices in local state/Supabase.

## 👹 Phase 3: The Hideout (Navigation)
- [ ] **Outer Path Hub**:
    - [ ] Replace standard grid with a hierarchical circular menu.
    - [ ] Silhouette-based member selection.
    - [ ] Lock/Unlock logic based on ring collection.
- [ ] **Gedo Mazo Backdrop**:
    - [ ] SVG-based "Chakra Chains" connecting to selected items.
    - [ ] Visual heartbeat/breathing effect.

## 💍 Phase 4: The 10 Rings (Trials Logic)
*Each trial is a unique mini-component logic:*
- [ ] **Trial 1 (Itachi)**: Sharingan vision + genjutsu detection (distorted fake projects).
- [ ] **Trial 2 (Kisame)**: Water rising mechanic + shark-mark collection.
- [ ] **Trial 3 (Deidara)**: Rhythm-based clay bomb defusal.
- [ ] **Trial 4 (Sasori)**: Chakra thread tracing (mouse drag-and-trace).
- [ ] **Trial 5 (Hidan)**: Glitch/Corruption timing challenge.
- [ ] **Trial 6 (Kakuzu)**: Ryō (currency) bounty system for project "purchasing".
- [ ] **Trial 7 (Konan)**: Origami unfolding puzzle (sequential card clicks).
- [ ] **Trial 8 (Obito)**: Kamui time-phase navigation (Past/Present/Future).
- [ ] **Trial 9 (Zetsu)**: Dual-mode information gathering (Light/Dark toggle).
- [ ] **Trial 10 (Pain)**: Final Boss flow with 6 mini-game paths (Gravity, Summons, Soul Reading, etc.).

## 🎓 Phase 5: The Transformation
- [ ] **Full Member UI Update**:
    - [ ] Transformation to the Akatsuki Cloak frame.
    - [ ] Permanent "Abilities" (Sharingan vision always active, etc.).
- [ ] **Secret Mission Board**:
    - [ ] Post-trial achievements and easter eggs.
- [ ] **Final Judgment Logic**:
    - [ ] "Do you understand pain?" response-based ending variants.

## 🎵 Phase 6: Polish & Sound
- [ ] **Dynamic Soundtrack**:
    - [ ] Transition between Base, Tension, and Combat audio layers.
- [ ] **Voice Lines**:
    - [ ] Audio triggers for member quotes upon interaction.
- [ ] **Rinnegan Mode Secrets**:
    - [ ] Implementation of keyboard/search-based easter eggs (e.g., "神").

---
*Status: 🟢 Ready for implementation. Use `App.tsx` as the mounting point.*
