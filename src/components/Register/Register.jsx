import React, { useRef, useState } from "react";
import "./Register.css";
import { useAuth } from "../../context/AuthCotext";
import { Link } from "react-router-dom";

export default function Register() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameref = useRef();
  const { register, setError, signInWithGoogle } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  async function handelChange(e) {
    e.preventDefault();

    setIsLoading(true);
    setError();
    await register(
      emailRef.current.value,
      passwordRef.current.value,
      nameref.current.value
    );
    setIsLoading(false);
  }

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <main className="register_container">
      <article className="Register_header">
        <img className="Logo" src="./Images/Logo.png" alt="logo" />
      </article>
      <section className="register_component">
        <section className="hero">
          <img src="./Images/hero.png" alt="welcome " />
        </section>
        <section className="Register_form">
          <h2 style={{ alignSelf: "center", fontWeight: "600" }}>
            Create Account
          </h2>
          <div className="Google_section">
            <button onClick={handleSignInWithGoogle} className="google_button">
              <img src="./Images/Google.png" alt="gmail icon" /> Sign up with
              Google
            </button>
            <p>or</p>
          </div>

          <form action="" onSubmit={handelChange}>
            <div>
              <label htmlFor="emailreg">Email</label>
              <input
                type="text"
                id="emailreg"
                className="form-control"
                ref={emailRef}
                required
              />
            </div>
            <div>
              <label htmlFor="passwordreg">Password</label>
              <input
                type="password"
                id="passwordreg"
                className="form-control"
                ref={passwordRef}
                required
              />
            </div>
            <div>
              <label htmlFor="Uname"> User Name </label>
              <input
                type="text"
                id="Uname"
                className="form-control"
                ref={nameref}
                required
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="registerbutton"
            >
              Create Account
            </button>
          </form>
          <p>
            <Link to="/login">Already have an account? Log in</Link>
          </p>
        </section>
      </section>
    </main>
  );
}
