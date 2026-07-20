import "./lobby.css"
import { useState, useRef, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getResponses, getVotes } from '../lib/model'
import icon from "/person.png"
import { createPlayers } from "../lib/players"
import { getEliminatedId, checkWinner} from "../lib/elimination"

export default function Lobby() {
  const location = useLocation();
  const [responses, setResponses] = useState(location.state?.responses || []);
  const [votes, setVotes] = useState([]);
  const [question, setQuestion] = useState(location.state?.question || 'Who do you think is better, Messi or Ronaldo?'); // hardcoded for now
  const [phase, setPhase] = useState(location.state?.phase || 'responding');
  const finalResponse = useRef(null);
  const [timeLeft, setTimeLeft] = useState(40);
  const [players, setPlayers] = useState(location.state?.players || (() => createPlayers()));
  const navigate = useNavigate();

  const userName = "[USER]";

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
        const activeModels = players.filter(player => player.state && player.model !== null); // In order to stop generating responses from eliminated agents
        const responses = await getResponses(question, activeModels);
        const index = Math.floor(Math.random() * (responses.length + 1));
        responses.splice(index, 0, { id: 'human', response: humanAnswer });
        // console.log(responses); // Testing Line
        setResponses(responses);
        navigate('/lobby/view-responses', { state: { responses, players, question } });
    } catch (err) {
        console.error('Failed to get responses:', err);
        setPhase(PHASES.RESPONDING);
    }
  }

  async function submitVotes(userVote) {
    const activeModels = players.filter(player => player.state && player.model !== null);
    const voteResults = await getVotes(question, responses, activeModels);
    setVotes([...voteResults, userVote]);
  }

  function playerElimination(roundVotes) {
    const idToEliminate = getEliminatedId(roundVotes);
    console.log(idToEliminate)

    if (idToEliminate === "human") {
      navigate("/you-lose", { state: { responses, players, question } });
    }

    setPlayers(prevSet => prevSet.map(player => player.id === idToEliminate ? { ...player, state: false } : player));
    setPhase(PHASES.RESPONDING);
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
    if (votes.length === 0) return;

    playerElimination(votes);
  }, [votes]);

  useEffect(() => {
    if (checkWinner(players)) {
      navigate("/you-win", { state: { responses, players, question } });
    }
  }, [players, responses, question, navigate]);

  return (
      <div className="lobby">
        {players.map((player, idx) => {
          return (
            <div className={`players ${player.state ? "alive" : "eliminated"}`} id={`player-${idx}`} key={player.name}>
              <p>{player.name}</p>
              <img className="person-icon" src={icon} alt="Icon of a person."/>
              {(phase === PHASES.VOTING && player.name != userName && player.state) && (
                <button onClick={() => submitVotes({id: 'human', vote: player.id})}>Vote Out</button>
              )} 
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
            {votes.length > 0 && votes.map((v) => {
              const voter = players.find(p => p.id === v.id);
              const target = players.find(p=> p.id === v.vote);

              return (
                <p key={v.id}>{voter?.name} voted for {target?.name}</p>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}