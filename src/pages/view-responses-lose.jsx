import { Link, useLocation } from "react-router-dom"
import icon from "/person.png"

export default function WhyDidILose() {
  const location = useLocation();
  const playersState = location.state?.players || [];
  const votes = location.state?.votes || [];

  if (!location.state) {
    return <div>ERROR: state is missing</div>;
  }
  if (votes.length === 0) {
    return <div>No votes found. State: {JSON.stringify(location.state)}</div>;
  }

  const rows = votes.map((v, index) => {
    const voter = playersState.find(p => p.id === v.id);
    const target = playersState.find(p => p.id === v.vote);
    return {
      key: `${v.id}-${index}`,
      name: voter?.name || `Player ${index + 1}`,
      label: v.id === 'human' ? 'Human' : (v.id || 'AI Model'),
      votedFor: target?.name || 'Unknown',
      explanation: v.explanation || '',
    };
  });

  return (
    <div className="container">
      <h2>Why did I lose?</h2>
      <div className="players-container">
        <div className="players-row">
          {rows.map((r) => (
            <div className="player-card" key={r.key}>
              <div className="player-header">
                <img
                  className="person-icon"
                  src={icon}
                  alt="Icon of a person."
                  style={{ width: "44px", height: "44px", objectFit: "contain" }}
                />
                <div className="player-info">
                  <div className="player-name">{r.name}</div>
                  <div className="player-random">{r.label}</div>
                  <div className="voted-for">Voted for: {r.votedFor}</div>
                </div>
              </div>
              <div className="response-box">{r.explanation}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="navigation-demo-bar">
        <Link to="/start-game" className="btn secondary">Back to Start Game</Link>
      </div>
    </div>
  )
}