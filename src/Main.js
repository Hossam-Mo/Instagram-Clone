import React, { useEffect, useState } from "react";
import "./main.css";
import Nav from "./components/Nav/Nav";
import Post from "./components/Posts/Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import "./components/Nav/Nav.css";
import Login from "./components/login/Login";
import InstagramEmbed from "react-instagram-embed";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { actionTypes } from "./reducer";
import { useStateValue } from "./StateProvider";
import Profile from "./components/profile/Profile";
import firebase from "firebase";

function Main() {
  const [{ user }, dispatch] = useStateValue();
  const [posts, setPosts] = useState([]);
  let [userFollowing, setUserFollowing] = useState([]);
  /*
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((s) => {
        setPosts(
          s.docs.map((it) => {
            return {
              id: it.id,
              avatarImg: it.data().avatarImg,
              caption: it.data().caption,
              username: it.data().username,
              imgUrl: it.data().imgURl,
            };
          })
        );
      });
  }, []);*/
  useEffect(() => {
    if (user.displayName !== null)
      db.collection("users")
        .doc(user.displayName)
        .collection("userFollowingPosts")
        .orderBy("timestamp", "desc")
        .onSnapshot((s) => {
          setPosts(
            s.docs.map((it) => {
              return {
                id: it.id,
                avatarImg: it.data().avatarImg,
                caption: it.data().caption,
                username: it.data().username,
                imgUrl: it.data().imgURl,
              };
            })
          );
        });
  }, []);

  useEffect(() => {
    if (user.displayName !== null)
      db.collection("users")
        .doc(user.displayName)
        .collection("userFollowing")
        .onSnapshot((s) => {
          setUserFollowing(
            s.docs.map((it) => {
              return it.data().username;
            })
          );
        });
  }, []);

  useEffect(() => {
    if (user.displayName !== null) {
      if (userFollowing.indexOf(user.displayName) < 0) {
        userFollowing.push(user.displayName);
      }
      userFollowing.map((it) => {
        db.collection("users")
          .doc(it)
          .collection("userPosts")
          .onSnapshot((s) => {
            s.docs.map((it) => {
              db.collection("users")
                .doc(user.displayName)
                .collection("userFollowingPosts")
                .doc(it.id)
                .set({
                  caption: it.data().caption,
                  imgURl: it.data().imgURl,
                  timestamp: it.data().timestamp,
                  username: it.data().username,
                  avatarImg: it.data().avatarImg,
                });
            });
          });
      });
    }
  }, [userFollowing]);
  return (
    <div className="app_main">
      <div className="main_left">
        {posts.map((it) => {
          return (
            <Post
              key={it.id}
              id={it.id}
              avatarImg={it.avatarImg}
              caption={it.caption}
              username={it.username}
              imgURl={it.imgUrl}
            ></Post>
          );
        })}
      </div>
      <div className="main_right">
        <InstagramEmbed
          url="https://www.instagram.com/p/CEn6yklKHW0/"
          maxWidth={320}
          hideCaption={false}
          containerTagName="div"
          protocol=""
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      </div>
    </div>
  );
}

export default Main;
