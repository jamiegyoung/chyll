import styles from "./StartButton.module.css";

const StartButton = ({ enabled, disabled, onClick }) => (
  <button
    onClick={onClick}
    className={[styles.startButton, enabled ? styles.enabled : ''].join(' ')}
    disabled={disabled}
  >
    {enabled ? "stop adding music" : "start adding music"}
  </button>
);

export default StartButton;
