import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Win from './win'
import Lose  from './lose'

describe('Win', () => {
  it('shows you win title and play again link', () => {
    render(
      <MemoryRouter>
        <Win/>
      </MemoryRouter>
    )
    expect(screen.getByText('YOU WIN')).toBeInTheDocument()
    expect(screen.getByRole('link', {name:/play again/i})).toBeInTheDocument()
  })
})

describe('Lose', () => {
  it('shows You Lose by default', () => {
    render (
      <MemoryRouter>
        <Lose/>
      </MemoryRouter>
    )
    expect(screen.getByText('YOU LOSE')).toBeInTheDocument()
    
  })
})