import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import "./chat.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import { Avatar, IconButton } from "@material-ui/core";
import Mess from "./Mess";
import FaceIcon from "@material-ui/icons/Face";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import CropOriginalIcon from "@material-ui/icons/CropOriginal";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message";
import firebase from "firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

function Chat_right() {
  const { roomId } = useParams();
  const [{ user }, dispatch] = useStateValue();
  const [userMessage, setUserMessage] = useState("");
  const [username, setUsername] = useState(null);
  const [avaImg, setAvaImg] = useState("");
  const [messages, setMessages] = useState([]);
  const [uavaImg, setUavaImg] = useState("");

  useEffect(() => {
    db.collection("ChatingRooms")
      .doc(roomId)
      .collection("Messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((s) => {
        setMessages(
          s.docs.map((it) => {
            return {
              message: it.data().message,
              username: it.data().username,
              avaImg: it.data().avaImg,
            };
          })
        );
      });
  }, [roomId]);

  useEffect(() => {
    db.collection("users")
      .doc(user.displayName)
      .collection("userMessges")
      .doc(roomId)
      .onSnapshot((s) => {
        setUsername(s.data().username);
      });
    db.collection("users")
      .doc(user.displayName)
      .collection("userAvatar")
      .onSnapshot((s) => {
        setAvaImg(
          s.docs.map((it) => {
            return it.data().imgURl;
          })
        );
      });
    db.collection("users")
      .doc(user.displayName)
      .collection("userMessges")
      .doc(roomId)
      .onSnapshot((s) => {
        setUavaImg(s.data().avaImg);
      });
  }, [roomId]);

  const send = (e) => {
    e.preventDefault();
    if (userMessage != "")
      db.collection("ChatingRooms")
        .doc(roomId)
        .collection("Messages")
        .add({
          message: userMessage,
          username: user.displayName,
          avaImg: user.photoURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          var list = document.getElementById("scrolling-div");
          list.scrollTop = list.scrollHeight;
        });

    setUserMessage("");
  };
  useEffect(() => {
    var list = document.getElementById("scrolling-div");
    list.scrollTop = list.scrollHeight;
  }, [messages]);

  return (
    <div className="chat_right1">
      <div className="chat_rHead">
        <div className="chat_rHead2">
          <Link to={`/messges/${user.displayName}`}>
            <IconButton>
              <KeyboardBackspaceIcon className="chat_headIcon"></KeyboardBackspaceIcon>
            </IconButton>
          </Link>

          <Avatar alt={username} src={uavaImg || "uavaImg"}></Avatar>
          <h4>{username}</h4>
        </div>

        <div>
          <HelpOutlineIcon fontSize="large"></HelpOutlineIcon>
        </div>
      </div>

      <div id="scrolling-div" className="chat_messages">
        {messages.map((it) => {
          return (
            <Message
              username={it.username}
              avaImg={it.avaImg}
              message={it.message}
            ></Message>
          );
        })}
      </div>

      <form className="chat_input">
        <IconButton>
          <InsertEmoticonIcon></InsertEmoticonIcon>
        </IconButton>

        <input
          placeholder="Message..."
          value={userMessage}
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
        ></input>
        <IconButton type="submit" onClick={send}>
          <SendIcon className="input_icon"></SendIcon>
        </IconButton>
      </form>
    </div>
  );
}

export default Chat_right;
