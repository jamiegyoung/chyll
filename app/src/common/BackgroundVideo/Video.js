import { useState } from "react";
import styles from "./BackgroundVideo.module.css";

const Video = ({ source }) => {
  const [isLoaded, setLoaded] = useState(false);
  const handleLoadedData = () => {
    setLoaded(true);
  };
  return (
    <div>
      <div
        className={[styles.loadingCover, isLoaded ? styles.loaded : ""].join(" ")}
      ></div>
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={handleLoadedData}
      >
        <source src={source} type="video/mp4" />
      </video>
    </div>
  );
};

export default Video;
