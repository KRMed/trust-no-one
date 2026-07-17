import "./lobby.css"
import icon from "/person.png"

import { useEffect, useState, useRef } from "react"

export default function Lobby() {
  const finalResponse = useRef('');

  const PHASES = {
    RESPONDING: "responding",
    INTERM: "between",
    VOTING: "voting"
  }
  const [phase, setPhase] = useState(PHASES.RESPONDING);

  const players = [
    { name:"[USER]"},
    { name:"[SOME AI #1]"},
    { name:"[SOME AI #2]"},
    { name:"[SOME AI #3]"},
    { name:"[SOME AI #4]"}
  ];

  useEffect(() => {
    if (phase !== PHASES.RESPONDING) return;

    const timer = setTimeout(() => {
      setPhase(PHASES.INTERM);
      // displayResult();
    }, 5000);

    return () => clearTimeout(timer);
  }, [phase]);

  // function displayResult() {
  //   console.log(finalResponse.current.value);
  // }

  return (
      <div className="lobby">
        {players.map((player, idx) => {
          return (
            <div className="players" id={`player-${idx}`} key={player.name}>
              <p>{player.name}</p>
              <img className="person-icon" src={icon} alt="Icon of a person."/>
            </div>
          )
        })}
        <div className="prompt">
          <p>Hello! Prompt here...</p>
        </div>
        <div className="action">
          {phase === PHASES.RESPONDING && (
            <textarea ref={finalResponse} />
          )}
          {phase === PHASES.INTERM && (
            <button onClick={(e) => setPhase(PHASES.VOTING)}>Continue to Vote</button>
          )}
        </div>
      </div>
    )
}