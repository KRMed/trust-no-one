import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      console.log(result);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    supabase.auth.signInWithPassword({ email: email, password: password }).then((result) => {
      console.log(result);
      if (result.error) {
        console.error(result.error);
      } else {
        navigate("/start-game");
      }
    });
  }

  return(
    <div className="loginpage">
      <h1> Trust No One </h1>

      <div className="auth-card">
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

        <button onClick={handleSubmit}>Log in</button>

        <Link to="/register" className="auth-link">
        Go to register
        </Link>
      </div>
    </div>
  );
}
