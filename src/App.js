import React, { useEffect, useState } from "react";
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
  const [user, setUser] = React.useState(null); // Initialize with null
  const [img, setImg] = useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { // Renamed user to currentUser to avoid conflict
      setLoading(false);
      if (currentUser) {
        setUser(currentUser);
        // It's safe to log here because currentUser is not null
        console.log(currentUser.email[0].toUpperCase());
      } else {
        setUser(null); // Ensure user is null when no one is logged in
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setTimeout(() => {
        setImg(image);
      }, 300);
    };
  }, []); // Add empty dependency array to run once

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
    setUser(null); // Set user to null on logout
  }

  return (
    <div className="App">
      <header className="header">
        {loading ? (
          <>
            <div className="header__loading--skeleton">
              <div className="header__btn--skeleton"></div>
              <div className="header__btn--skeleton"></div>
              <div className="header__btn--skeleton"></div>
              <div className="header__btn--skeleton"></div>
            </div>
          </>
        ) : (
          <>
            <div className="header__container">
              <ul className="header__btns">
                <li className="header__btn--list">
                  <button className="btn__menu">
                    <FontAwesomeIcon icon="bars" />
                  </button>
                </li>
                <li className="header__btn--list">
                  <button className="header__btn" onClick={register}>
                    Register
                  </button>
                </li>
                <li className="header__btn--list">
                  <button className="header__btn" onClick={login}>
                    Login
                  </button>
                </li>
                <li className="header__btn--list">
                  <button className="header__btn" onClick={logout}>
                    Logout
                  </button>
                </li>
                <li className="header__btn--list">
                  {user && user.email ? ( // Conditional rendering for user email initial
                    <button className="header__btn--icon" onClick={logout}>
                      {user.email[0].toUpperCase()}
                    </button>
                  ) : (
                    <button className="header__btn--icon">
                       ? {/* Or some default icon/text when no user */}
                    </button>
                  )}
                </li>
                {loading ? "loading..." : (user ? user.email : "Not logged in")} {/* Conditional rendering for user.email */}
              </ul>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
