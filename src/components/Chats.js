import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";

const Chats = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const PROJECT_ID = "a2639f4a-0906-4ce1-b4be-965f13d279db";
  const handleLogout = async () => {
    await auth.signOut();
    history.push("/"); //renavigate to login page
  };
  const getFile = async (url) => {
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.blob(); //containg our image
    return new File([data], "userPhoto.jpeg", { type: "image/jpeg" });
  };

  useEffect(() => {
    if (!user) {
      history.push("/");
      return;
    }

    /**
     * getting the already created user
     * if we have one we can immediately show the chat of that specific user
     */
    axios
      .get("https://api.chatengine.io/users/me", {
        headers: {
          "project-id": "a2639f4a-0906-4ce1-b4be-965f13d279db",
          "user-name": user.email,
          "user-secret": user.uid,
        },
      })
      .then(() => {
        setLoading(false); //SAFE POINT 1
      })
      .catch(() => {
        let formdata = new FormData();
        formdata.append("email", user.email);
        //formdata.append('username', user.email);
        formdata.append("username", user.displayName);
        formdata.append("secret", user.uid);

        getFile(user.photoURL)
          .then((avatar) => {
            console.log(...formdata);
            formdata.append("avatar", avatar, avatar.name);
            axios
              .post("https://api.chatengine.io/users/", formdata, {
                headers: {
                  "private-key": "a9fc55e6-a71f-4626-94b0-5e443d2333e5",
                },
              })
              .then(() => setLoading(false))
              .catch((error) => console.log("error 1" + error));
          })
          .catch((err) =>
            console.log("err 2" + err + " photo url is " + user.photoURL)
          );
      });
  }, [user, history]);

  if (!user || loading) return "Loading...";

  return (
    <div className="chat-page">
      <div className="nav-bar">
        <div className="logo-tab">
          Arrowhead <SendOutlined />
        </div>
        <div onClick={handleLogout} className="logout-tab">
          Logout
        </div>
      </div>

      <ChatEngine
        height="calc(100vh - 66px)"
        projectID={PROJECT_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;
