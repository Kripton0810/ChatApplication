import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const AuthContext = React.createContext(); //create the context

export const useAuth = () => useContext(AuthContext); //function that we can use later on to grab that context

// react children is going to render all jsx that we pass into this auth provider
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  //The useHistory hook gives you access to the history instance that you may use to navigate.
  const history = useHistory();

  useEffect(() => {
    // grabbing the user from the firebase authentication
    auth.onAuthStateChanged((user) => {
      setUser(user); //set user/new user
      setLoading(false); //stop loading
      if (user) {
        history.push("/chats"); //renavigate to chats page
      }
    });
  }, [user, history]); //happens after page renders or user/history value changes

  //as we are working with authContext we need to have one value object
  const value = { user };

  return (
    // passing user as the value
    <AuthContext.Provider value={value}>
      {/* if not loading then show the children */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
