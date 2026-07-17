import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      console.log(result);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    supabase.auth.signUp({ email, password }).then((result) => {
      if (result.error) {
        console.error(result.error);
        return;
      }

      const userId = result.data.user.id;
      supabase
        .from("accounts")
        .insert({ id: userId, username })
        .then((insertResult) => {
          if (insertResult.error) {
            console.error(insertResult.error);
          } else {
            navigate("/start-game");
          }
        });
    });
  };

  return (
    <div className="loginpage">
      <h1> Create an account</h1>

      <div className="auth-card">
        <label>
          Username
          <input  
            type = "text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          Email
          <input 
            type = "email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input 
            type = "password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button onClick={handleSubmit}>Create Account</button>

        <Link to="/login" className="auth-link">
           Go to Login
        </Link>
      </div>
    </div>
  );
}