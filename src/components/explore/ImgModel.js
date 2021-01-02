import React, { useEffect, useState } from "react";
import "./imgmodle.css";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { Avatar, Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { useStateValue } from "../../StateProvider";
import FavoriteIcon from "@material-ui/icons/Favorite";
import TurnedInNotIcon from "@material-ui/icons/TurnedInNot";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import TelegramIcon from "@material-ui/icons/Telegram";

function ImgModel() {
  const [{ user }, dispatch] = useStateValue();
  const { imgId } = useParams();
  const [img, setImg] = useState({});
  const [comments, setComments] = useState([]);
  const [com, setCom] = useState("");
  const [following, setFollowing] = useState([]);

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
  useEffect(() => {
    db.collection("users")
      .doc(user.displayName)
      .collection("userFollowing")
      .onSnapshot((s) => {
        setFollowing(
          s.docs.map((it) => {
            return it.data().username;
          })
        );
      });
  }, []);
  useEffect(() => {
    db.collection("posts")
      .doc(imgId)
      .onSnapshot((s) => {
        setImg(s.data());
      });
  }, []);

  useEffect(() => {
    db.collection("posts")
      .doc(imgId)
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
  const follow = () => {
    db.collection("users")
      .doc(user.displayName)
      .collection("userFollowing")
      .doc(img.username)
      .set({ username: img.username });

    db.collection("users")
      .doc(img.username)
      .collection("userFollowers")
      .doc(user.displayName)
      .set({
        username: user.displayName,
      });
  };

  const sendCom = (e) => {
    e.preventDefault();
    if (com != "") {
      db.collection("posts").doc(imgId).collection("comments").add({
        username: user.displayName,
        text: com,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setCom("");
  };

  const messanging = () => {
    let a = filterd.indexOf(img.username);
    console.log(`a===${a}`);
    if (a >= 0) {
      console.log("filterd Filed");
    } else {
      db.collection("users")
        .doc(user.displayName)
        .collection("userMessges")
        .doc(imgId)
        .set({
          username: img.username,
          avaImg: img.avatarImg,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      db.collection("users")
        .doc(img.username)
        .collection("userMessges")
        .doc(imgId)
        .set({
          username: user.displayName,
          avaImg: myUserAvtar[0].avatarImg,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }
  };
  useEffect(() => {
    db.collection("posts")
      .doc(imgId)
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
      .doc(imgId)
      .collection("Likes")
      .doc(user.displayName)
      .set({ username: user.displayName });
  };

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

  return (
    <div className="imgM">
      <Link to="/explore">
        <CloseIcon className="imgM_icon"></CloseIcon>
      </Link>

      <div className="imgM1">
        <div>
          <img className="imgM_img" src={img.imgURl} alt={img.username}></img>
        </div>
        <div className="imgM_post">
          <div className="imgM_header">
            <Link to={`/${img.username}`}>
              <Avatar
                src={img.avatarImg || "img.avatarImg"}
                alt={img.username}
              ></Avatar>
            </Link>
            <Link to={`/${img.username}`}>
              <h3 className="imgM_username"> {img.username} </h3>
            </Link>

            <h2 className="bb">.</h2>
            {user.displayName === img.username ? (
              <button onClick={follow} className="imgM_button1">
                Follow
              </button>
            ) : following.indexOf(img.username) === -1 ? (
              <button onClick={follow} className="imgM_button">
                Follow
              </button>
            ) : (
              <button onClick={follow} className="imgM_button bunF">
                UnFollow
              </button>
            )}

            <h2 className="b">...</h2>
          </div>
          <div>
            <img
              className="imgM_img2"
              src={img.imgURl}
              alt={img.username}
            ></img>
          </div>
          <div className="imgM_caption">
            <h2>{img.caption}</h2>
          </div>
          <div className="imgM_comment">
            {comments.map((it) => {
              return (
                <h4 className="post_text">
                  <strong>{it.username}</strong> {it.comment}
                </h4>
              );
            })}
          </div>

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

          <form className="imgM_comC">
            <input
              className="imgM_com"
              placeholder="Add a comment..."
              value={com}
              onChange={(e) => {
                setCom(e.target.value);
              }}
            ></input>
            <Button className="imgM_cop" type="submit" onClick={sendCom}>
              post
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImgModel;
