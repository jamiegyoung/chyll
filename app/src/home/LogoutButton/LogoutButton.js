import styles from "./LogoutButton.module.css";

const LogoutButton = () => {
  return (
    <a className={styles.logoutButton} href="/logout">
      Logout
    </a>
  );
};

export default LogoutButton;
