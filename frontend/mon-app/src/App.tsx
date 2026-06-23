import { useRef, useState } from "react";
import { PhaserGame } from "./PhaserGame";
import type { IRefPhaserGame } from "./PhaserGame";
import "./App.css";
import animationGame from "./assets/animation_game.mp4";
import { TeamPanel } from "./components/TeamPanel";

interface FormProps {
  isLoginMode: boolean;
  setIsLoginMode: (mode: boolean) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

function Form({ isLoginMode, setIsLoginMode, setIsLoggedIn }: FormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoginMode) {
      login();
    } else {
      register();
    }
  };

  async function login() {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const video = document.createElement("video");

        video.src = animationGame;
        video.autoplay = true;
        video.muted = true;
        video.style.position = "fixed";
        video.style.top = "0";
        video.style.left = "0";
        video.style.width = "100vw";
        video.style.height = "100vh";
        video.style.objectFit = "cover";
        video.style.zIndex = "9999";

        document.body.appendChild(video);

        video.onerror = () => {
          console.log("Erreur vidéo");
          console.log("video.error =", video.error);

          if (video.error) {
            console.log("code =", video.error.code);
            console.log("message =", video.error.message);
          }

          console.log("src =", video.currentSrc);
        };

        video.onended = () => {
          document.body.removeChild(video);

          // Continuer après l'animation
          setIsLoggedIn(true);
        };
      } else {
        alert(response.statusText);
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function register() {
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 201) {
        setIsLoginMode(true);
      } else {
        alert(response.statusText);
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    // <form onSubmit={handleSubmit}>
    //   <h2>{isLoginMode ? "Connexion" : "Inscription"}</h2>
    //   <input
    //     onChange={(e) => setUsername(e.target.value)}
    //     type="text"
    //     name="username"
    //     placeholder="Username"
    //     value={username}
    //     required
    //   />
    //   <input
    //     type="password"
    //     name="password"
    //     onChange={(e) => setPassword(e.target.value)}
    //     placeholder="Password"
    //     value={password}
    //     required
    //   />
    //   <button type="submit">Valider</button>
    // </form>

    <div className="retro-container">
      <form onSubmit={handleSubmit} className="retro-form-box">
        <h2 className="retro-heading">
          {isLoginMode ? "CONNEXION" : "INSCRIPTION"}
        </h2>

        <div className="retro-input-container">
          <label className="retro-label">Pseudo :</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="username"
            placeholder="Costa123"
            value={username}
            required
            className="retro-input"
          />
        </div>

        <div className="retro-input-container">
          <label className="retro-label">Mot de passe :</label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            value={password}
            required
            className="retro-input"
          />
        </div>

        <div className="retro-button-container">
          <button type="submit" className="retro-submit-btn">
            VALIDER <span className="retro-arrow">▶</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="retro-switch-btn"
          >
            {isLoginMode ? "Créer un compte" : "Déjà inscrit ?"}
          </button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return (
    <>
      {!isLoggedIn ? (
        <section id="login-section">
          <Form
            isLoginMode={isLoginMode}
            setIsLoginMode={setIsLoginMode}
            setIsLoggedIn={setIsLoggedIn}
          />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsLoginMode(!isLoginMode);
            }}
          ></a>
        </section>
          ) : (
            <div id="app" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh", backgroundColor: "#000" }}>
              <PhaserGame ref={phaserRef} currentActiveScene={() => {}} />
            </div>
          )}
    </>
  );
}

export default App;
