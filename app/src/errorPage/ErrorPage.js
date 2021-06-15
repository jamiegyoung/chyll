import BackgroundVideo from "../common/BackgroundVideo/BackgroundVideo";
import bgVideo from "../media/404.mp4";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  return (
    <div>
      <BackgroundVideo source={bgVideo}></BackgroundVideo>
      <div className={styles.container}>
        <p>hi, I think you're lost...</p>
        <p>
          click{" "}
          <a href="/" style={{ color: "#faf16e" }}>
            here
          </a>{" "}
          to head back home
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
