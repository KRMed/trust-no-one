import { Link, useLocation, useNavigate } from "react-router-dom"
import icon from "/person.png"

export default function ViewResponses() {
  const location = useLocation();
  const navigate = useNavigate();
  const responses = location.state?.responses || [];
  const playersState = location.state?.players || [];
  const question = location.state?.question || "";

  const players = playersState.length > 0 ? playersState.map(p => {
    const rObj = responses.find(r => r.id === p.id);
    return {
      id: p.id,
      name: p.name,
      random: p.id === 'human' ? 'Human' : (p.id || 'AI Model'),
      votedFor: 'Pending',
      response: rObj ? rObj.response : ''
    };
  }) : [
    {
      id: "481",
      name: "Player",
      random: "Random 481",
      votedFor: "Player 902",
      response: "Messi is obviously better, his stats are crazy."
    },
    {
      id: "902",
      name: "Player",
      random: "Random 902",
      votedFor: "Rahim (Human)",
      response: "Ronaldo has proven himself in multiple leagues."
    },
    {
      id: "115",
      name: "Player",
      random: "Random 115",
      votedFor: "Player 632",
      response: "Both are legends, but Messi has the World Cup."
    },
    {
      id: "632",
      name: "Player",
      random: "Random 632",
      votedFor: "Rahim (Human)",
      response: "I prefer watching Ronaldo play."
    },
    {
      id: "704",
      name: "Player",
      random: "Random 704",
      votedFor: "Player 115",
      response: "It is a tough call, both are great."
    }
  ];

  return (
    <div className="container">
      <div className="players-container">
        {/* Top Row: 3 Players */}
        <div className="players-row">
          {players.slice(0, 3).map((player) => (
            <div className="player-card" key={player.id}>
              <div className="player-header">
                <img className="person-icon" src={icon} alt="Icon of a person." style={{ width: "44px", height: "44px", objectFit: "contain" }} />
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
                <img className="person-icon" src={icon} alt="Icon of a person." style={{ width: "44px", height: "44px", objectFit: "contain" }} />
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
        {playersState.length > 0 && (
          <button className="btn" onClick={() => navigate('/lobby', { state: { phase: 'voting', responses, players: playersState, question } })}>
            Continue to Vote
          </button>
        )}
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