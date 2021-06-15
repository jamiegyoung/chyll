import { lazy, Suspense } from "react";
import styles from "./BackgroundVideo.module.css";

const Video = lazy(() => import("./Video"));

const BackgroundVideo = ({ source }) => (
  <Suspense fallback={<div className={styles.fallback}></div>}>
    <Video source={source}></Video>
  </Suspense>
);

export default BackgroundVideo;
