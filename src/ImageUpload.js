import React, { useEffect, useState } from "react";
import { Button, Input } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import "./imageupload.css";
import { useStateValue } from "./StateProvider";

function ImageUpload() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [{ user }, dispatch] = useStateValue();

  const [avtarImg, setAvatarImg] = useState([]);
  useEffect(() => {
    if (user.displayName !== null)
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
  }, []);
  let avaImg1;
  if (avtarImg.length > 0) {
    avaImg1 = avtarImg[0].avaImg;
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    console.log(image);
    const uploadTask = storage.ref(`images/${image?.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (s) => {
        const p = Math.round((s.bytesTransferred / s.totalBytes) * 100);
        setProgress(p);
      },
      (err) => {
        alert(err.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            if (user.displayName !== null) {
              db.collection("posts")
                .doc(user.displayName + image.name)
                .set({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  caption: caption,
                  imgURl: url,
                  username: user.displayName,
                  avatarImg: user.photoURL,
                });
              db.collection("users")
                .doc(user.displayName)
                .collection("userPosts")
                .doc(user.displayName + image.name)
                .set({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  caption: caption,
                  imgURl: url,
                  username: user.displayName,
                  avatarImg: user.photoURL,
                });
            }
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageupload">
      <progress className="pro" value={progress} max="100"></progress>

      <div className="file_up">
        <Input
          className="cap"
          type="text"
          placeholder="Enter a caption..."
          onChange={(e) => {
            setCaption(e.target.value);
          }}
          value={caption}
        ></Input>
        <input
          className="file"
          id="file"
          type="file"
          onChange={handleChange}
        ></input>
        <label for="file">Chose an image</label>
      </div>

      <Button className="upload" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
