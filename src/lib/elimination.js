
export function tallyVotes(roundVotes) {
  const votesPerPlayer = {};
  for (const v of roundVotes) {
    if (v.vote === -1) continue; // ignore failed/invalid votes
    votesPerPlayer[v.vote] = (votesPerPlayer[v.vote] || 0) + 1;
  }
  return votesPerPlayer;
}

export function getEliminatedId(roundVotes) {
  const tally = tallyVotes(roundVotes);
  if (Object.keys(tally).length === 0) {
    return undefined;
  }
  return Object.entries(tally).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

export function checkWinner(players) {
  const alive = players.filter(p => p.state === true);
  return alive.length === 1 && alive[0].id === 'human';
}