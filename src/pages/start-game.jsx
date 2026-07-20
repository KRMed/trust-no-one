import "./start-game.css"
import { useNavigate } from 'react-router';
import icon from "/person.png"

export default function StartGame() {
  const navigate = useNavigate()
  return (
    <div className="loginpage" style={{ backgroundImage: `url(${icon})` }}>
      <h1>Trust No One!</h1>
      <p className="game-desc">
        Welcome to Trust No One, a single player game where you are the only human hiding
        among 4 AIs. Survive all 5 rounds to win. Below is the game flow:
      </p>
      <ol className="game-steps">
        <li>Everyone is asked the same question.</li>
        <li>All the responses are revealed.</li>
        <li>Eveyone votes for who they think the human is.</li>
        <li>If the AI is voted out, the next round begins.</li>
        <li>If the group votes you out, you lose.</li>
      </ol>
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
