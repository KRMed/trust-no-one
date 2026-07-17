import "./lobby.css"
import { useState, useEffect } from "react";
import { getResponses, getVotes } from '../lib/model'
import icon from "/person.png"

export default function Lobby() {

  const [responses, setResponses] = useState([]);
  const [votes, setVotes] = useState([]);
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState('question');
  const players = [
    { name:"[USER]"},
    { name:"[SOME AI #1]"},
    { name:"[SOME AI #2]"},
    { name:"[SOME AI #3]"},
    { name:"[SOME AI #4]"}
  ];

  const PHASES = {
    RESPONDING: "responding",
    INTERM: "between",
    VOTING: "voting"
  }

  useEffect(() => {
    if (phase !== PHASES.RESPONDING) return;

    const timer = setTimeout(() => {
      setPhase(PHASES.INTERM);
      // displayResult();
    }, 5000);

    return () => clearTimeout(timer);
  }, [phase]);

  async function submitAnswers(question) { //needs to be updated to take all quesitons
    const responses = await getResponses(question);
    const index = Math.floor(Math.random() * (responses.length + 1))
    responses.splice(index, 0, { modelId: 'human', response: humanAnswer }) //at position index, add human response

    setResponses(responses);
    setPhase('voting');
  }
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
}