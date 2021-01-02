import React, { useState, useEffect } from "react";
import "./App.css";
import Nav from "./components/Nav/Nav";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, IconButton, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import "./components/Nav/Nav.css";
import Login from "./components/login/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { actionTypes } from "./reducer";
import { useStateValue } from "./StateProvider";
import Profile from "./components/profile/Profile";
import Main from "./Main";

import AddIcon from "@material-ui/icons/Add";
import Chat from "./components/chat/Chat";
import Chat_right from "./components/chat/Chat_right";
import Explore from "./components/explore/Explore";
import ImgModel from "./components/explore/ImgModel";

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

function App() {
  const [posts, setPosts] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  useEffect(() => {
    auth.onAuthStateChanged((r) => {
      if (r) {
        dispatch({
          type: actionTypes.SET_USER,
          user: r,
        });
      } else {
        dispatch({
          type: actionTypes.SET_USER,
          user: null,
        });
      }
    });
  }, [user]);

  return (
    <div className="app">
      {!user ? (
        <Login></Login>
      ) : (
        <div>
          <Router>
            <Switch>
              <Route path="/explore/:imgId">
                <div className="dark"></div>

                <ImgModel></ImgModel>
              </Route>
              <Route path="/explore">
                <Nav></Nav>
                <Explore></Explore>
              </Route>
              <Route path="/messges/:userChat/:roomId">
                <Nav></Nav>
                <div className="app_chat">
                  <div className="chat_left1">
                    <Chat></Chat>
                  </div>
                  <div className="chat_right">
                    <Chat_right></Chat_right>
                  </div>
                </div>
              </Route>
              <Route path="/messges/:userChat">
                <Nav></Nav>
                <div className="app_cLeft">
                  <Chat></Chat>
                </div>
              </Route>
              <Route path="/:profile">
                <Nav></Nav>
                <Profile></Profile>
              </Route>
              <Route path="/">
                <Nav></Nav>

                <Main></Main>
                <div className="app_add">
                  <IconButton
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <AddIcon></AddIcon>
                  </IconButton>
                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
                  <div style={modalStyle} className={classes.paper}>
                    <ImageUpload></ImageUpload>
                  </div>
                </Modal>
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
