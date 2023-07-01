import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthCotext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { logout, currentUser, Posts, userPost, addComment } = useAuth();
  const commentRefs = useRef([]);

  const handelComment = async (postid, index) => {
    try {
      const comment = commentRefs.current[index].value;
      addComment(currentUser.uid, postid, comment);
      console.log("comment is added");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
      {Posts.map((ele, index) => {
        const filteredPost = userPost.find((e) => e.uid === ele.userID);

        return (
          <div key={ele.id}>
            <img
              src={filteredPost.photoURL}
              alt={filteredPost.name}
              style={{ borderRadius: "50%" }}
            />
            <h5>{filteredPost.name}</h5>
            <p>{ele.descption}</p>
            <input
              type="text"
              ref={(el) => (commentRefs.current[index] = el)}
            />
            <button onClick={() => handelComment(ele.id, index)}>
              Add Comment
            </button>
          </div>
        );
      })}

      <h1>Home</h1>
    </div>
  );
}
