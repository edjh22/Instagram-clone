import './App.css';
import Post from './Post';
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase.js';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { makeStyles } from '@material-ui/core/styles';
import {Input} from "@mui/material";
import ImageUpload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";



function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: '${top}%',
        left: '${left}%',
        transform: 'translate(-${top}%, -${left}%)',
    };
}
const useStyles = makeStyles((theme)=> ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: "whitesmoke",
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2,4,3),
    },
}));

function App() {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);


    useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser) {
                console.log(authUser);
                setUser(authUser);

            } else {
                setUser(null);
            }


        })

        return () => {
           // cleans actions before refiring
            unsubscribe();
        }
    }, [user, username]);


    //Runs code based on a condition
    useEffect(()=> {
        // Where the code runs
        db.collection('posts').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data()

            })));
        }) // Powerful listener that captures the collection when the database changes
    }, []);

    const signUp = (event) => {
        event.preventDefault();

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser)=> {
                return authUser.user.updateProfile({
                    displayName: username
                })
            })
            .catch((error) => alert(error.message));

    }


    const signIn = (event) => {
        event.preventDefault();

        auth
            .signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message))

        setOpenSignIn(false);
    }

  return (
    <div className="App">

        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <div style={modalStyle} className={classes.paper}>
            <form className="app_signup">
                <center>
                    <img
                    className="app_headerImage"
                    src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
                    alt="Instagram logo" width="100" height="60"
                />
                </center>
                <Input
                    placeholder="username"
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <Button type="submit" onClick={signUp}>Sign up</Button>
            </form>

            </div>
        </Modal>

        <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
        >
            <div style={modalStyle} className={classes.paper}>
                <form className="app_signIn">
                    <center>
                        <img
                            className="app_headerImage"
                            src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
                            alt="Instagram logo" width="100" height="60"
                        />
                    </center>
                    <Input
                        placeholder="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <Button type="submit" onClick={signIn}>Sign in</Button>
                </form>

            </div>
        </Modal>
      <div className="app_header">

          <img
              className="app_headerImage"
              src="https://1000logos.net/wp-content/uploads/2017/02/Logo-Instagram.png"
              alt="Instagram logo" width="100" height="60"
              >
          </img>
          {user ? (
              <Button onClick={() => auth.signOut()}>Logout</Button>
          ): (
              <div className="app_loginContainer">

                  <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
                  <Button onClick={() => setOpen(true)}>Sign up</Button>

              </div>
          )}
      </div>

        <div className="app_posts">
            <div className="app_postsLeft">
            {
                posts.map(({id, post}) => (
                    <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
                ))
            } </div>
            <div className="app_postsRight">
                <InstagramEmbed
                    url='https://instagr.am/p/Ytlfl/'
                    maxWidth={375}
                    hideCaption={false}
                    containerTagName='div'
                    injectScript
                    protocol=''
                    onLoading={() => {}}
                    onSuccess={() => {}}
                    onAfterRender={() => {}}
                    onFailure={() => {}}
                 />
            </div>
        </div>


        {user && user.displayName ? (
            <ImageUpload username={user.displayName} />
        ): (
            <h3>You need to login to upload an image</h3>
        )}
    </div>
  );
}

export default App;
