
export function tallyVotes(roundVotes) {
  const votesPerPlayer = {};
  for (const v of roundVotes) {
    votesPerPlayer[v.vote] = (votesPerPlayer[v.vote] || 0) + 1;
  }
  return votesPerPlayer;
}

export function getEliminatedId(roundVotes) {
  const tally = tallyVotes(roundVotes);
  return Object.entries(tally).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

export function checkWinner(players) {
  const alive = players.filter(p => p.state === true);
  return alive.length === 1 && alive[0].id === 'human';
}