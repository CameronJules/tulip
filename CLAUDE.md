# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo-based React Native application called "Tulip" that targets iOS, Android, and web platforms. The project uses React Native's new architecture (enabled via `newArchEnabled: true`), React 19, and includes experimental features like typed routes and the React Compiler.

Key dependency: `cactus-react-native` is a specialized React Native library included in this project.

## Commands

### Development
```bash
npm install                  # Install dependencies
npx expo start               # Start Expo dev server (shows QR code + platform options)
```

### Platform-Specific (Native Development)
```bash
npx expo run:ios             # Build and run on iOS simulator/device
npx expo run:android         # Build and run on Android emulator/device
npm run web                  # Run web version
```

Note: `run:ios` and `run:android` compile native code and are needed when:
- First time running the app
- After adding/modifying native dependencies
- After changing native configuration in app.json

For development without native changes, use `npx expo start` and select your platform.

### Linting
```bash
npm run lint                 # Run ESLint (uses expo's flat config)
```

### Other
```bash
npm run reset-project        # Move current app/ to app-example/ and create blank app/
```

## Documentation Resources

- **cactus-react-native**: https://github.com/cactus-compute/cactus-react-native
- **Other documentation**: Use the context7 MCP server for additional documentation lookups

## Architecture

### File-Based Routing
This project uses Expo Router v6 with file-based routing. Routes are defined by the file structure in the `app/` directory:
- `app/_layout.tsx` - Root layout with Stack navigator, theme provider, and DatabaseProvider
- `app/(tabs)/_layout.tsx` - Tab navigator layout
- `app/(tabs)/index.tsx` - Home screen with activity grid and week view
- `app/(tabs)/explore.tsx` - Explore screen (second tab, will be replaced in future phases)
- `app/modal.tsx` - Example modal screen
- `app/journal-entry.tsx` - Journal entry modal (receives date via query params)

The root layout sets the anchor to `(tabs)` via `unstable_settings.anchor`, making tabs the default entry point.

### Path Aliases
TypeScript is configured with a `@/*` path alias that maps to the project root, allowing imports like:
```typescript
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
```

### Theming System
The app implements a light/dark mode theming system:
- `constants/theme.ts` - Defines `Colors` object with light/dark variants, `MoodColors` (red/yellow/green), and `Fonts`
- `hooks/use-color-scheme.ts` - Re-exports React Native's `useColorScheme` hook
- `hooks/use-color-scheme.web.ts` - Web-specific color scheme implementation
- `hooks/use-theme-color.ts` - Hook for accessing themed colors
- Components like `ThemedText` and `ThemedView` automatically adapt to the current color scheme

**Mood Colors:**
- Red (#FF6B6B) - Bad day
- Yellow (#FFD93D) - Okay day
- Green (#6BCF7F) - Good day
- Blue (#4A90E2) - Entry without mood (light mode)
- Gray (#E0E0E0) - No entry (light mode)

### Component Structure

**Base Components:**
- `components/themed-text.tsx` - Text component with theme support and predefined types (default, title, subtitle, link, etc.)
- `components/themed-view.tsx` - View component with theme support
- `components/ui/` - UI components including `icon-symbol` (with iOS-specific variant) and `collapsible`
- `components/haptic-tab.tsx` - Tab button with haptic feedback
- `components/parallax-scroll-view.tsx` - Scroll view with parallax header effect

**Home Screen Components:**
- `components/home/activity-grid.tsx` - 90-day activity tracker with responsive dot sizing
- `components/home/week-view.tsx` - Week view container
- `components/home/week-header.tsx` - Week summary header
- `components/home/day-item.tsx` - Individual day list item
- `components/home/mood-dot.tsx` - Colored mood indicator

**Journal Components:**
- `components/journal/themed-text-input.tsx` - Themed TextInput with focus state and custom styling
- `components/journal/journal-form.tsx` - Six-field journal entry form with structured sections
- `components/journal/mood-selector-modal.tsx` - Custom mood selection modal

### Platform-Specific Files
The project uses React Native's platform-specific file extensions:
- `.ios.tsx` for iOS-specific implementations
- `.web.ts` for web-specific implementations
- Base `.tsx/.ts` files serve as defaults

Example: `icon-symbol.ios.tsx` vs `icon-symbol.tsx`

### Expo Configuration
Key settings in `app.json`:
- **New Architecture**: Enabled for React Native
- **Typed Routes**: Experimental feature enabled for type-safe navigation
- **React Compiler**: Experimental compiler enabled
- **Edge-to-Edge UI**: Enabled for Android with predictive back gesture disabled
- **Splash Screen**: Custom configuration with dark mode support

## Tulip App - AI-Powered Journaling

Tulip is a memory support and cognitive load reduction app. Users do nightly journaling with structured entries. AI analyzes entries to provide insights and actionable suggestions based on sleep science principles.

### App Sections (Planned)
1. **Suggestions** - Actionable recommendations from last 7 days
2. **Home** - Activity tracker + week view + journal entry modal
3. **Insights** - AI-generated patterns from last 5 days

### Phase 1: Foundation (✅ COMPLETED)

**Data Layer:**
- SQLite database with `journal_entries` table (date, mood, content, timestamps)
- Corpus file system for Cactus LLM RAG (`.txt` files in `corpus/` directory)
- AsyncStorage for app settings and AI cache
- DatabaseProvider wraps the app and initializes on startup

**Key Files:**
- `lib/database/db.ts` - Database initialization and connection
- `lib/database/schema.ts` - SQL schema definitions
- `lib/models/types.ts` - TypeScript interfaces (JournalEntry, ActivityDay, etc.)
- `lib/models/journal-entry.ts` - CRUD operations with corpus sync
- `lib/storage/corpus.ts` - Corpus file management for RAG
- `lib/storage/async-storage.ts` - AsyncStorage wrapper with cache utilities
- `hooks/use-database.tsx` - DatabaseProvider context
- `constants/storage.ts` - Storage paths and keys

**CRUD Operations Available:**
```typescript
createJournalEntry(data: JournalFormData): Promise<JournalEntry>
updateJournalEntry(date: string, data: Partial<JournalFormData>): Promise<JournalEntry>
getJournalEntry(date: string): Promise<JournalEntry | null>
getLastNDaysEntries(n: number): Promise<JournalEntry[]>
getActivityDaysForLastNDays(n: number): Promise<ActivityDay[]>
deleteJournalEntry(date: string): Promise<void>
```

**Important Implementation Details:**
- All journal operations automatically sync to corpus files (`YYYY-MM-DD.txt`)
- AI caches are invalidated on any create/update/delete operation
- Dates are stored as `YYYY-MM-DD` strings to avoid timezone issues
- Mood values: `'red' | 'yellow' | 'green'`
- Corpus directory: `${FileSystem.documentDirectory}corpus/`

### Phase 2: Home Section (✅ COMPLETED)

**UI Components:**
- `components/home/activity-grid.tsx` - 90-day activity tracker (18 dots × 5 rows, oldest to newest left-to-right, top-to-bottom)
- `components/home/week-view.tsx` - 30-day scrollable view with dynamic week header
- `components/home/week-header.tsx` - Shows "Entries for week XX" (dynamically updates on scroll)
- `components/home/day-item.tsx` - Individual day row (date, time, mood dot, navigation)
- `components/home/mood-dot.tsx` - Reusable mood indicator (16px circle, responsive sizing)
- `components/journal/themed-text-input.tsx` - Themed TextInput with focus state, custom styling, and read-only support
- `components/journal/journal-form.tsx` - Six-field structured journal entry form
- `components/journal/mood-selector-modal.tsx` - Custom modal for mood selection (bad/okay/good)

**Routes:**
- `app/(tabs)/index.tsx` - Home screen with activity grid + week view (replaced placeholder)
- `app/journal-entry.tsx` - Journal entry modal screen with full CRUD functionality

**Utilities:**
- `lib/utils/date-helpers.ts` - Date formatting, parsing, and content helpers
  - `formatContent()` - Formats all 6 journal sections with structured prefixes
  - `extractRememberText()`, `extractMomentsText()`, `extractUnderstandingText()`, `extractWinsText()`, `extractDropText()`, `extractIntentionsText()` - Extract individual sections from stored content
  - `getWeekNumber()` - ISO week number calculation
  - Date formatting and validation utilities

**Key Features:**
- 90-day activity tracker (18 dots per row, 5 rows) covering ~3 months
  - Most recent day in bottom-right corner
  - Oldest to newest flow: left-to-right, top-to-bottom
  - Responsive dot sizing that spans full container width
- 30-day scrollable week view with dynamic features:
  - Loads last 30 days of entries
  - Only 5 entries visible at rest (increased spacing)
  - Starts scrolled to bottom (most recent entries)
  - Dynamic sticky header: "Entries for week XX" updates as you scroll
  - Week number calculated based on visible entries
- "No Entry" state with dashed border for days without entries
- Read-only mode for past dates (entries can only be created/edited for current day)
- Custom mood selector modal (Bad/Okay/Good → Red/Yellow/Green)
- 6-field structured journal entry form with consistent styling
- SafeAreaView integration to avoid system UI overlaps (notch, camera cutouts)
- Auto-refresh on screen focus
- Loading and error states with retry functionality

**Journal Entry Form Structure:**
The journal form includes 6 sections for comprehensive daily reflection:
1. What I want to remember tomorrow
2. Meaningful moments from today
3. What I'm trying to understand or solve
4. What went well today (small wins)
5. What wasn't important and can be dropped
6. Intentions for tomorrow

**Content Format:**
Journal entries are stored with structured prefixes:
```
REMEMBER: [what I want to remember tomorrow]

MOMENTS:
[meaningful moments from today]

UNDERSTANDING:
[what I'm trying to understand or solve]

WINS:
[what went well today (small wins)]

DROP: [what wasn't important and can be dropped]

INTENTIONS:
[intentions for tomorrow]
```

**Journal Input Styling:**
- Background: #F5F5F5 (light gray)
- Border: Transparent by default
- Focus state: #6F56FF at 30% opacity (#6F56FF4D)
- All inputs: 120px height with top-left text alignment
- All inputs use multiline with textAlignVertical="top"

**Navigation Flow:**
1. Tap day item → Opens journal entry modal with date parameter
2. Fill form → Tap save → Select mood → Entry saved & modal dismissed
3. Return to home → Data auto-refreshes → Entry appears in grid and week view

**Important Notes:**
- Only current day entries are editable (past entries are read-only)
- Mood selection happens after form validation
- All database operations auto-sync to corpus files
- Fixed deprecated `expo-file-system` API (now using `/legacy` import)

### Next Steps
1. Implement Phase 3: Insights (Cactus LLM integration)
2. Implement Phase 4: Suggestions (CSV-formatted output)
3. Implement Phase 5: Polish and testing
4. Replace Explore tab with Suggestions and Insights tabs

## Important Notes

- The project uses strict TypeScript mode
- Android package name is `com.anonymous.tulip` (should be changed for production)
- Custom splash screen is configured via `expo-splash-screen` plugin with separate light/dark backgrounds
- The app scheme is `tulip://` for deep linking
- **IMPORTANT**: Use `expo-file-system/legacy` instead of `expo-file-system` to avoid deprecation warnings
- Phase 2 implementation plan: `~/.claude/plans/cozy-watching-teacup.md`
- Original foundation plan: `~/.claude/plans/harmonic-drifting-feather.md`
