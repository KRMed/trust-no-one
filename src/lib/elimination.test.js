import { describe, it, expect } from 'vitest'
import { tallyVotes, getEliminatedId, checkWinner } from './elimination'

const votes = [
  { id: 'human', vote: 'ai1' },
  { id: 'ai2', vote: 'ai1' },
  { id: 'ai3', vote: 'human' }, 
]
describe('tallyVotes', () => {
  it('counts votes per player', () => {
  expect(tallyVotes(votes)).toEqual({ai1: 2, human: 1})
})
it('returns an empty object when no one votes', () => {
  expect(tallyVotes([])).toEqual({})
})

})

describe('getEliminatedId', () => {
  it('returns the id with most votes', () => {
    expect(getEliminatedId(votes)).toEqual('ai1')
  })
  it('picks no one when votes are ties', () => {
    const tied_votes=[
      { id: 'a', vote:  'x'},
      { id: 'b', vote: 'y'},
    ]
    expect(getEliminatedId(tied_votes)).toEqual('y')
  })
})
const players = [
  { id: 'ai1', state: false },
  { id: 'human', state: true },
  { id: 'ai2', state: false },
]
describe('checkWinner', () => {
  it('returns true when the human is only one left', () => {
  expect(checkWinner(players)).toEqual(true)
  })

  it('return false when the human was already elimination', () => {
    const players = [
      { id: 'human', state: false },
      { id: 'ai1', state: true },
    ]
    expect(checkWinner(players)).toBe(false)
  })

  it('returns false when more than one play is still alive', () => {
    const players = [
      { id: 'human', state: true },
      { id: 'ai1', state: true },
      { id: 'ai2', state: false },
    ]
    expect(checkWinner(players)).toBe(false)
  })
})