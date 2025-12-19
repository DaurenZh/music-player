import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSongStore } from '../song'

describe('Song Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = useSongStore()
    expect(store.playlists).toHaveLength(0)
    expect(store.isPlaying).toBe(false)
  })

  it('creates a playlist correctly', () => {
    const store = useSongStore()
    store.createPlaylist('My Playlist')
    expect(store.playlists).toHaveLength(1)
    expect(store.playlists[0].name).toBe('My Playlist')
  })

  it('toggles like status', () => {
    const store = useSongStore()
    const track = { id: 1, name: 'Song' }
    
    store.toggleLike(track)
    expect(store.isLiked(1)).toBe(true)
    
    store.toggleLike(track)
    expect(store.isLiked(1)).toBe(false)
  })
})
