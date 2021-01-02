import { Button, Input, Modal } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import React, { useEffect, useState } from "react";
import "./login.css";
import { makeStyles } from "@material-ui/core/styles";
import { auth, db } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";

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

function Login() {
  const [{ user }, dispatch] = useStateValue();
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [signUsername, setSignUsername] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPass, setSignPass] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(signEmail, signPass)
      .then((e) => {
        e.user.updateProfile({ displayName: signUsername });
      })
      .catch((e) => {
        alert(e.message);
      });

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((r) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: r.user,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <div className="login">
      <div className="login_main">
        <img
          className="login_logo"
          src="https://assets.website-files.com/5c75b94c8dd1ae50d3b9294b/5d48831280adb734a5db5620_hukglfkfklk%3B.png"
          alt="Logo"
        ></img>
        <form className="login_form">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></Input>
          <Input
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
          <Button type="submit" onClick={signIn}>
            <strong>Login</strong>
          </Button>
        </form>
        <div className="login_h">
          <div className="login_hr"></div>
          <h3 className="login_or">OR</h3>
          <div className="login_hr"></div>
        </div>
        <div>
          <button className="login_face">
            <FacebookIcon
              color="primary"
              className="facebook"
              fontSize="large"
            ></FacebookIcon>
            Login with facebook
          </button>
        </div>
      </div>
      <div className="login_sign">
        <p>Don't have an account?</p>
        <Button
          className="login_sb"
          onClick={() => {
            setOpen(true);
          }}
        >
          Sign up
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <div className="model">
            <img
              className="model_logo"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="Logo"
            ></img>
            <form className="model_form">
              <Input
                className="model_input"
                placeholder="Username"
                value={signUsername}
                onChange={(e) => {
                  setSignUsername(e.target.value);
                }}
              ></Input>
              <Input
                className="model_input"
                placeholder="Email"
                value={signEmail}
                onChange={(e) => {
                  setSignEmail(e.target.value);
                }}
              ></Input>
              <Input
                className="model_input"
                type="password"
                placeholder="Password"
                value={signPass}
                onChange={(e) => {
                  setSignPass(e.target.value);
                }}
              ></Input>
              <Button type="submit" onClick={signUp}>
                Sign up
              </Button>
            </form>
          </div>
        </div>
      </Modal>

      <div className="login_get1">
        <div>
          <p>Get The App</p>
        </div>

        <div className="login_get">
          <img
            className="get"
            src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png"
          ></img>
          <img
            className="get"
            src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Login;
