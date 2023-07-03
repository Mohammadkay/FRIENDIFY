import React, { useRef } from "react";
import { useAuth } from "../context/AuthCotext";

import AdddPost from "./AddPost/AdddNewPost";
export default function Home() {
  const { logout, currentUser, Posts, Users, addComment, addPost, comments } =
    useAuth();
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
  const getComments = (id) => {
    const x = comments
      .filter((ele) => ele.PostId === id)
      .map((e) => {
        return <p key={e.id}>{e.description}</p>;
      });
    return x;
  };
  return (
    <div>
      <button onClick={logout}>Logout</button>
      <AdddPost currentUse={currentUser} addPost={addPost} />
      {Posts.map((ele, index) => {
        //find the user who Posts this post
        const filteredPost = Users.find((e) => e.uid === ele.userID);

        return (
          <div key={ele.id} style={{ border: "solid 2px " }}>
            <img
              src={
                filteredPost.photoURL != null
                  ? filteredPost.photoURL
                  : "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
              }
              alt={filteredPost.name}
              style={{
                borderRadius: "50%",
                height: "100px",
                width: "100px",
                objectFit: "cover"
              }}
            />
            <h5>{filteredPost.name}</h5>
            <p>{ele.descption}</p>
            <input
              type="text"
              ref={(el) => (commentRefs.current[index] = el)}
            />
            <div style={{ paddingLeft: "50px" }}>{getComments(ele.id)}</div>
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
