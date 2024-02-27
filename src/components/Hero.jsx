import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  const [joiningCode, setJoiningCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const JOINING_CODE_LENGTH = 5;

  // generate random characters code of 5 length for room creation
  const generateJoiningCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let createdCode = "";

    for (let i = 0; i < JOINING_CODE_LENGTH; i++) {
      createdCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setJoiningCode("");
    navigate(`/${createdCode}`);
  };

  const updateJoiningCode = (value) => {
    setJoiningCode(value);
  };

  // validate the user's joining code
  const validateJoiningCode = () => {
    const codeLength = joiningCode.length;
    const regExp = /^[a-zA-Z0-9]+$/;
    const validCode =
      codeLength === JOINING_CODE_LENGTH && regExp.test(joiningCode);

    if (validCode) {
      setCodeError(false);
      navigate(`/${joiningCode}`);
    } else {
      setCodeError(true);
    }
  };

  return (
    <div className="body-container">
      <img src="./assets/clipboard.webp" alt="Clipboard Logo" className="img" />

      <h1 className="app-name">Realtime Clipboard</h1>
      <h2 className="tag-line">
        Join with unique key and share text with your friends!
      </h2>

      <div className="room-joining-container">
        <div
          className="create-room-container"
          role="group"
          aria-label="Create Clipboard"
        >
          <label htmlFor="createRoom" id="lbl-1">
            Create a new Clipboard...
          </label>
          <button
            className="btn-1"
            id="createRoom"
            type="button"
            onClick={generateJoiningCode}
          >
            Create Clipboard
          </button>
        </div>

        <div
          className={`join-room-container ${codeError ? "active" : ""}`}
          role="group"
          aria-label="Join Clipboard"
        >
          <label htmlFor="joinRoom" id="lbl-2">
            {codeError
              ? "Invalid ID, please check again."
              : "Or join an existing one..."}
          </label>
          <input
            type="text"
            className="input-box"
            placeholder="Enter the ID"
            name="Room Code"
            id="joinRoom"
            minLength="5"
            maxLength="5"
            value={joiningCode}
            onChange={(e) => updateJoiningCode(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && validateJoiningCode();
            }}
          />
          <button type="button" className="btn-2" onClick={validateJoiningCode}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
