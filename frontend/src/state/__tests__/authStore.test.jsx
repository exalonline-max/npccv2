import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useAuthStore } from '../authStore'
import api from '../../lib/api'

vi.mock('../../lib/api')

describe('authStore.fetchMe', () => {
  beforeEach(() => {
    // reset store
    act(() => {
      useAuthStore.setState({ user: null, memberships: [] })
    })
  })

  it('sets user and memberships when /me returns data', async () => {
    api.get.mockResolvedValue({ data: { user: { id: 1, display_name: 'Test' }, memberships: [{ id: 1, account: { slug: 'x' }, role: 'dm' }] } })

    await act(async () => {
      const res = await useAuthStore.getState().fetchMe()
      expect(useAuthStore.getState().user).toEqual({ id: 1, display_name: 'Test' })
      expect(useAuthStore.getState().memberships.length).toBe(1)
    })
  })
})
