import { Avatar } from "@material-ui/core";
import React from "react";
import "./mess.css";

function Mess({ username, avaImg, timestamp }) {
  return (
    <div className="mess">
      <div className="mess_ava">
        <Avatar
          className="mess_avatar"
          alt={username}
          src={avaImg || "avaImg"}
        ></Avatar>
        <h3>{username}</h3>
      </div>

      <div>
        <p className="times">{timestamp}</p>
      </div>
    </div>
  );
}

export default Mess;
