import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ViewResponses from './view-responses'

vi.mock('../lib/model', () => ({
  getResponses: vi.fn(),
  getVotes: vi.fn(),
}))

describe ('ViewResponses', () => {
  it('shows 5player cards using fallback data when no location state is given', () => {
  render(
    <MemoryRouter>
      <ViewResponses/>
    </MemoryRouter>
  )
  expect(screen.getAllByText('Player')).toHaveLength(5)
})
})