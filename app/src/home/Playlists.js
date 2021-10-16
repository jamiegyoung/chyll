import { useEffect, useState } from "react";
import Select from "react-select";
import Spinner from "../common/Spinner/Spinner";
import StartButton from "./StartButton/StartButton";
import useFetch from "../common/useFetch";
import styles from "./Playlists.module.css";
import commonStyles from "../common/Common.module.css";
import useCSRF from "../common/useCSRF";

const Playlists = () => {
  const playlistRes = useFetch("/api/v1/get_playlists");
  const csrfToken = useCSRF();

  const [selected, setSelected] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);
  const [errorMessageOpacity, setErrorMessageOpacity] = useState(0);

  const disablePlaylistAdding = () =>
    fetch("/api/v1/remove_playlist", {
      method: "PATCH",
      credentials: "same-origin",
      headers: {
        "CSRF-Token": csrfToken,
      },
    });

  const enablePlaylistAdding = async (selected) =>
    await fetch("/api/v1/set_playlist", {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "CSRF-Token": csrfToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selected),
    });

  const handleSelectChange = async (value) => {
    if (value !== selected) {
      let res = await disablePlaylistAdding();
      if (res.status === 200) {
        setEnabled(false);
        setSelected(value);
      }
    }
  };

  useEffect(() => {
    if (!playlistRes.response) return;
    if (playlistRes.response.active && !selected) {
      setSelected(
        playlistRes.response.available.find(
          (val) => val.value === playlistRes.response.active
        )
      );
      setEnabled(true);
      return;
    }
  }, [playlistRes, selected]);

  const selectStyle = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#293375" : "#202126",
      // borderRadius: '10px',
      ":hover": {
        backgroundColor: state.isSelected ? "#293375" : "#20284f",
      },
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#202126",
      border: "none",
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#b6b6d9",
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: "#202126",
      overflow: "hidden",
      marginTop: "0px",
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: "0 0 0 0",
    }),
    container: (provided, state) => ({
      ...provided,
      minWidth: "200px",
      width: "75vw",
      maxWidth: "600px",
    }),
  };

  const handleStartClick = async () => {
    if (!enabled && selected) {
      let res = await enablePlaylistAdding(selected);
      if (res.status === 200) return setEnabled(true);
      handleError();
    }
    let res = await disablePlaylistAdding();
    if (res.status === 200) return setEnabled(false);
    handleError();
  };

  const handleError = () => {
    setHasErrored(true);
  };

  useEffect(() => {
    const timeout = () => {
      if (hasErrored) {
        setErrorMessageOpacity(1);
        return setTimeout(() => {
          setErrorMessageOpacity(0);
          setTimeout(() => {
            setHasErrored(false);
          }, 200);
        }, 5000);
      }
      return;
    };
    timeout();
    return () => clearTimeout(timeout);
  }, [hasErrored]);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <p className={styles.text}>now we're here,</p>
        <p
          className={styles.text}
          style={{
            marginBottom: "20px",
          }}
        >
          select a playlist to add some vibes to:
        </p>
        <div className={styles.selectContainer}>
          {/* If there is no playlist, display a loading spinner */}
          {playlistRes.response ? (
            <Select
              onChange={handleSelectChange}
              styles={selectStyle}
              value={selected}
              options={playlistRes.response.available}
            ></Select>
          ) : (
            <Spinner></Spinner>
          )}
        </div>
        <StartButton
          onClick={handleStartClick}
          enabled={enabled}
          disabled={!selected}
        ></StartButton>
        <p>
          lofi beats added daily{" "}
          <span className={commonStyles.avoidwrap}>(17:00 UTC)</span> to a
          playlist of your choosing
        </p>
        {hasErrored ? (
          <p
            className={styles.errorText}
            style={{ opacity: errorMessageOpacity }}
          >
            Something went wrong with that request, please try again
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Playlists;
