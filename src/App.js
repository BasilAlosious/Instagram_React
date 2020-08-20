import React,{useState,useEffect} from 'react';
import './App.css';
import Post from './components/Post/Post';
import {db,auth} from './firebase'
import { Button } from '@material-ui/core';
import ImageUpload from './components/ImageUpload/ImageUpload'
import Modals from './components/Modals/Modals'
import {ThemeProvider,createGlobalStyle} from 'styled-components'
import dark from './images/dark.jpg'
import light from './images/light.jpg'
import { IconButton } from '@material-ui/core';
import Brightness7OutlinedIcon from '@material-ui/icons/Brightness7';
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';
function App() {
 
  const[openSignIn,setOpenSignIn]=useState('')
  const [posts,setPosts]= useState([])
  const[open,setOpen] = useState(false)
  const[user, setUser]=useState(null)
  const [theme,setTheme]=useState({mode:'light'})

  
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

  const GlobalStyle= createGlobalStyle`
  body{
    background-color:${props =>
    props.theme.mode === 'dark' ? '#111':'#EEE'};
    color: ${ props => props.theme.mode ==='dark' ? '#EEE':'#111'};    
  }
  `

  return (
    <ThemeProvider theme={theme}>
    <>
    <GlobalStyle/>
    <div className="App">
    <Modals open={open} setOpen={setOpen} openSignIn={openSignIn} setOpenSignIn={setOpenSignIn} theme={theme} />

    <div className="app__header">
    { theme.mode==='dark' ?(
      <IconButton>
      <Brightness4OutlinedIcon fontSize='large' color='primary' onClick={e=>setTheme(theme.mode==='dark' ?{mode:'light'}:{mode:'dark'})}/>
      </IconButton>
    ):(
      <IconButton>
    <Brightness7OutlinedIcon fontSize='large' color='primary' onClick={e=>setTheme(theme.mode==='dark' ?{mode:'light'}:{mode:'dark'})}/>
    </IconButton>
    )
     
    
    }
    
    
    <img
    className="app__headerImage"
    src={theme.mode==='dark' ? dark:light}
    alt="logo"    
    />

    { user ? (<Button  color="primary" onClick={() => auth.signOut()}>Log Out </Button>
    ):(
      <div className="app__loginContainer">
      <Button  color="primary" type="submit" onClick= {() => setOpen(true)}>Sign Up </Button>
      <Button  color="primary" type="submit" onClick= {() => setOpenSignIn(true)}>Sign In </Button>
      </div> 
      )    
  }
    </div>

    
    <div className="app__posts">
      <div className="app__postLeft">
        { 
          posts.map(({id,post}) =>(
            <Post  theme={theme}key={id}  postId={id} user={user}username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        } 
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
    </>
    </ThemeProvider>
  );
}

export default App;
