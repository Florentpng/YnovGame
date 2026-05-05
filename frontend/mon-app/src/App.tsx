import { useState } from 'react'
import './App.css'

function Form({ title }: { title: string }) {
  return <form>
    <h2>{title}</h2>
    <input type="text" name="username" placeholder="Username" required />
    <input type="password" name="password" placeholder="Password" required />
    <button type="submit">Valider</button>
  </form>
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

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
