import React, { useRef } from "react";
import { useAuth } from "../../context/AuthCotext";

export default function AdddPost() {
  const descriptionRef = useRef();
  const { currentUser, addPost } = useAuth();
  const handleAddPost = async () => {
    await addPost(currentUser.uid, descriptionRef.current.value);
  };

  return (
    <div>
      {console.log(currentUser)}
      <input type="text" ref={descriptionRef} />
      <button onClick={handleAddPost}>addPost</button>
    </div>
  );
}