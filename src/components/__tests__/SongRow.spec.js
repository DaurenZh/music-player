import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SongRow from '../SongRow.vue'
import { createTestingPinia } from '@pinia/testing'

describe('SongRow', () => {
  const mockTrack = {
    id: 1,
    name: 'Test Song',
    artistName: 'Test Artist',
    albumCover: 'test.jpg',
    duration: 30000
  }

  it('renders track name correctly', () => {
    const wrapper = mount(SongRow, {
      props: {
        track: mockTrack,
        artist: { name: 'Test Artist' },
        index: 1
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['RouterLink']
      }
    })
    expect(wrapper.text()).toContain('Test Song')
  })

  it('emits addToPlaylist event when clicked', async () => {
    const wrapper = mount(SongRow, {
      props: {
        track: mockTrack,
        artist: { name: 'Test Artist' },
        index: 1
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        stubs: ['RouterLink']
      }
    })
    
    // Simulate clicking the add button (assuming it's the one with DotsHorizontal)
    // Note: In real test, might need to find by specific class or aria-label
    const btn = wrapper.findAll('button')[1] // 0 is like, 1 is menu
    await btn.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('addToPlaylist')
  })
})
