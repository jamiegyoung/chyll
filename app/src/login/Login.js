import BackgroundVideo from "../common/BackgroundVideo/BackgroundVideo";
import React, { useEffect, useState } from "react";
import bgVideo from "../media/bg.mp4";
import Logo from "../common/Logo/Logo";
import styles from "./Login.module.css";
import useFetch from "../common/useFetch";

const Login = () => {
  const userCountRes = useFetch("/api/v1/user_count");
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    if (!userCountRes.response) return;
    if (userCountRes.response.count) {
      setUserCount(userCountRes.response.count);
    }
  }, [userCountRes, userCount]);

  return (
    <div>
      <BackgroundVideo source={bgVideo}></BackgroundVideo>
      <div className={styles.loginOuterContainer}>
        <div className={styles.loginInnerContainer}>
          <p className={styles.text} style={{ marginTop: 10 }}>
            add some
          </p>
          <Logo size="128"></Logo>
          <p className={styles.text}>to your playlist</p>
          <div className={styles.loginButtonContainer}>
            <a
              href="/api/v1/submit_login"
              className={[styles.loginButton, "noselect"].join(" ")}
              type="button"
            >
              login
            </a>
          </div>
          <div className={styles.subtextContainer}>
            <p className={styles.subtext}>
              lofi beats added daily <span className={styles.avoidwrap}>(17:00 UTC)</span> to a playlist of your choosing
            </p>
            <p
              className={styles.subtext}
              style={{
                borderTop: "1px solid #9da1b3",
                opacity: userCount ? 1 : 0,
              }}
            >
              {userCount} users are currently vibing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
