import React, { useEffect, useState } from "react";
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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
function Chat() {
  const [chatrow, setChatrow] = useState([]);
  const { userChat } = useParams();
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    db.collection("users")
      .doc(userChat)
      .collection("userMessges")
      .orderBy("timestamp", "desc")
      .onSnapshot((s) => {
        setChatrow(
          s.docs.map((it) => {
            return {
              username: it.data().username,
              avaImg: it.data().avaImg,
              id: it.id,
            };
          })
        );
      });
  }, []);

  return (
    <div className="chat">
      <div className="chat_left">
        <div className="chat_D">
          <h4 className="chat_h4">Direct</h4>
          <MailOutlineIcon className="dir1"></MailOutlineIcon>
        </div>
        <div className="chat_rows">
          {chatrow.map((it) => {
            return (
              <Link to={`/messges/${user.displayName}/${it.id}`}>
                <Mess username={it.username} avaImg={it.avaImg}></Mess>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Chat;
