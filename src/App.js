import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './components/Post/Post';
import {db,auth} from './firebase'
import { Button } from '@material-ui/core';
import ImageUpload from './components/ImageUpload/ImageUpload'
import InstagramEmbed from 'react-instagram-embed';
import Modals from './components/Modals/Modals'
 
function App() {
 /* const classes = useStyles()
  const [modalStyle] = useState(getModalStyle); */
  const[openSignIn,setOpenSignIn]=useState('')
  const [posts,setPosts]= useState([])
  const[open,setOpen] = useState(false)
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
  }, [user])

  

  return (
    <div className="App">
    <Modals open={open} setOpen={setOpen} openSignIn={openSignIn} setOpenSignIn={setOpenSignIn}  />

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
