import { useRef, useState } from 'react'
import { PhaserGame } from './PhaserGame';
import type { IRefPhaserGame } from './PhaserGame';
import './App.css'
import type { Game } from './game/scenes/Game';
import type { MainMenu } from './game/scenes/MainMenu';

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isLoginMode, setIsLoginMode] = useState(true);

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

function Form({ title }: { title: string }) {
  return <form>
    <h2 onSubmit={login}>{title}</h2>
    <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" placeholder="Username" required />
    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Password" required />
    <button type="submit">Valider</button>
  </form>
}

async function login() {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (response.status === 200) {
    setIsLoggedIn(true);

  } else {
    alert('Mauvais identifiant ou mot de passe.');
  }
}

function App() {
  // The sprite can only be moved in the MainMenu Scene
  const [canMoveSprite, setCanMoveSprite] = useState(true);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

  const changeScene = () => {

    if (phaserRef.current) {
      const scene = phaserRef.current.scene as Game;

      if (scene) {
        scene.changeScene();
      }
    }
  }

  const moveSprite = () => {

    if (phaserRef.current) {

      const scene = phaserRef.current.scene as MainMenu;

      if (scene && scene.scene.key === 'MainMenu') {
        // Get the update logo position
        scene.moveLogo(({ x, y }) => {

          setSpritePosition({ x, y });

        });
      }
    }

  }

  const addSprite = () => {

    if (phaserRef.current) {
      const scene = phaserRef.current.scene;

      if (scene) {
        // Add more stars
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);

        //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
        const star = scene.add.sprite(x, y, 'star');

        //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
        //  You could, of course, do this from within the Phaser Scene code, but this is just an example
        //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
        scene.add.tween({
          targets: star,
          duration: 500 + Math.random() * 1000,
          alpha: 0,
          yoyo: true,
          repeat: -1
        });
      }
    }
  }

  // Event emitted from the PhaserGame component
  const currentScene = (scene: Phaser.Scene) => {

    setCanMoveSprite(scene.scene.key !== 'MainMenu');

  }

  return (
    <>
      {!isLoggedIn ?
        <section id="login-section" >
          {isLoginMode ? <Form title="Login" /> : <Form title="Register" />}
        </section> :
        <section id="game-section">
          <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
              <div>
                <button className="button" onClick={changeScene}>Change Scene</button>
              </div>
              <div>
                <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
              </div>
              <div className="spritePosition">Sprite Position:
                <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
              </div>
              <div>
                <button className="button" onClick={addSprite}>Add New Sprite</button>
              </div>
            </div>
          </div>
        </section>}
    </>
  )
}

export default App
