import { Link } from "react-router-dom"

export default function ViewResponses() {
  const players = [
    {
      id: "481",
      name: "Player",
      random: "Random 481",
      votedFor: "Player 902",
      response: ""
    },
    {
      id: "902",
      name: "Player",
      random: "Random 902",
      votedFor: "Rahim (Human)",
      response: ""
    },
    {
      id: "115",
      name: "Player",
      random: "Random 115",
      votedFor: "Player 632",
      response: ""
    },
    {
      id: "632",
      name: "Player",
      random: "Random 632",
      votedFor: "Rahim (Human)",
      response: ""
    },
    {
      id: "704",
      name: "Player",
      random: "Random 704",
      votedFor: "Player 115",
      response: ""
    }
  ];

  // SVG representation of a user silhouette circle
  const AvatarIcon = () => (
    <div className="avatar">
      <svg className="avatar-svg" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
  );

  return (
    <div className="container">
      <div className="players-container">
        {/* Top Row: 3 Players */}
        <div className="players-row">
          {players.slice(0, 3).map((player) => (
            <div className="player-card" key={player.id}>
              <div className="player-header">
                <AvatarIcon />
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-random">{player.random}</div>
                  <div className="voted-for">Voted for: {player.votedFor}</div>
                </div>
              </div>
              <div className="response-box">
                {player.response}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row: 2 Players */}
        <div className="players-row">
          {players.slice(3, 5).map((player) => (
            <div className="player-card" key={player.id}>
              <div className="player-header">
                <AvatarIcon />
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-random">{player.random}</div>
                  <div className="voted-for">Voted for: {player.votedFor}</div>
                </div>
              </div>
              <div className="response-box">
                {player.response}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation demo helper for development / presentation */}
      <div className="navigation-demo-bar">
        <Link to="/you-win" className="btn">
          Go to Win Screen
        </Link>
        <Link to="/you-lose" className="btn">
          Go to Lose Screen
        </Link>
        <Link to="/" className="btn secondary">
          Back to Start Game
        </Link>
      </div>
    </div>
  )
}