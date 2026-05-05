import { useState } from 'react'
import './App.css'

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
  return (
    <>
      {!isLoggedIn ?
        <section id="login-section" >
          {isLoginMode ? <Form title="Login" /> : <Form title="Register" />}
        </section> :
        <section id="game-section">

        </section>}
    </>
  )
}

export default App
