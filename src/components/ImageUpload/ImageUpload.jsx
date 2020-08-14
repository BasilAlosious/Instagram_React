import React,{useState} from 'react'
import { Button } from '@material-ui/core'
import firebase from 'firebase'
import {storage,db} from '../../firebase'
import './ImageUpload.css'
const ImageUpload = ({username}) => {
    const[image,setImage]=useState(null)
    const[caption, setCaption]= useState('')
    const[progress,setProgress]=useState(0)

    const handleChange=(e) =>{
    if(e.target.files[0]){
        setImage(e.target.files[0])  
}// selects the first file that is uploaded // 
}
    const handleUpload=()=>{
       const uploadTask = storage.ref(`images/${image.name}`).put(image)
       uploadTask.on(
        "state_changed",
        (snapshot) => {
            //progress bar 
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes)*100
            );
            setProgress(progress)
        },
        (error) => {
            console.log(error)
            alert(error.message)
        },
        () => {
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then( url => {
                // posting image into db 
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    username:username
                })
                setProgress(0)
                setCaption("")
                setImage(null)
                })
        }
       )
        
    }
    return (
        <div className="imageUpload">
        <progress className="imageUpload__progress" value={progress} max="100" />
        <input className="imageUpload__caption" type="text"  placeholder='Enter a Caption' onChange={(e) => setCaption(e.target.value)} value={caption} />
        <input type="file" onChange={handleChange}/>
        <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
