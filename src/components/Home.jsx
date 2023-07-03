import { useAuth } from "../context/AuthCotext";
import GetPosts from "./getPosts/GetPosts";
import AdddPost from "./AddPost/AdddNewPost";
import "./Home.css";
export default function Home() {
  const { logout, currentUser, addPost } = useAuth();

  return (
    <div className="HomeContainer">
      <div className="homeHeader">
      <img className="Logo" src="./Images/Logo.png" alt="logo" />

        <button onClick={logout}>Logout</button>
      </div>
      <div className="postsContainers">
      <AdddPost />
      <GetPosts />
      </div>
  
    </div>
  );
}
