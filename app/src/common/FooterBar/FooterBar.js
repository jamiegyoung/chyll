import styles from "./FooterBar.module.css";
import githubLogo from "../../media/GitHub-Mark-Light-32px.png";

const FooterBar = () => (
  <div className={styles.footerBarContainer}>
    <div className={styles.footerBar}>
      <a href="https://github.com/jamiegyoung/chyll" className={styles.logoContainer}>
        <img alt={"github"} src={githubLogo} className={styles.logo}></img>
      </a>
    </div>
  </div>
);

export default FooterBar;
