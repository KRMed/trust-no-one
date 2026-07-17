import { Link } from 'react-router';

function LoginPage() {
  return(
    <div className="loginpage">
      <h1> Trust No One </h1>

      <div className="auth-card">
        <label>
          Email
        <input type = "email" />
        </label>

        <label>
          Password
          <input type = "password" />
        </label>

        <button>Log in</button>

        <Link to="/register" className="auth-link">
        Go to register
        </Link>
      </div>
    </div>
  );
}

export default LoginPage
