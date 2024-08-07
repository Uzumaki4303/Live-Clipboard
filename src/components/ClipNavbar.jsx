import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, onDisconnect, onValue } from "firebase/database";
import { clickLogging } from "../scripts/analyticsLogging";

function ClipNavbar({ internetStatus }) {
  const navigate = useNavigate();
  const { code } = useParams();
  const [isDark, setIsDark] = useState(true);
  const [status, setStatus] = useState("Connecting...");
  const database = appDatabase;
  const roomRef = ref(database, `/${code}`); // Reference to the database

  // change the app's theme
  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const newIsDark = !prevIsDark;
      localStorage.setItem("isDark", newIsDark ? "1" : "0");
      document.body.className = newIsDark ? "" : "light-theme";
      return newIsDark;
    });
  };

  // copy the room's URL into user's clipboard
  const handleCopyCode = () => {
    clickLogging("Room URL Copied: " + code);
    navigator.clipboard.writeText(`https://live-clipboard.netlify.app/${code}`);
  };

  // validate users joining code and set preferred theme
  useEffect(() => {
    const validateJoiningCode = (joiningCode) => {
      const codeLength = joiningCode.length;
      const regExp = /^[a-zA-Z0-9]+$/;
      const validCode = codeLength === 5 && regExp.test(joiningCode);

      if (!validCode) {
        navigate("/");
      }
    };

    validateJoiningCode(code);

    // check users theme preference
    const storedTheme = localStorage.getItem("isDark") || "1";
    document.body.className = storedTheme === "1" ? "" : "light-theme";
    setIsDark(storedTheme === "1");
  }, [code, navigate]);

  // check database connection status
  useEffect(() => {
    // Set up onDisconnect listener
    onDisconnect(roomRef);

    // Set up onValue listener for connection status
    const connectionStatusRef = ref(database, ".info/connected");
    const onValueCallback = (snapshot) => {
      const isConnected = snapshot.val();

      if (isConnected) {
        setStatus("Connected");
      } else {
        setStatus("Connecting...");
      }
    };

    onValue(connectionStatusRef, onValueCallback);
  }, [code, database, roomRef]);

  return (
    <div className="status">
      <div className="nav-title">
        <Link to="/" title="Clipboard">
          <img src="./assets/clipboard-logo.webp" alt="Clipboard Logo" />
          <span>Clipboard</span>
        </Link>

        <span
          id="clip-status"
          style={{
            backgroundColor: !internetStatus
              ? "red"
              : status === "Connected"
              ? "#affc41"
              : "",
            color: !internetStatus ? "#ffffff" : "#000000",
          }}
        >
          {!internetStatus ? "Offline" : status}
        </span>
      </div>

      <div className="nav-content">
        <div className="cp-code">
          <img
            className="theme"
            src={isDark ? "assets/moon.webp" : "assets/sun.webp"}
            alt={isDark ? "Dark Theme" : "Light Theme"}
            onClick={() => {
              if (!document.startViewTransition) toggleTheme();
              document.startViewTransition(toggleTheme);
            }}
          />

          <span
            title="Click to copy the link to share with your friends"
            id="clip-code"
            onClick={handleCopyCode}
          >
            {code} <img src="assets/network.webp" alt="Copy Icon" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default ClipNavbar;
