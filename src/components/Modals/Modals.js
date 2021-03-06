import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import  Modal  from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import {auth} from '../../firebase'

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
      width:250,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
   
  const Modals = ({open,setOpen,openSignIn,setOpenSignIn,theme}) => {
    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle);
    const[username,setUsername]= useState('')
    const[password,setPassword]=useState('')
     const[email,setEmail]=useState('')
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
          
          <div className="Modals">
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
          </div>
          
      )
  }
  
  export default Modals
  