import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import "./explore.css";
import { Link } from "react-router-dom";
function Explore() {
  const [exp, setExp] = useState([]);
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((s) => {
        setExp(
          s.docs.map((it) => {
            return {
              avatarImg: it.data().avatarImg,
              caption: it.data().caption,
              imgURl: it.data().imgURl,
              username: it.data().username,
              id: it.id,
            };
          })
        );
      });
  }, []);
  return (
    <div className="ex">
      {exp.map((it) => {
        return (
          <Link to={`/explore/${it.id}`}>
            <img
              className="ex_imgs"
              key={it.id}
              src={it.imgURl}
              alt={it.username}
            ></img>
          </Link>
        );
      })}
    </div>
  );
}

export default Explore;
