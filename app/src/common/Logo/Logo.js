import styles from "./Logo.module.css";

const Logo = ({ size }) => {
  return (
    <h1
      className={[styles.logo, "noselect"].join(" ")}
      style={{
        fontSize: `${size}px`,
      }}
    >
      chyll
    </h1>
  );
};

export default Logo;
