import "./start-game.css"
import { useNavigate } from 'react-router';

export default function StartGame() {
  const navigate = useNavigate()
  return (
    <div className="loginpage">
      <h1>Trust No One!</h1>

      <div className = "button-startgame">
        <button onClick={() => navigate("/lobby")}>
          StartGame
        </button>
        <button onClick={() => navigate("/leaderboard")}>
          Leaderboard
        </button>
      </div>
    </div>
    )
}
