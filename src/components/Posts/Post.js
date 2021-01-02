import React, { useEffect, useState } from "react";
import "./post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../../firebase";
import { Button, IconButton } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import TelegramIcon from "@material-ui/icons/Telegram";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";
import { Link } from "react-router-dom";
import FavoriteIcon from "@material-ui/icons/Favorite";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";

function Post({ avatarImg, imgURl, username, caption, id }) {
  const [{ user }, dispatch] = useStateValue();
  const [comments, setComments] = useState([]);
  const [com, setCom] = useState("");
  const [filterd, setFilterd] = useState([]);
  const [myUserAvtar, setMyUserAvtar] = useState("");
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    db.collection("users")
      .doc(user.displayName)
      .collection("userAvatar")
      .onSnapshot((s) => {
        setMyUserAvtar(
          s.docs.map((it) => {
            return { avatarImg: it.data().imgURl };
          })
        );
      });
  }, []);

  const sendCom = (e) => {
    e.preventDefault();
    if (com != "") {
      db.collection("posts").doc(id).collection("comments").add({
        username: user.displayName,
        text: com,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setCom("");
  };

  useEffect(() => {
    db.collection("posts")
      .doc(id)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .onSnapshot((s) => {
        setComments(
          s.docs.map((it) => {
            return { username: it.data().username, comment: it.data().text };
          })
        );
      });
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(user.displayName)
      .collection("userMessges")
      .onSnapshot((s) => {
        setFilterd(
          s.docs.map((it) => {
            return it.data().username;
          })
        );
      });
  }, []);

  const messanging = () => {
    let a = filterd.indexOf(username);

    if (a >= 0) {
      console.log("filterd Filed");
    } else {
      if (user.displayName !== username) {
        db.collection("users")
          .doc(user.displayName)
          .collection("userMessges")
          .doc(id)
          .set({
            username: username,
            avaImg: avatarImg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        db.collection("users")
          .doc(username)
          .collection("userMessges")
          .doc(id)
          .set({
            username: user.displayName,
            avaImg: myUserAvtar[0].avatarImg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
      }
    }
  };
  useEffect(() => {
    db.collection("posts")
      .doc(id)
      .collection("Likes")
      .onSnapshot((s) => {
        setLikes(
          s.docs.map((it) => {
            return it.id;
          })
        );
      });
  }, []);

  const like = () => {
    db.collection("posts")
      .doc(id)
      .collection("Likes")
      .doc(user.displayName)
      .set({ username: user.displayName });
  };

  return (
    <div className="post">
      <div className="post_header">
        <Link to={`/${username}`}>
          <Avatar
            className="post_avatar"
            alt={username}
            src={avatarImg || "avatar"}
          ></Avatar>
        </Link>

        <Link to={`/${username}`}>
          <h3>{username}</h3>
        </Link>
      </div>

      <img className="post_img" src={imgURl} alt={username}></img>
      <div className="post_icons">
        <div className="icons_left">
          {likes.indexOf(user.displayName) === -1 ? (
            <IconButton onClick={like}>
              <FavoriteBorderIcon className="icons1 iconHover"></FavoriteBorderIcon>
            </IconButton>
          ) : (
            <IconButton>
              <FavoriteIcon className="icons2"></FavoriteIcon>
            </IconButton>
          )}

          <IconButton>
            <ChatBubbleOutlineIcon className="icons1"></ChatBubbleOutlineIcon>
          </IconButton>
          <Link to={`/messges/${user.displayName}`}>
            <IconButton onClick={messanging}>
              <TelegramIcon className="icons1"></TelegramIcon>
            </IconButton>
          </Link>
        </div>
        <IconButton>
          <TurnedInNotIcon
            className="icons1"
            fontSize="large"
          ></TurnedInNotIcon>
        </IconButton>
      </div>
      <p className="post_likes">Likes {likes.length}</p>
      <h4 className="post_text">
        <strong>{username} </strong>
        {caption}
      </h4>
      <div className="hr"></div>
      {comments.map((it) => {
        return (
          <h4 className="post_text">
            <strong>{it.username}</strong> {it.comment}
          </h4>
        );
      })}

      <form className="post_comC">
        <input
          className="post_com"
          placeholder="Add a comment..."
          value={com}
          onChange={(e) => {
            setCom(e.target.value);
          }}
        ></input>
        <Button className="post_cop" type="submit" onClick={sendCom}>
          post
        </Button>
      </form>
    </div>
  );
}

export default Post;
