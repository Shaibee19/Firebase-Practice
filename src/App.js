import React from "react";
import "./App.css";
import { auth } from "./firebase/init";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoading(false);
      // console.log(user.email[0].toUpperCase());
      if (user) {
        setUser(user);
      }
    });
  }, []);

  function register() {
    console.log("register");
    createUserWithEmailAndPassword(auth, "email@gmail.com", "test123")
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function login() {
    signInWithEmailAndPassword(auth, "email@gmail.com", "test123")
      .then(({ user }) => {
        console.log(user);
        setUser(user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  function logout() {
    signOut(auth);
    setUser({});
  }

  function profileLoaded() {
    console.log('profileLoaded')
  }

  return (
    <div className="App">
      <header className="header">
        <div className="header__container">
          <ul className="header__btns">
            <li className="header__btn--list">
              <button className="btn__menu">
                <FontAwesomeIcon icon="bars" />
              </button>
            </li>
            <li className="header__btn--list">
              <button className="header__btn" onClick={register} onLoad={profileLoaded}>Register</button>
            </li>
            <li className="header__btn--list">
              <button className="header__btn" onClick={login}>Login</button>
            </li>
            <li className="header__btn--list">
              <button className="header__btn" onClick={logout}>Logout</button>
            </li>
            <li className="header__btn--icon">
              {/* <button className="header__btn" onClick={logout}>{user.email[0].toUpperCase()}</button> */}
            </li>
            {loading ? "loading..." : user.email}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
