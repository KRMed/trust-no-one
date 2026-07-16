import { Link } from 'react-router';

function RegisterPage() {
  return (
    <div className="loginpage">
      <h1> Create an account</h1>

      <div className="auth-card">
        <label>
          Username
          <input  type = "text"/>
        </label>

        <label>
          Email
          <input type = "email" />
        </label>

        <label>
          Password
          <input type = "password" />
        </label>

        <button>Create Account</button>

        <Link to="/login" className="auth-link">
           Go to Login
        </Link>
      </div>
    </div>
  );
}
export default RegisterPage;