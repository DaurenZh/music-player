# Ablify — Spotify‑like Music Player (Vue 3 + Vite)

Ablify is a clean, focused Spotify‑style music player built with Vue 3 + Vite. It demonstrates end‑to‑end product thinking: delightful UI, smooth playback UX, local persistence, and clear flows for liking tracks and curating user playlists — all on top of a simple single‑artist dataset.

Elevator Pitch
- Problem: Music UIs are often complex to build and get right. Teams need a compact, understandable reference that combines real playback, state, and UI patterns.
- Solution: Ablify offers a minimal yet complete music experience. It covers the core player interactions, persistence, and navigation in a single, approachable codebase.
- Outcome: A ready‑to‑demo app suited for portfolio, interviews, workshops, or as a base for larger projects.

Target Audience
- Frontend developers learning Vue 3 + Pinia + Tailwind.
- Product/UX designers wanting a minimal player to test flows.
- Educators and students who need a compact, fully working app to modify.

Live Demo (recording/script)
- 1) From Home, open Library to view album details and tracks.
- 2) Hover a row to play/pause or like. The bottom player updates in real time.
- 3) Create a playlist from the sidebar. Add songs individually or in bulk.
- 4) Open Liked Songs; verify your likes persist on refresh.
- 5) Go to Search; type a query and see debounced URL updates.
- 6) Return to the player; scrub the seek bar, change volume, skip tracks.

Key Highlights
- Real playback via HTMLAudioElement with time/seek/volume.
- Local persistence (Pinia + localStorage) for likes and playlists.
- Polished micro‑interactions (hover states, active icons, debounced search).
- Modular components and a predictable store API.
- Runs instantly with Vite; assets served from public paths.

Screenshots / Media
- Placeholders (replace with your images or GIFs):
  - /images/screens/home.png — Home sections
  - /images/screens/library.png — Album + tracks
  - /images/screens/player.png — Bottom player
  - /images/screens/liked.png — Liked Songs
  - /images/screens/playlist.png — Playlist flow

Features
- Audio player
  - Play/Pause current track, previous/next track
  - Seek bar (drag & click) with current/total time
  - Volume control with hover thumb
- Library
  - Single artist album data from src/artist.json
  - Track list with like and “add to playlist”
  - Play from first track
- Liked Songs
  - Auto‑generated list of liked tracks
- Playlists
  - Create playlist (sidebar)
  - Add single track (SongRow menu)
  - Add multiple tracks (Select Songs modal)
  - Add all songs at once
  - Remove tracks and delete playlist
  - State persists locally
- Search
  - Debounced query → syncs to URL (?q=) and “Browse all” grid
- UI/UX polish
  - Sidebar with active states, responsive layout, hover affordances

Product/UX Decisions
- Always‑visible player: keeps context and increases control discoverability.
- Hover‑based row actions: reduces noise while keeping actions close to content.
- URL‑first search: signals intent for routing/deep linking without a backend.
- Minimal color language: Tailwind utilities + consistent contrast for clarity.
- “Create playlist” entry in sidebar: mirrors mental model in mainstream apps.

Architecture Overview
- Vue 3 + Vite: Fast HMR, modern ESM build, single‑page routing.
- Pinia Store (src/stores/song.js): Single source of truth for player state, likes, playlists.
- Vue Router: Thin route config with simple views.
- Tailwind CSS v4: Utility‑first styling with minimal custom CSS.
- Assets served from public root (/images, /songs) for simplicity.

Routing
- / — Home
- /search — Search (reads ?q= from URL)
- /library — Album/track list
- /liked — Liked Songs
- /playlist/:id — Playlist view

Data Model
- Artist (src/artist.json)
  - name, artistName, albumCover, releaseYear
  - tracks: [{ id, name, song }]
- Store (persisted)
  - isPlaying: boolean
  - audio: HTMLAudioElement | null
  - currentArtist: object | null
  - currentTrack: object | null
  - likedTracks: number[] (ids)
  - playlists: { id: number, name: string, tracks: number[] }[]

Store API (selected)
- loadSong(artist, track) — set current song and start playback
- playOrPauseSong() — toggle playback
- playOrPauseThisSong(artist, track) — play/continue given track
- prevSong(currentTrack), nextSong(currentTrack) — by id order
- playFromFirst() — reset and start from first track
- toggleLike(trackId), isLiked(trackId)
- createPlaylist(name)
- addTrackToPlaylist(playlistId, trackId)
- removeTrackFromPlaylist(playlistId, trackId)
- deletePlaylist(playlistId)

Tech Stack
- Vue 3 (Composition API)
- Vite 7
- Pinia 3 + pinia-plugin-persistedstate
- Vue Router 4
- Tailwind CSS v4 (via @tailwindcss/vite)
- vue-material-design-icons
- uniqolor (category tile colors)

Project Structure (key files)
- src/main.js — App bootstrap, Pinia + Router registration
- src/router/index.js — Route definitions
- src/stores/song.js — Player/likes/playlists logic
- src/assets/main.css — Tailwind CSS entry
- src/artist.json — Album/track data
- src/components/
  - MusicPlayer.vue — Bottom player bar
  - MusicPlayerVolume.vue — Volume control
  - SongRow.vue — Track row with like/menu actions
  - AddToPlaylistModal.vue — Add current track to playlist
  - SelectSongsModal.vue — Pick multiple tracks to add to a playlist
  - CreatePlaylistModal.vue — Create playlist flow
  - SearchBar.vue — Debounced search input
  - MenuItem.vue, HomeCard.vue, CategorySelect.vue — UI components
- src/views/
  - HomeView.vue, SearchView.vue, LibraryView.vue, LikedSongsView.vue, PlaylistView.vue
- src/App.vue — Global layout: sidebar, top bar, RouterView, MusicPlayer

Audio & Assets
- Tracks are loaded from track.song in src/artist.json and resolved at “/”.
- Place files so they are served at:
  - /songs/<file>.mp3 (referenced by artist.json)
  - /images/... (album covers, icons)
- Using Vite public folder:
  - public/songs/MyTrack.mp3 -> /songs/MyTrack.mp3
  - public/images/albumCovers/cover.png -> /images/albumCovers/cover.png
- Important: prev/next assumes track ids are 1..N and sorted in playback order.

Accessibility
- Keyboard focusable controls (native buttons/inputs).
- Sufficient color contrast for text and primary actions.
- Hover‑only affordances paired with visible indices/timings for context.
- Tip: Add aria‑labels and focus outlines if targeting WCAG 2.1 AA explicitly.

Performance
- Vite dev server + ESM build for fast startup.
- Lightweight state and no network calls.
- Tailwind utilities minimize CSS bloat.
- Tip: For production, preload critical audio metadata if using large files.

Security & Privacy
- No authentication or remote services.
- Local persistence via localStorage (client‑side only).

Roadmap (next steps)
- Real search/filtering over tracks
- Multiple artists/albums and browsing
- Queue/Repeat/Shuffle
- Keyboard shortcuts
- Theming (light/dark variations)
- PWAs: offline caching for assets
- Unit/e2e tests and CI

Risks & Limitations
- Single‑artist demo; next/prev logic depends on contiguous ids.
- Browser autoplay policies require user interaction.
- Local storage can be cleared by the user.

Setup & Development
- Requirements: Node ^20.19.0 or >=22.12.0
- Install: npm install
- Dev server: npm run dev
- Build: npm run build
- Preview build: npm run preview
- Format: npm run format

How to add or change tracks
1) Put audio files under public/songs/
2) Update src/artist.json:
   - Keep “id” values contiguous (1..N) and ordered
   - Example:
     { "id": 1, "name": "My Song", "song": "songs/MySong.mp3" }
3) Ensure albumCover path is reachable under /images/...

Troubleshooting
- No sound: Verify files are under /songs/ and not blocked by CORS.
- Time/seek not updating: Ensure metadata loads; check console for errors.
- Icons missing: Confirm /images/icons/* exist (sidebar/MenuItem).
- State not persisting: Check pinia-plugin-persistedstate registration.

License
- For learning/demo purposes. Adjust as needed.
