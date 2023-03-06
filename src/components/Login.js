import React, { useState } from 'react'
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "firebase/compat/app";
import { auth, storage } from '../firebase';
import firebase from 'firebase/compat/app';
import './login.css';

/**
 * Login page with google and facebook auth provider buttons
 */
const Login = () => {
  const ERROR_EMAIL_ALREADY_IN_USE = 'The email address is already in use by another account';
  const ERROR = 'Something went wrong';

  const [account, setAccount] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
    .then(({userCredential}) => {
      // Signed in 
      setUser(userCredential.user);
      
      const storageRef = ref(storage, email);

      const uploadTask = uploadBytesResumable(storageRef, avatar);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
          setError(ERROR);
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...

          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(user, {
              displayName: user.name,
              photoURL: downloadURL
            })
          });
        }
      );
    })
    .catch((error) => {
      //const errorCode = error.code;
      const errorMessage = error.message;
      if(errorMessage.includes(ERROR_EMAIL_ALREADY_IN_USE)) {
        setError(ERROR_EMAIL_ALREADY_IN_USE);
      }
      else {
        setError(ERROR);
      }
    });

  }

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setAvatar('');
  }

  return (
    <div id='login-page'>
      <div className='heading'>
        <h2>Welcome to Arrowhead</h2>
      </div>
      <div id='login-card'>
        <h2>Sign {account ? 'Up':'In'}</h2>

        {error &&
          <div className='error'>
            {error}
          </div>
        }

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {account && 
              <div>
                <label htmlFor="name">Name</label>
                <input type="text" name='name' value={name} onChange={e => setName(e.target.value)}/>
              </div>
            }

            <div>
              <label htmlFor="email">Email</label>
              <input type="email" name='email' value={email} onChange={e => setEmail(e.target.value)}/>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {account && 
              <div className="box">
                <div className="js--image-preview"></div>
                <div className="upload-options">
                  <label>
                    <input type="file" className="image-upload" accept="image/*" value={avatar} onChange={e => setAvatar(e.target.value)} />
                  </label>
                </div>
              </div>
            }

            <div>
              <button className='signin-button' type="submit">Continue</button>
            </div>
          </form>

          <div className="social-divider">
            <span>or</span>
          </div>

          <div className='auth-signin-btn'>
            <div 
              className='login-button google'
              onClick={() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}
            >
              <GoogleOutlined /> Google
            </div>

            <div 
              className='login-button facebook'
              onClick={() => auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider())}
            >
              <FacebookOutlined /> Facebook
            </div>
          </div>
        </div>
        <div className='swich-sign-tab'>
          {account ? 
            <span>You do have an account? <a onClick={() => setAccount(false)}>Login</a></span> : 
            <span>You don't have an account? <a onClick={() => setAccount(true)}>Register</a></span>
          }
        </div>
      </div>
    </div>
  );
}

export default Login