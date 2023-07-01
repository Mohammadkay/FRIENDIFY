import React, { useRef, useState } from "react";
import "./Register.css";
import { useAuth } from "../../context/AuthCotext";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameref = useRef();
  const { register, currentUser, signInWithGoogle } = useAuth();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function handelChange(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError();
      await register(
        emailRef.current.value,
        passwordRef.current.value,
        nameref.current.value
      );

      await navigate("/Home");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("InvalidEmail");
      } else if (err.code === "auth/email-already-in-use") {
        setError("EmailAlreadyInUse");
      } else {
        setError(err.message);
      }
    }
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
    /**** 

    /*******  */

    /********  */

    <main>
      <section></section>
      <section>
        <button onClick={handleSignInWithGoogle} className="google_button">
          <img src="./Images/Google.png" alt="gmail icon" /> Register with google
        </button>
        <input
          type="text"
          id="form3Example3c"
          className="form-control"
          ref={emailRef}
          required
        />

        <input
          type="password"
          id="form3Example4c"
          className="form-control"
          ref={passwordRef}
          required
        />
        <input
          type="text"
          id="form3Example4cd"
          className="form-control"
          ref={nameref}
          required
        />
        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary btn-lg"
        >
          Register
        </button>
      </section>
    </main>
  );
}
