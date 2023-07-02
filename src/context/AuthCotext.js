import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase_config";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, setDoc, doc, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
/****** Use Context  *****************/
const AuthContext = React.createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  /****** current user  */
  const [currentUser, setCurrentUser] = useState();
  /****************LOading state */
  const [isLoading, setIsLoading] = useState(true);
  /******************** to get the ALL Post   */
  const [Posts, setPosts] = useState([]);
  /**************to get the user picture and name for who create the post  */
  const [userPost, setUserPost] = useState([]);
  /***********to navigate between pages  */
  const navigate = useNavigate();

  const [error, setError] = useState();
  /****************************** */
  useEffect(() => {
    /*********** SET CURRENT USER TO user who login or register  ***** */
    setIsLoading(false);
    const unSubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unSubscribe;
  }, []);
  /***************************************************** */
  const userscollection = collection(db, "users");
  const postCollection = collection(db, "Posts");
  const comentCollection = collection(db, "Comments");

  /******************************** */
  const getPosts = async () => {
    const data = await getDocs(postCollection);

    setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  /************************ */
  const user = async () => {
    const data = await getDocs(userscollection);

    setUserPost(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    user();
    getPosts();
  }, []);

  /********************************************* */

  const addComment = async (userid, postid, descrption) => {
    try {
      await addDoc(comentCollection, {
        userId: userid,
        PostId: postid,
        description: descrption
      });
    } catch (err) {
      console.log(err);
    }
  };

  /************************************************* */

  const register = async (email, password, name) => {
    try {
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Set display name for the user
      const user = userCredential.user;
      await user.updateProfile({
        displayName: name
      });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber
      });
      await navigate("/Home");
    } catch (err) {
      console.log(err);
      if (err.code === "auth/invalid-email") {
        setError("InvalidEmail");
        console.log(err.message);
      } else if (err.code === "auth/email-already-in-use") {
        setError("EmailAlreadyInUse");
        console.log(err.message);
      } else {
        setError(err.message);
        console.log(err.message);
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error
      });
    }
  };

  /****************************** */
  const Login = async (email, password) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      await navigate("/Home");
    } catch (err) {
      let errorMessage = "";

      if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email";
      } else {
        errorMessage = "Email or password is not correct";
      }

      setError(errorMessage);
      console.log(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage
      });
    }
  };

  /******************* */
  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      // Sign in with Google using a pop-up window
      const userCredential = await signInWithPopup(auth, provider);

      // Get user data
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber
        // Include any other properties you want to store
      });

      // Navigate to the "Home" page after user data is stored
      await navigate("/Home");
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = () => {
    try {
      auth.signOut();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const value = {
    register,
    Login,
    signInWithGoogle,
    logout,
    addComment,
    setError,
    currentUser,
    userPost,
    error,
    Posts
  };
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && props.children}
    </AuthContext.Provider>
  );
}
