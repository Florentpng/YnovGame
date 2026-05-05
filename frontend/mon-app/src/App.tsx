import { useState } from 'react'
import './App.css'

function Form({ title, isLoginMode }: { title: string; isLoginMode: boolean }) {
  return <form onSubmit={isLoginMode ? login : register}>
    <h2>{title}</h2>
    <input type="text" name="username" placeholder="Username" required />
    <input type="password" name="password" placeholder="Password" required />
    <button type="submit">Valider</button>
  </form>
}

function login() {
  
}

function register() {

}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <>
      {!isLoggedIn ?
        <section id="login-section" >
          {isLoginMode ? <Form title="Login" isLoginMode={true} /> : <Form title="Register" isLoginMode={false} />}
        </section> : 
        <section id="game-section">
          
        </section>}
    </>
  )
}

export default App
