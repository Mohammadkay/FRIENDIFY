import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase_config";
import { useNavigate } from "react-router-dom";
import {
  getDocs,
  collection,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  query
} from "firebase/firestore";
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
  const [Users, setUsers] = useState([]);

  /***************Get comments */
  const [comments, setComments] = useState([]);
  /***********to navigate between pages  */
  const navigate = useNavigate();

  const [error, setError] = useState();
  /****************************** */

  /***************************************************** */
  const userscollection = collection(db, "users");
  const postCollection = collection(db, "Posts");
  const comentCollection = collection(db, "Comments");

  /******************************** */
  const getPosts = async () => {
    const Q = query(postCollection, orderBy("postDate", "desc"));
    const querySnapshot = await getDocs(Q);
    const posts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }));
    setPosts(posts);
  };

  /*************GET USERS *********** */
  const user = async () => {
    const data = await getDocs(userscollection);

    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
      await auth.signInWithEmailAndPassword(email, password);
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
      window.location.reload();
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
  /**********************Add Post  **********************/
  const addPost = async (userid, descrption) => {
    try {
      const docRef = await addDoc(postCollection, {
        descption: descrption,
        userID: userid,
        postDate: new Date().toISOString()
      });
      const newPost = {
        id: docRef.id,
        descption: descrption,
        userID: userid,
        postDate: new Date().toISOString()
      };
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something going wrong try again"
      });
    }
  };
  /********************* Delete Post ****************/
  const Delete = async (PostId) => {
    try {
      const delpost = doc(db, "Posts", PostId);
      await deleteDoc(delpost);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== PostId));

      const commentQuerySnapshot = await getDocs(comentCollection);
      commentQuerySnapshot.docs.map((ele) => {
        const comment = ele.data();
        if (comment.PostId === PostId) {
          const delcomment = doc(db, "Comments", ele.id);
          deleteDoc(delcomment);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  /******************Edit post **********************/
  const EditPost = async (PostId, description) => {
    try {
      const editPost = doc(db, "Posts", PostId);
      await updateDoc(editPost, {
        descption: description
      });

      // Update the Posts state with the edited post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === PostId ? { ...post, descption: description } : post
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  /******************* ADD COMMENT ************************** */

  const addComment = async (userid, postid, descrption) => {
    try {
      const docRef = await addDoc(comentCollection, {
        userId: userid,
        PostId: postid,
        description: descrption,
        //toISOString()==> save date as string in database
        Date: new Date().toISOString()
      });
      const newComment = {
        id: docRef.id,
        userId: userid,
        PostId: postid,
        description: descrption,
        Date: new Date().toISOString()
      };
      setComments((prevComment) => [...prevComment, newComment]);
    } catch (err) {
      console.log(err.code);
    }
  };

  /******************  get all comment **************/
  const getComments = async () => {
    let data = await getDocs(comentCollection);
    await setComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    setIsLoading(false);
    const unSubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    unSubscribe();
    user();
    getPosts();
    getComments();
  }, []);
  const value = {
    register,
    Login,
    signInWithGoogle,
    logout,
    addComment,
    setError,
    addPost,
    Delete,
    EditPost,
    comments,
    currentUser,
    Users,
    error,
    Posts
  };
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && props.children}
    </AuthContext.Provider>
  );
}
