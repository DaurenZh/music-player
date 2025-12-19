import { defineStore } from 'pinia'
import artist from '../artist.json'

export const useSongStore = defineStore('song', {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentArtist: null,
    currentTrack: null,
    likedTracks: [], // Stores full track objects
    playlists: [], // Stores playlists with full track objects
    searchTracks: [],
    recentlyPlayed: []
  }),
  actions: {
    async fetchTracks(term) {
        if (!term) return
        try {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=50`)
            const data = await response.json()
            
            this.searchTracks = data.results.map(item => ({
                id: item.trackId,
                name: item.trackName,
                artistName: item.artistName,
                albumName: item.collectionName,
                albumCover: item.artworkUrl100.replace('100x100', '300x300'),
                song: item.previewUrl,
                releaseYear: new Date(item.releaseDate).getFullYear(),
                duration: item.trackTimeMillis
            }))
        } catch (error) {
            console.error("Failed to fetch tracks:", error)
        }
    },

    loadSong(artist, track) {
      this.currentArtist = artist
      this.currentTrack = track

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

    playOrPauseSong() {
      if (this.audio.paused) {
        this.isPlaying = true
        this.audio.play()
      } else {
        this.isPlaying = false
        this.audio.pause()
      }
    },

    playOrPauseThisSong(artist, track) {
      if (!this.audio || !this.audio.src || this.currentTrack.id !== track.id) {
        this.loadSong(artist, track)
        return
      }
      this.playOrPauseSong()
    },

    prevSong(currentTrack) {
        let list = this.searchTracks.length > 0 ? this.searchTracks : this.recentlyPlayed
        if (list.length === 0) list = artist.tracks // Fallback
        
        let index = list.findIndex(t => t.id === currentTrack.id)
        if (index > 0) {
            const track = list[index - 1]
            this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track)
        }
    },

    nextSong(currentTrack) {
        let list = this.searchTracks.length > 0 ? this.searchTracks : this.recentlyPlayed
        if (list.length === 0) list = artist.tracks // Fallback

        let index = list.findIndex(t => t.id === currentTrack.id)
        if (index < list.length - 1) {
            const track = list[index + 1]
            this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track)
        } else {
            const track = list[0]
            this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track)
        }
    },

    playFromFirst() {
      this.resetState()
      let track = this.searchTracks.length > 0 ? this.searchTracks[0] : artist.tracks[0]
      this.loadSong(track.artistName ? { ...track, name: track.artistName } : artist, track)
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