import "./lobby.css"
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getResponses } from '../lib/model'
import icon from "/person.png"
import { createPlayers } from "../lib/players"
import { getEliminatedId, checkWinner} from "../lib/elimination"
import { getQuestion } from "../lib/prompt";
import { supabase } from "../lib/supabase";

export default function Lobby() {
  const location = useLocation();
  const [responses, setResponses] = useState(location.state?.responses || []);
  const [votes, setVotes] = useState([]);
  const [question, setQuestion] = useState(location.state?.question ?? null);
  const [phase, setPhase] = useState(location.state?.phase || 'responding');
  const finalResponse = useRef(null);
  const [timeLeft, setTimeLeft] = useState(40);
  const [players, setPlayers] = useState(location.state?.players || (() => createPlayers()));
  const activePlayers = useMemo(() => {
    return players.filter(player => player.state)
  }, [players]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [aiVotes, setAiVotes] = useState(location.state?.aiVotes || null);

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
        const activeModels = activePlayers.filter(player => player.model !== null); // To only get the active models, not the player
        const responses = await getResponses(question, activeModels);
        const index = Math.floor(Math.random() * (responses.length + 1));
        responses.splice(index, 0, { id: 'human', response: humanAnswer });
        // console.log(responses); // Testing Line
        setResponses(responses);
        navigate('/lobby/view-responses', { state: { responses, players, activePlayers, question } });
    } catch (err) {
        console.error('Failed to get responses:', err);
        setPhase(PHASES.RESPONDING);
    }
  }

  function submitVotes(userVote) { //not async anymore because we don't have to wait anymore for function call
    if (!aiVotes) return;
    setVotes([...aiVotes, userVote]);
  }

function playerElimination(roundVotes) {
  const idToEliminate = getEliminatedId(roundVotes);

  if (idToEliminate === undefined) {
    //no valid votes, skip the round or deal wit it
    setPhase(PHASES.RESPONDING);
    return;
  }

  if (idToEliminate === "human") {
    navigate("/you-lose", { state: { responses, players, question, votes: roundVotes } });
    return;
  }

    setPlayers(prevSet => prevSet.map(player => player.id === idToEliminate ? { ...player, state: false } : player));
    setAiVotes(null);
    setQuestion(null);
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

  useEffect(() => {
    if (question !== null) return;

    async function loadQuestion() {
      try {
        const questionData = await getQuestion();
        
        if (questionData.type === "word") {
          setQuestion(`Create a sentence using the word: ${questionData.data}.`)
        } else {
          setQuestion(`This article is titled ${questionData.data.title}. What do you think it's about?`);
        }
      } catch (e) {
        setQuestion('Who do you think is better, Messi or Ronaldo?');
      }
    };

    loadQuestion();
  }, [question]);

  useEffect(() => {
    supabase.auth.getUser().then((result) => {
      if (result.error) {
        console.error(result.error.message);
        return;
      }
      if (!result.data.user) {
        console.error("no auth user");
        return;
      }

      supabase
        .from("accounts")
        .select("username")
        .eq("id", result.data.user.id)
        .single()
        .then((result) => {
          if (result.error) {
            console.error(result.error.message);
            return;
          }
          setUserName(result.data.username);
          setPlayers(prev => prev.map(p => p.id === 'human' ? { ...p, name: result.data.username } : p));
        });
    });
  }, []);

  return (
      <div className="lobby">
        {players.map((player, idx) => {
          return (
            <div className={`players ${player.state ? "alive" : "eliminated"}`} id={`player-${idx}`} key={player.name}>
              <p>{player.name}</p>
              {player.state ? (
              <img className="person-icon" src={icon} alt="Icon of a person."/>
            ) : (
              <div className="eliminated-x">✕</div>
            )}
              {(phase === PHASES.VOTING && player.name != userName && player.state) && (
                <button className="btn danger" onClick={() => submitVotes({id: 'human', vote: player.id, explanation: 'Player vote'})}>Vote Out</button>
              )} 
            </div>
          )
        })}
        <div className="prompt">
          <p>{question === null ? "Loading" : question}</p>
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
            <button className="btn" onClick={submitAnswers}>Submit</button>
          </>
        )}

        {phase === PHASES.LOADING && (
          <p>Generating AI responses...</p>
        )}

        {phase === PHASES.INTERM && (
          <div>
            <button className="btn" onClick={() => setPhase(PHASES.VOTING)}>Continue to Vote</button>
          </div>
        )}

        {phase === PHASES.VOTING && (
          <div>
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