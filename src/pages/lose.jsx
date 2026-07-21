import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import icon from "/person.png"

export default function Lose() {
  const [showRationales, setShowRationales] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
                    <img className="person-icon" src={icon} alt="Icon of a person." style={{ width: "44px", height: "44px", objectFit: "contain" }} />
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
                    <img className="person-icon" src={icon} alt="Icon of a person." style={{ width: "44px", height: "44px", objectFit: "contain" }} />
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
            <Link to="/lobby/view-responses-lose" state={location.state} className="btn secondary">
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
        <Link to="/start-game" state={location.state} className="btn danger">
          Play Again
        </Link>
        <button className="btn danger" onClick={() => navigate("/lobby/view-responses-lose", { state: location.state })}>
          Why did I lose?
        </button>
      </div>
    </div>
  )
}