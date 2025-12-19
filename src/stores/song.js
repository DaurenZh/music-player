import { defineStore } from 'pinia'
import artist from '../artist.json'

export const useSongStore = defineStore('song', {
    state: () => ({
        isPlaying: false,
        audio: null,
        currentArtist: null,
        currentTrack: null,
        likedTracks: [],
        playlists: []
    }),
    actions: {
        loadSong(artist, track) {
            this.currentArtist = artist
            this.currentTrack = track

            if (this.audio && this.audio.src) {
                this.audio.pause()
                this.isPlaying = false
                this.audio.src = ''
            }

            this.audio = new Audio()
            this.audio.src = '/' + track.song

            setTimeout(() => {
                this.isPlaying = true
                this.audio.play()
            }, 200)
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
            if (!this.audio || !this.audio.src || (this.currentTrack.id !== track.id)) {
                this.loadSong(artist, track)
                return
            }

            this.playOrPauseSong()
        },

        prevSong(currentTrack) {
            let track = artist.tracks[currentTrack.id - 2]
            this.loadSong(artist, track)
        },

        nextSong(currentTrack) {
            if (currentTrack.id === artist.tracks.length) {
                let track = artist.tracks[0]
                this.loadSong(artist, track)
            } else {
                let track = artist.tracks[currentTrack.id]
                this.loadSong(artist, track)
            }
        },

        playFromFirst() {
            this.resetState()
            let track = artist.tracks[0]
            this.loadSong(artist, track)
        },

        resetState() {
            this.isPlaying = false
            this.audio = null
            this.currentArtist = null
            this.currentTrack = null
        },

        toggleLike(trackId) {
            const index = this.likedTracks.indexOf(trackId)
            if (index > -1) {
                this.likedTracks.splice(index, 1)
            } else {
                this.likedTracks.push(trackId)
            }
        },

        isLiked(trackId) {
            return this.likedTracks.includes(trackId)
        },

        createPlaylist(name) {
            const playlist = {
                id: Date.now(),
                name: name,
                tracks: []
            }
            this.playlists.push(playlist)
            return playlist
        },

        addTrackToPlaylist(playlistId, trackId) {
            const playlist = this.playlists.find(p => p.id === playlistId)
            if (playlist && !playlist.tracks.includes(trackId)) {
                playlist.tracks.push(trackId)
            }
        },

        removeTrackFromPlaylist(playlistId, trackId) {
            const playlist = this.playlists.find(p => p.id === playlistId)
            if (playlist) {
                const index = playlist.tracks.indexOf(trackId)
                if (index > -1) {
                    playlist.tracks.splice(index, 1)
                }
            }
        },

        deletePlaylist(playlistId) {
            const index = this.playlists.findIndex(p => p.id === playlistId)
            if (index > -1) {
                this.playlists.splice(index, 1)
            }
        },

        updatePlaylist(playlistId, updates) {
            const playlist = this.playlists.find(p => p.id === playlistId)
            if (playlist) {
                if (updates.name !== undefined) playlist.name = updates.name
                if (updates.description !== undefined) playlist.description = updates.description
                if (updates.image !== undefined) playlist.image = updates.image
                // Save to localStorage immediately after update
                localStorage.setItem('playlists', JSON.stringify(this.playlists))
            }
        },

        saveToLocalStorage() {
            localStorage.setItem('playlists', JSON.stringify(this.playlists))
        },

        loadFromLocalStorage() {
            const saved = localStorage.getItem('playlists')
            if (saved) {
                this.playlists = JSON.parse(saved)
            }
        }
    },
    persist: true
})