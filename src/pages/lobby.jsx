import "./lobby.css"
import { useState, useRef, useEffect} from "react";
import { getResponses, getVotes } from '../lib/model'
import icon from "/person.png"

export default function Lobby() {
  const [responses, setResponses] = useState([]);
  const [votes, setVotes] = useState([]);
  const [question, setQuestion] = useState('Who do you think is better, Messi or Ronaldo?'); // hardcoded for now
  const [phase, setPhase] = useState('responding');
  const finalResponse = useRef(null);
  const [timeLeft, setTimeLeft] = useState(40);

  const players = [
    { name: "[USER]" },
    { name: "[SOME AI #1]" },
    { name: "[SOME AI #2]" },
    { name: "[SOME AI #3]" },
  ];

  const PHASES = {
    RESPONDING: "responding",
    LOADING: "loading",
    INTERM: "between",
    VOTING: "voting",
    RESULTS: "results"
  };

  async function submitAnswers() {
    setPhase(PHASES.LOADING);
    try {
        const humanAnswer = finalResponse.current?.value || ''; //if user runs out of time or submits something empty
        const responses = await getResponses(question);
        const index = Math.floor(Math.random() * (responses.length + 1));
        responses.splice(index, 0, { id: 'human', response: humanAnswer });
        setResponses(responses);
        setPhase(PHASES.INTERM);
    } catch (err) {
        console.error('Failed to get responses:', err);
        setPhase(PHASES.RESPONDING);
  }
}

  async function submitVotes() {
    const voteResults = await getVotes(question, responses);
    setVotes(voteResults);
  }

  useEffect(() => {
    if (phase !== PHASES.RESPONDING && phase !== PHASES.VOTING) return;
    setTimeLeft(40);
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (timeLeft > 0) return;
    if (phase === PHASES.RESPONDING) submitAnswers();
  }, [timeLeft]);

  useEffect(() => {
    if (phase !== PHASES.VOTING) return;
    submitVotes();
  }, [phase]);

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
          <p>{question}</p>
        </div>

        {(phase === PHASES.RESPONDING || phase === PHASES.VOTING) && (
        <div className="timer">
          <p>{timeLeft}s</p>
        </div>
        )}

      <div className="action">
        {phase === PHASES.RESPONDING && (
          <>
            <textarea ref={finalResponse} placeholder="Type your answer..." />
            <button onClick={submitAnswers}>Submit</button>
          </>
        )}

        {phase === PHASES.LOADING && (
          <p>Generating AI responses...</p>
        )}

        {phase === PHASES.INTERM && (
          <div>
            {responses.map((r, i) => (
              <p key={i}>{i + 1}. {r.response}</p>
            ))}
            <button onClick={() => setPhase(PHASES.VOTING)}>Continue to Vote</button>
          </div>
        )}

        {phase === PHASES.VOTING && (
          <div>
            {responses.map((r, i) => (
              <p key={i}>{i + 1}. {r.response}</p>
            ))}
            {votes.length > 0 && votes.map((v) => (
              <p key={v.id}>{v.id} voted: #{v.vote}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
