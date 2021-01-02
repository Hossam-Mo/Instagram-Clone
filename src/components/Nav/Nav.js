import React, { useEffect, useState } from "react";
import "./Nav.css";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import HomeIcon from "@material-ui/icons/Home";
import TelegramIcon from "@material-ui/icons/Telegram";
import InstagramIcon from "@material-ui/icons/Instagram";
import SearchIcon from "@material-ui/icons/Search";
import {
  Avatar,
  IconButton,
  Input,
  Modal,
  useScrollTrigger,
} from "@material-ui/core";
import { useStateValue } from "../../StateProvider";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";
import ExploreIcon from "@material-ui/icons/Explore";

function Nav() {
  const [{ user }, dispatch] = useStateValue();
  const [avtarImg, setAvatarImg] = useState([]);

  /* useEffect(() => {
    db.collection("users")
      .doc(user.displayName)
      .set({ name: user.displayName });
  }, []);                                        for the user      */

  useEffect(() => {
    if (user.displayName !== null) {
      db.collection("users")
        .doc(user.displayName)
        .collection("userAvatar")
        .onSnapshot((s) => {
          setAvatarImg(
            s.docs.map((it) => {
              return { avaImg: it.data().imgURl };
            })
          );
        });
    }
  }, []);
  let avaImg1;
  if (avtarImg.length > 0) {
    avaImg1 = avtarImg[0].avaImg;
  }

  return (
    <div className="app_header">
      <div>
        <Link to="/">
          <img
            className="logo"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Logo"
          ></img>
        </Link>
      </div>
      <div className="header_mid">
        <SearchIcon fontSize="small" className="mid_icon"></SearchIcon>
        <input className="mid_input" placeholder="Search"></input>
      </div>
      <div className="header_icons">
        <Link to="/">
          <IconButton>
            <HomeIcon className="icons"></HomeIcon>
          </IconButton>
        </Link>
        <Link to={`/messges/${user.displayName}`}>
          <IconButton>
            <TelegramIcon className="icons"></TelegramIcon>
          </IconButton>
        </Link>

        <Link to="/explore">
          <IconButton>
            <ExploreIcon className="icons"></ExploreIcon>
          </IconButton>
        </Link>

        <IconButton>
          <FavoriteBorderIcon className="icons"></FavoriteBorderIcon>
        </IconButton>
        {user.photoURL ? (
          <Link to={`/${user.displayName}`}>
            <Avatar
              alt={user.displayName}
              src={user.photoURL}
              className="icons"
            ></Avatar>
          </Link>
        ) : (
          <Link to={`/${user.displayName}`}>
            <Avatar
              alt={user.displayName}
              src={"user.photoURL"}
              className="icons"
            ></Avatar>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Nav;
