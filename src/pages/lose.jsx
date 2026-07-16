import { useState } from "react"
import { Link } from "react-router-dom"

export default function Lose() {
  const [showRationales, setShowRationales] = useState(false);

  const rationales = [
    {
      id: "481",
      name: "Player",
      random: "Random 481",
      reason: ""
    },
    {
      id: "902",
      name: "Player",
      random: "Random 902",
      reason: ""
    },
    {
      id: "115",
      name: "Player",
      random: "Random 115",
      reason: ""
    },
    {
      id: "632",
      name: "Player",
      random: "Random 632",
      reason: ""
    },
    {
      id: "704",
      name: "Player",
      random: "Random 704",
      reason: ""
    }
  ];

  const AvatarIcon = () => (
    <div className="avatar">
      <svg className="avatar-svg" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    </div>
  );

  if (showRationales) {
    return (
      <div className="container" style={{ justifyContent: "flex-start" }}>
        <div className="rationales-container" style={{ width: "100%" }}>
          <h2 className="rationales-header">Why did i lose</h2>
          
          <div className="players-container">
            {/* Top Row: 3 Players */}
            <div className="players-row">
              {rationales.slice(0, 3).map((player) => (
                <div className="player-card" key={player.id}>
                  <div className="player-header">
                    <AvatarIcon />
                    <div className="player-info">
                      <div className="player-name">{player.name}</div>
                      <div className="player-random">{player.random}</div>
                    </div>
                  </div>
                  <div className="response-box">
                    {player.reason}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row: 2 Players */}
            <div className="players-row">
              {rationales.slice(3, 5).map((player) => (
                <div className="player-card" key={player.id}>
                  <div className="player-header">
                    <AvatarIcon />
                    <div className="player-info">
                      <div className="player-name">{player.name}</div>
                      <div className="player-random">{player.random}</div>
                    </div>
                  </div>
                  <div className="response-box">
                    {player.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button className="btn" onClick={() => setShowRationales(false)}>
              Back to Lose Screen
            </button>
            <Link to="/lobby/view-responses" className="btn secondary">
              Back to Lobby
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="title lose">YOU LOSE</div>
      
      <div>
        <Link to="/lobby/view-responses" className="btn danger">
          Play Again
        </Link>
        <button className="btn danger" onClick={() => setShowRationales(true)}>
          Why did I lose?
        </button>
      </div>
    </div>
  )
}