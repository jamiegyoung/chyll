import BackgroundVideo from "../common/BackgroundVideo/BackgroundVideo";
import bgVideo from "../media/homebg.mp4";
import LogoutButton from "./LogoutButton/LogoutButton";
import Playlists from "./Playlists";

const Home = () => {
  return (
    <div>
      <BackgroundVideo source={bgVideo}></BackgroundVideo>
      <LogoutButton></LogoutButton>
      <Playlists></Playlists>
    </div>
  );
};

export default Home;
