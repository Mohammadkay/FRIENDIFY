import React, { useRef } from "react";
import { useAuth } from "../../context/AuthCotext";
import Swal from "sweetalert2";
import "./Addpost.css";
export default function AdddPost() {
  const descriptionRef = useRef();
  const { currentUser, addPost } = useAuth();
  const handleAddPost = async () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1000
    });
    await addPost(currentUser.uid, descriptionRef.current.value);
  };

  return (
    <div className="addPost">
      <div>
        <img
          className="addPostphoto"
          src={
            currentUser && currentUser.photoURL
              ? currentUser.photoURL
              : "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
          }
          alt={currentUser && currentUser.displayName}
        />
        <p>{currentUser && currentUser.displayName}</p>
      </div>
      <textarea type="text" ref={descriptionRef}></textarea>
      <button onClick={handleAddPost}>addPost</button>
    </div>
  );
}
