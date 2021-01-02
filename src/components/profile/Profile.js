import React, { useEffect, useState } from "react";
import "./profile.css";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import { Avatar, IconButton } from "@material-ui/core";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import { auth, db } from "../../firebase";
import { useParams } from "react-router-dom";
import AvatarUpload from "./AvatarUpload";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import AddIcon from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import firebase from "firebase";
import { Link } from "react-router-dom";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Profile() {
  const { profile } = useParams();
  const [{ user }, dispatch] = useStateValue();
  const [userPosts, setUserPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [avtarImg, setAvatarImg] = useState([]);
  const [filterd, setFilterd] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);

  useEffect(() => {
    db.collection("users")
      .doc(profile)
      .collection("userFollowing")
      .onSnapshot((s) => {
        setFollowing(
          s.docs.map((it) => {
            return { username: it.data().username };
          })
        );
      });
    db.collection("users")
      .doc(profile)
      .collection("userFollowers")
      .onSnapshot((s) => {
        setFollowers(
          s.docs.map((it) => {
            return { username: it.data().username };
          })
        );
      });
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
  }, [profile]);

  useEffect(() => {
    db.collection("users")
      .doc(profile)
      .collection("userAvatar")
      .onSnapshot((s) => {
        setAvatarImg(
          s.docs.map((it) => {
            return { avaImg: it.data().imgURl };
          })
        );
      });
  }, [profile]);
  let avaImg1;
  if (avtarImg.length > 0) {
    avaImg1 = avtarImg[0].avaImg;
  }

  useEffect(() => {
    db.collection("users")
      .doc(profile)
      .collection("userPosts")
      .orderBy("timestamp", "desc")
      .onSnapshot((s) => {
        setUserPosts(
          s.docs.map((it) => {
            return {
              img: it.data().imgURl,
            };
          })
        );
      });
  }, [profile]);

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
    let a = filterd.indexOf(profile);
    console.log(`a===${a}`);
    if (a >= 0) {
      console.log("filterd Filed");
    } else {
      db.collection("users")
        .doc(user.displayName)
        .collection("userMessges")
        .doc(user.displayName + profile)
        .set({
          username: profile,
          avaImg: avaImg1,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      db.collection("users")
        .doc(profile)
        .collection("userMessges")
        .doc(user.displayName + profile)
        .set({
          username: user.displayName,
          avaImg: user.photoURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }
  };

  const follow = () => {
    db.collection("users")
      .doc(user.displayName)
      .collection("userFollowing")
      .doc(profile)
      .set({
        username: profile,
      });
    db.collection("users")
      .doc(profile)
      .collection("userFollowers")
      .doc(user.displayName)
      .set({
        username: user.displayName,
      });
  };

  return (
    <div className="profile">
      <div className="profile_header">
        <Avatar
          onClick={() => {
            setOpen(true);
          }}
          className="profile_avatar"
          alt={profile}
          src={avaImg1 || "avaImg1"}
        ></Avatar>

        <div className="profile_just">
          {profile === user.displayName ? (
            <div className="profile_name">
              <p className="profile_username">{profile}</p>
              <button className="profile_button">Edit Profile</button>
              <Link to="/">
                <IconButton
                  onClick={() => {
                    return auth.signOut();
                  }}
                >
                  <Brightness5Icon></Brightness5Icon>
                </IconButton>
              </Link>
            </div>
          ) : userFollowing.indexOf(profile) < 0 ? (
            <div className="profile_name">
              <p className="profile_username">{profile}</p>
              <button onClick={follow} className="profile_button ff">
                Follow
              </button>
              <Link to={`/messges/${user.displayName}`}>
                <IconButton onClick={messanging}>
                  <SendIcon className="cc"></SendIcon>
                </IconButton>
              </Link>
            </div>
          ) : (
            <div className="profile_name">
              <p className="profile_username">{profile}</p>
              <button onClick={follow} className="profile_button ff1 ">
                Unfollow
              </button>
              <Link to={`/messges/${user.displayName}`}>
                <IconButton onClick={messanging}>
                  <SendIcon className="cc"></SendIcon>
                </IconButton>
              </Link>
            </div>
          )}

          <div className="profile_folow">
            <p className="profile_following">{userPosts.length} post</p>
            <p className="profile_following"> {followers.length} followers</p>
            <p className="profile_following"> {following.length} following</p>
          </div>
          <div className="profile_caption">
            <p>I am trying to pick my self peace by peace</p>
          </div>
        </div>
      </div>

      <div className="profile_posts">
        <div className="profile_postICon">
          <PhotoLibraryIcon></PhotoLibraryIcon>
          <p>Posts</p>
        </div>
        <div className="profile_photos">
          {userPosts.map((it) => {
            return <img className="profile_imgs" src={it.img}></img>;
          })}
        </div>
      </div>
      <div className="profile_footer">
        <p>© 2020 INSTAGRAM FROM FACEBOOK</p>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <AvatarUpload></AvatarUpload>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
