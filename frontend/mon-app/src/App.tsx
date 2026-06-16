import { useRef, useState } from "react";
import { PhaserGame } from "./PhaserGame";
import type { IRefPhaserGame } from "./PhaserGame";
import "./App.css";
import type { Game } from "./game/scenes/Game";
import type { MainMenu } from "./game/scenes/MainMenu";

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
        setIsLoggedIn(true);
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

  const [canMoveSprite, setCanMoveSprite] = useState(true);
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

  const changeScene = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as Game;
      if (scene) scene.changeScene();
    }
  };

  const moveSprite = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene as MainMenu;
      if (scene && scene.scene.key === "MainMenu") {
        scene.moveLogo(({ x, y }) => {
          setSpritePosition({ x, y });
        });
      }
    }
  };

  const addSprite = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene;
      if (scene) {
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);
        const star = scene.add.sprite(x, y, "star");

        scene.add.tween({
          targets: star,
          duration: 500 + Math.random() * 1000,
          alpha: 0,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  };

  const currentScene = (scene: Phaser.Scene) => {
    setCanMoveSprite(scene.scene.key !== "MainMenu");
  };

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
          >
          </a>
        </section>
      ) : (
        <section id="game-section">
          <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
              <div>
                <button className="button" onClick={changeScene}>
                  Change Scene
                </button>
              </div>
              <div>
                <button
                  disabled={canMoveSprite}
                  className="button"
                  onClick={moveSprite}
                >
                  Toggle Movement
                </button>
              </div>
              <div className="spritePosition">
                Sprite Position:
                <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
              </div>
              <div>
                <button className="button" onClick={addSprite}>
                  Add New Sprite
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default App;
