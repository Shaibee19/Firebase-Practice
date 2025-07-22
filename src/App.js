import React, { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase/init";
import { collection, addDoc, getDocs, getDoc, doc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
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

  async function updatePost() {
    const hardcodeID = "6XY0SqiVvMnC7mW8321o";
    const postRef = doc(db, "posts", hardcodeID);
    const post = await getPostById(hardcodeID);
    console.log(post)
    const newPost = {
      ...post, // if you just want to target one element and just change the description, for example
      description: "Complete FES",
      // uid: user.id,
    };
    console.log(newPost);
    updateDoc(postRef, newPost);
  }

  function deletePost() {
    const hardcodeID = "6XY0SqiVvMnC7mW8321o";
    const postRef = doc(db, "posts", hardcodeID);
    deleteDoc(postRef);
  }

  function createPost() {
    const post = {
      title: "Do Firebase Section",
      description: "Finish FESimplified",
      uid: user.uid,
    };
    addDoc(collection(db, "posts"), post)
  }

  async function getAllPosts() {
    const { docs } = await getDocs(collection(db, "posts"));
    const posts = docs.map(elem => ({ ...elem.data(), id: elem.id }));
    console.log(posts)
  }

  async function getPostById(ID) {
    const postRef = doc(db, "posts", ID);
    const postSnap = await getDoc(postRef);
    // if (postSnap.exists()) {
      return postSnap.data();
    // }
  }

  async function getPostByUid() {
    const postCollectionRef = await query(
      collection(db, "posts"),
      where("uid", "==", user.uid)
    );
    const { docs } = await getDocs(postCollectionRef);
    console.log(docs.map(doc => doc.data));
  }

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
                <button className="header__btn post" onClick={createPost}>Create Post</button>
                <button className="header__btn post" onClick={getAllPosts}>Get All Posts</button>
                <button className="header__btn post" onClick={getPostById}>Get Post By ID</button>
                <button className="header__btn post" onClick={getPostByUid}>Get Post By UID</button>
                <button className="header__btn post" onClick={updatePost}>Update Post</button>
                <button className="header__btn post" onClick={deletePost}>Delete Post</button>
              </ul>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
