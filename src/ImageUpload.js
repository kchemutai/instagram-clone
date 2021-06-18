import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import './ImageUpload.css'
import { storage, db } from './firebase'
import firebase from 'firebase'


function ImageUpload({ username }) {

    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState('')
    const [progress, setProgres] = useState(0)

    const handleUpload = () => {
        const uploadtask = storage.ref(`images/${image.name}`).put(image)
        uploadtask.on('state_changed',
            (snapshot) => {
                //progress function...
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgres(progress)
            },
            (error) => {

                //error function
                alert(error.message)
                console.log(error)
            },
            () => {
                //complete function
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post the image in the database
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgres(0)
                        setCaption('')
                        setImage(null)
                    })
            }
        )
    }

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    return (
        <div className='imageUpload'>
            <progress value={progress} max='100' className='imageUpload__progress' />
            <input type="text" placeholder='Enter a caption...' value={caption} onChange={e => setCaption(e.target.value)} />
            <input type="file" name="" id="" onChange={handleChange} />
            <Button onClick={handleUpload} >Upload</Button>
        </div>
    )
}

export default ImageUpload
