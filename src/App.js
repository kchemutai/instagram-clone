import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import { useState, useEffect } from 'react';
import './App.css';
import { db, auth } from './firebase';
import Post from './Post';
import { Button } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSingIn] = useState(false)

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshop => {
      setPosts(snapshop.docs.map(doc => ({ id: doc.id, post: doc.data() })))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => alert(error.message))
    setOpen(false)
  }

  const signIn = (e) => {
    e.preventDefault()
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))
    setOpenSingIn(false)
  }

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // user is signed in..
        console.log(authUser)
        setUser(authUser)
      } else {
        //user is not signed in.. 
        setUser(null)
      }
    })
    return () => {
      // perform clean up actions on the state
      unsubcribe()
    }
  }, [username, user])


  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUp'>
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
            </center>
            <input type="text"
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp} type='submit'>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSingIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signUp'>
            <center>
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
            </center>
            <input type="email"
              placeholder='User Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn} type='submit'>Sign In</Button>
          </form>
        </div>
      </Modal>



      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="app__headerImage" />
        {
          user ?
            (
              <Button onClick={() => auth.signOut()}>Sign Out</Button>
            ) :
            (
              <div className="app__loginContainer">
                <Button onClick={() => setOpen(true)}>Sign Up</Button>
                <Button onClick={() => setOpenSingIn(true)}>Sign In</Button>
              </div>
            )
        }
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://instagram.com/p/B_uf9dmAGPw/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

      {user?.displayName ? (<ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to Login</h3>
      )
      }

    </div>
  );
}

export default App;
