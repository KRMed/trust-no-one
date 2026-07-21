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

  it('counts valid votes and ignores failed votes', () => {
  const votes = [
    { id: 'human', vote: 'ai1' },
    { id: 'ai2', vote: -1 },
    { id: 'ai3', vote: 'ai1' },
    { id: 'ai4', vote: 'human' }
  ]
  expect(tallyVotes(votes)).toEqual({
    ai1: 2,
    human: 1
  })
})

it('returns an empty object when no one votes', () => {
  expect(tallyVotes([])).toEqual({})
})
})


describe('getEliminatedId', () => {

  it('returns the id with most votes', () => {
    expect(getEliminatedId(votes)).toEqual('ai1')
  })

  it('returns human when they are voted out', () => {
    const votes = [
      {id: 'ai1', vote: 'human'},
      {id: 'ai2', vote: 'human'},
      {id: 'ai2', vote: 'human'},
      {id: 'human', vote: 'ai1'},
    ]
    expect(getEliminatedId(votes)).toEqual('human')
  })
  it('returns no player when no one votes', () => {
    const votes=[
      {id: 'ai1', vote: ''}
    ]
    expect(getEliminatedId(votes)).toEqual('')
  })

  it('returns undefined when no one votes', () => {
    const votes=[
      {id: 'ai1', vote: -1},
      {id: 'human', vote: -1},
      {id: 'ai2', vote: -1},

    ]
    expect(getEliminatedId(votes)).toEqual(undefined)
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
  
  it('returns false when no players are alive', () => {
    const players = [
      { id: 'human', state: false },
      { id: 'ai1', state: false },
      { id: 'ai2', state: false },
    ]
    expect(checkWinner(players)).toBe(false)
  })

  it ('returns false when there are no players', () => {
    expect(checkWinner([])).toEqual(false)
  })
})

