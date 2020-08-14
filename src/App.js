import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './components/Post/Post';
import {db,auth} from './firebase'
import  Modal  from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button,Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload/ImageUpload'
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
  const [modalStyle] = useState(getModalStyle);
  const[openSignIn,setOpenSignIn]=useState('')
  const [posts,setPosts]= useState([])
  const[open,setOpen] = useState(false)
  const[username,setUsername]= useState('')
  const[password,setPassword]=useState('')
  const[email,setEmail]=useState('')
  const[user, setUser]=useState(null)

  useEffect(() => {
    /* onSnapshot is a real time event listener that captures all the changes happening to collection and fires off*/
  db.collection('posts').orderBy('timestamp','desc').onSnapshot((snapshot) => (
  setPosts(snapshot.docs.map((doc) =>({
    id:doc.id, 
    post:doc.data()
  })))
  ))
  }, [])
  /* doc.id is used to get the unique document id from the db*/
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser)
      } else {
        setUser(null)
      }
      return () => {
      unsubscribe()
      }
    })  
  }, [user,username])

  const signUp = (event) =>{

    event.preventDefault()
    /* to create a user. Auth is firebase method */
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=> alert(error.message))
  }
  const signIn = (event) =>{
  event.preventDefault()
  auth.signInWithEmailAndPassword(email,password)
      .catch((error)=>alert(error.message))
    setOpen(false)
  }

  return (
    <div className="App">
    
    <Modal
    open={open}
    onClose={() => setOpen(false)}
    >
    <div style={modalStyle} className={classes.paper}>
    <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
            Sign Up
          </Button>
          </form>
    </div>
    </Modal>
    <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram Logo"
              />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

    <div className="app__header">

    <img
    className="app__headerImage"
    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
    alt="logo"    
    />

    { user ? (<Button onClick={() => auth.signOut()}>Log Out </Button>
    ):(
      <div className="app__loginContainer">
      <Button type="submit" onClick= {() => setOpen(true)}>Sign Up </Button>
      <Button type="submit" onClick= {() => setOpenSignIn(true)}>Sign In </Button>
      </div> 
      )    
  }
    </div>

    
    <div className="app__posts">
      <div className="app__postLeft">
        { 
          posts.map(({id,post}) =>(
            <Post  key={id}  postId={id} user={user}username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        } 
     </div>
        <div className="app__postRight">
          <InstagramEmbed
          url='https://www.instagram.com/p/CD1P8t2JgtG/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
          />
        </div>
       
    </div>
  
    {
      // the ? after user protects app from breaking . applies the condition only if user.displayName present . It is called optional chaining//
      user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):(
        <h3>You Need to Login To Upload</h3>
      )}

    </div>

    
  );
}

export default App;
