import { useAuth } from "../context/AuthCotext";
import GetPosts from "./getPosts/GetPosts";
import AdddPost from "./AddPost/AdddNewPost";
import "./Home.css";
export default function Home() {
  const { logout } = useAuth();

  return (
    <div className="HomeContainer">
      <div className="homeHeader">
        <img className="Logo" src="./Images/Logo.png" alt="logo" />

     
        <i
          onClick={logout}
          className="fa-solid fa-right-from-bracket fa-2xl Logout"
          style={{ color: "#8077f8" }}
        ></i>
      </div>
      <div className="postsContainers">
        <AdddPost />
        <GetPosts />
      </div>
    </div>
  );
}
