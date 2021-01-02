import { Avatar } from "@material-ui/core";
import React from "react";
import "./message.css";
import { useStateValue } from "../../StateProvider";
function Message({ username, avaImg, message }) {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="message">
      {user.displayName === username ? (
        <p className="message_p1">{message}</p>
      ) : (
        <div className="message1">
          <Avatar
            className="message_avatar"
            alt={username}
            src={avaImg || "avaImg"}
          ></Avatar>

          <p className="message_p">{message}</p>
        </div>
      )}
    </div>
  );
}

export default Message;
