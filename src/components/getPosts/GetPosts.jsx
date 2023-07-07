import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthCotext";
import Swal from "sweetalert2";
import "./GetPost.css";

export default function GetPosts() {
  const [isLoading, setIsLoading] = useState(false);
  const [editPostId, setEditPostId] = useState(null); // Track the post ID being edited
  const [postEditValue, setPostEditValue] = useState("");
  const { currentUser, Posts, Users, addComment, Delete, comments, EditPost } =
    useAuth();
  const commentRefs = useRef([]);

  // Function to handle edit button click
  const handleEdit = (id) => {
    try {
      const post = Posts.find((ele) => ele.id === id);
      setPostEditValue(post.description);
      setEditPostId(id);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle input change for edit post
  const handleEditInputChange = (e) => {
    setPostEditValue(e.target.value);
  };

  // Function to handle edit post submit
  const handleEditSubmit = (id) => {
    try {
      console.log(id);
      EditPost(id, postEditValue);
      setEditPostId(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to handle delete button click
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      setIsLoading(true);
      Delete(id);
      setIsLoading(false);
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  // Function to handle comment submit
  const handleComment = async (postId, index) => {
    try {
      const comment = commentRefs.current[index].value;
      if (comment !== "") {
        addComment(currentUser.uid, postId, comment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get comments for a post
  const getComments = (postId) => {
    return comments
      .filter((ele) => ele.PostId === postId)
      .map((e) => {
        const userComment = Users.find((user) => user.id === e.userId);

        return (
          <div key={e.id} style={{ margin: "15px" }}>
            <div className="CommentUser">
              <img
                src={
                  userComment && userComment.photoURL
                    ? userComment.photoURL
                    : "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
                }
                alt={userComment && userComment.name}
              />
              <p>
                {userComment.name}
                <br />
                <span style={{ fontSize: "12px" }}>
                  {console.log("Date from Firestore:", e.Date)}
                  {new Date(e.Date).toLocaleString()}
                </span>
              </p>
            </div>

            <p className="comment" key={e.id}>
              {e.description}
            </p>
            <hr />
          </div>
        );
      });
  };

  // Function to render the posts
  const getPosts = () => {
    return Posts.map((ele, index) => {
      // Find the user who posted this post
      const filteredPost = Users.find((e) => e.uid === ele.userID);
      const isCurrentlyEditing = editPostId === ele.id;

      // Check if the post is being currently edited

      return (
        <div key={ele.id} className="PostContantContainer">
          <div className="postContat">
            <div className="postHader">
              <div className="img_name">
                {filteredPost && filteredPost.photoURL && filteredPost.name && (
                  <img src={filteredPost.photoURL} alt={filteredPost.name} />
                )}

                <p>
                  {filteredPost && filteredPost.name ? filteredPost.name : ""}
                  <br />
                  {filteredPost && new Date(ele.postDate).toLocaleString()}
                </p>
              </div>
              {ele.userID === currentUser.uid && (
                <div className="action">
                  <i
                    className="fa-solid fa-pen-to-square fa-lg"
                    onClick={() => handleEdit(ele.id)} // Handle edit button click
                    style={{ color: "#9199a6" }}
                  ></i>
                  <i
                    className="fa-solid fa-trash fa-lg"
                    style={{ color: "#d84045" }}
                    onClick={() => handleDelete(ele.id)} // Handle delete button click
                  ></i>
                </div>
              )}
            </div>
            {!isCurrentlyEditing ? ( // Render post description if not currently editing
              <p style={{ width: "70%", margin: "9px auto" }}>
                {console.log(ele)} {ele.descption}
              </p>
            ) : (
              // Render input field for editing if currently editing
              <div className="EditsPost">
                <input
                  type="text"
                  value={postEditValue}
                  onChange={handleEditInputChange} // Handle input change for edit post
                />
                <button onClick={() => handleEditSubmit(ele.id)}>EDIT</button>
                {/* // Handle edit post submit */}
              </div>
            )}
          </div>
          {/* // Handle comment submit */}
          <div>{getComments(ele.id)}</div>
          {/* // Render comments for the post */}
          <div className="addcomments">
            <div>
              {console.log(currentUser)}
              <img
                src={
                  currentUser && currentUser.photoURL
                    ? currentUser.photoURL
                    : "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
                }
                alt="User"
              />
              <p>{currentUser.displayName}</p>
            </div>
            <input
              type="text"
              ref={(el) => (commentRefs.current[index] = el)}
            />
            <button onClick={() => handleComment(ele.id, index)}>
              Add Comment
            </button>
          </div>
        </div>
      );
    });
  };

  return !isLoading && getPosts();
}
