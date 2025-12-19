import { defineStore } from 'pinia'
import artist from '../artist.json'

export const useSongStore = defineStore('song', {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentArtist: null,
    currentTrack: null,
    likedTracks: [],
    playlists: [],
    searchTracks: [],
    recentlyPlayed: [],
    
    // New State
    currentList: [], // The current queue/context for playback
    homeSections: [],
    topArtists: [], 
    isShuffle: false,
    repeatMode: 0, 
    error: null, 
  }),
  getters: {

    playlistCount: (state) => state.playlists.length,
    hasError: (state) => !!state.error
  },
  actions: {
    async fetchTracks(term) {
        this.error = null
        if (!term) return
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=50`)
            if (!response.ok) throw new Error('Network response was not ok')
            const data = await response.json()
            
            this.searchTracks = data.results.map(item => ({
                id: item.trackId,
                name: item.trackName,
                artistName: item.artistName,
                albumName: item.collectionName,
                // Get higher res (600x600) for "original" look
                albumCover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '600x600') : '',
                song: item.previewUrl,
                releaseYear: new Date(item.releaseDate).getFullYear(),
                duration: item.trackTimeMillis
            }))
        } catch (error) {
            this.error = error.message
            console.error("Failed to fetch tracks:", error)
        }
    },

    async fetchHomeSections() {
       
        const categories = [
            
            { title: 'Pop Essentials', term: 'pop hits', media: 'music', entity: 'song' },
            { title: 'Rock Classics', term: 'rock legends', media: 'music', entity: 'song' },
            { title: 'Hip-Hop Culture', term: 'rap hits', media: 'music', entity: 'song' },
            { title: 'Best Selling Audiobooks', term: 'biography', media: 'audiobook', entity: 'audiobook' }
        ]

        try {
            const promises = categories.map(async (cat) => {
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cat.term)}&media=${cat.media}&entity=${cat.entity}&limit=5`)
                const data = await res.json()
                return {
                    title: cat.title,
                    items: data.results.map(item => ({
                        id: item.trackId || item.collectionId,
                        title: item.trackName || item.collectionName,
                        subTitle: item.artistName,
                       
                        searchQuery: `${item.artistName} ${item.trackName || item.collectionName}`,

                        image: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '600x600') : '',
                        trackData: {
                            id: item.trackId || item.collectionId,
                            name: item.trackName || item.collectionName,
                            artistName: item.artistName,
                            albumCover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '600x600') : '',
                            song: item.previewUrl, 
                            duration: item.trackTimeMillis
                        }
                    }))
                }
            })
            this.homeSections = await Promise.all(promises)
        } catch (e) {
            console.error("Failed to fetch home sections", e)
        }
    },

    async fetchTopArtists() {
        // List of artists including Asxa Prince as requested
        const artistNames = [
            'V $ X V PRiNCE', // Moved to first position
            'The Weeknd', 
            'Taylor Swift', 
            'Drake', 
            'BTS', 
            'Ariana Grande', 
            'Eminem', 
            'Bad Bunny', 
            'Justin Bieber', 
            'Kanye West'
        ]
        
        try {
            const promises = artistNames.map(async (name) => {
                // Fetch 1 track to get artist details/image
                const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&media=music&entity=song&limit=1`)
                const data = await res.json()
                const item = data.results[0]
                return item ? {
                    id: item.artistId,
                    title: item.artistName,
                    subTitle: 'Artist',
                    searchQuery: item.artistName, // Search for the artist name
                    image: item.artworkUrl100 ? item.artworkUrl100.replace('100x100', '600x600') : ''
                } : null
            })
            const results = await Promise.all(promises)
            this.topArtists = results.filter(Boolean)
        } catch (e) {
            console.error("Failed to fetch top artists", e)
        }
    },

    loadSong(artist, track, list = null) {
      this.currentArtist = artist
      this.currentTrack = track

      if (list) {
          this.currentList = list
      }

      if (this.audio && this.audio.src) {
        this.audio.pause()
        this.isPlaying = false
        this.audio.src = ''
      }

      this.audio = new Audio()
      this.audio.src = track.song

      setTimeout(() => {
        this.isPlaying = true
        this.audio.play()
      }, 200)

      this.addToRecentlyPlayed(track)
    },

    addToRecentlyPlayed(track) {
        const index = this.recentlyPlayed.findIndex(t => t.id === track.id)
        if (index > -1) {
            this.recentlyPlayed.splice(index, 1)
        }
        this.recentlyPlayed.unshift(track)
        if (this.recentlyPlayed.length > 20) {
            this.recentlyPlayed.pop()
        }
    },

    clearRecentlyPlayed() {
        this.recentlyPlayed = []
    },

    playOrPauseSong() {
      if (!this.audio) return
      if (this.audio.paused) {
        this.isPlaying = true
        this.audio.play()
      } else {
        this.isPlaying = false
        this.audio.pause()
      }
    },

    playOrPauseThisSong(artist, track, list = null) {
      if (!this.audio || !this.audio.src || this.currentTrack.id !== track.id) {
        this.loadSong(artist, track, list)
        return
      }
      this.playOrPauseSong()
    },

    prevSong(currentTrack) {
        let list = this.currentList
        if (!list || list.length === 0) list = artist.tracks
        
        if (this.isShuffle) {
             let randomIndex = Math.floor(Math.random() * list.length)
             const track = list[randomIndex]
             this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, list)
             return
        }

        let index = list.findIndex(t => t.id === currentTrack.id)
        if (index > 0) {
            const track = list[index - 1]
            this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, list)
        } else {
             const track = list[list.length - 1]
             this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, list)
        }
    },

    nextSong(currentTrack) {
        if (this.repeatMode === 2) { // Repeat One
            this.loadSong(this.currentArtist, currentTrack, this.currentList)
            return
        }

        let list = this.currentList
        if (!list || list.length === 0) list = artist.tracks

        if (this.isShuffle) {
            let randomIndex = Math.floor(Math.random() * list.length)
            if (list.length > 1 && list[randomIndex].id === currentTrack.id) {
                randomIndex = (randomIndex + 1) % list.length
            }
            const track = list[randomIndex]
            this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, list)
            return
        }

        let index = list.findIndex(t => t.id === currentTrack.id)
        if (index < list.length - 1) {
            const track = list[index + 1]
            this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, list)
        } else {
            if (this.repeatMode === 1) { // Repeat All
                const track = list[0]
                this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, list)
            } else {
                const track = list[0]
                this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, list)
            }
        }
    },

    playFromFirst() {
      this.resetState()
      let track = this.searchTracks.length > 0 ? this.searchTracks[0] : artist.tracks[0]
      this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track, this.searchTracks)
    },

    resetState() {
      this.isPlaying = false
      this.audio = null
      this.currentArtist = null
      this.currentTrack = null
    },

    toggleLike(track) {
      const index = this.likedTracks.findIndex(t => t.id === track.id)
      if (index > -1) {
        this.likedTracks.splice(index, 1)
      } else {
        this.likedTracks.push(track)
      }
    },

    isLiked(trackId) {
      return this.likedTracks.some(t => t.id === trackId)
    },

    createPlaylist(name) {
      const playlist = {
        id: Date.now(),
        name: name,
        tracks: [],
      }
      this.playlists.push(playlist)
      return playlist
    },

    addTrackToPlaylist(playlistId, track) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        if (!playlist.tracks.some(t => t.id === track.id)) {
            playlist.tracks.push(track)
        }
      }
    },

    removeTrackFromPlaylist(playlistId, trackId) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        const index = playlist.tracks.findIndex(t => t.id === trackId)
        if (index > -1) {
          playlist.tracks.splice(index, 1)
        }
      }
    },

    deletePlaylist(playlistId) {
      const index = this.playlists.findIndex((p) => p.id === playlistId)
      if (index > -1) {
        this.playlists.splice(index, 1)
      }
    },

    updatePlaylist(playlistId, updates) {
      const playlist = this.playlists.find((p) => p.id === playlistId)
      if (playlist) {
        if (updates.name !== undefined) playlist.name = updates.name
        if (updates.description !== undefined) playlist.description = updates.description
        if (updates.image !== undefined) playlist.image = updates.image
      }
    },
  },
  persist: true,
})