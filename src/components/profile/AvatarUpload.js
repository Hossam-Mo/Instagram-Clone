import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "../../firebase";
import "./avatarupload.css";
import { useStateValue } from "../../StateProvider";

function AvatarUpload() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [{ user }, dispatch] = useStateValue();

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
          .child(`${image.name}`)
          .getDownloadURL()
          .then((url) => {
            db.collection("users")
              .doc(user.displayName)
              .collection("userAvatar")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),

                imgURl: url,
              });
            user.updateProfile({ photoURL: url });
            console.log(user);
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

export default AvatarUpload;
