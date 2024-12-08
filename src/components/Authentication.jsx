/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Authentication(props) {
  const { handleCloseModal } = props;
  //* MARK: STATE
  const [isRegistration, setRegistration] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);


  //* MARK: Functions
  const { signup, login } = useAuth();

  async function handleAuthenticate() {
    if (isAuthenticating) return;
    if (
      !email ||
      !email.includes('@') ||
      !password ||
      password.length < 6 ||
      isAuthenticating
    ) {
      return;
    }
    try {
      setIsAuthenticating(true);
      setError(null);

      if (isRegistration) {
        // register a user
        await signup(email, password);
      } else {
        // login a user
        await login(email, password);
      }
      handleCloseModal();
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  }
  //* MARK: JSX
  return (
    <>
      <h2 className="sign-up-text"> {isRegistration ? 'Sign Up' : 'Log In'}</h2>
      <p>
        {isRegistration
          ? 'Create a new account!'
          : 'Sign in to your account to start tracking your caffeine consumption!'}
      </p>
      {error && (
        <p>❌{error} </p>
      )}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        name="email"
        id=""
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        name="password"
        id=""
        placeholder="******"
      />
      <button onClick={handleAuthenticate}>
        <p> {isAuthenticating ? 'Authenticating...' : 'Submit'}</p>
      </button>
      <hr />
      <div className="register-content">
        <p>
          {isRegistration
            ? 'Already have an account?'
            : "Don't have an account?"}
        </p>
        <button onClick={() => setRegistration(!isRegistration)}>
          <p>{isRegistration ? 'Sign In' : 'Sign Up'}</p>
        </button>
      </div>
    </>
  );
}
