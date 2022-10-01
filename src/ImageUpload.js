import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { db, storage } from './firebase.js';
import firebase from "firebase/compat/app";
import './ImageUpload.css';


//import { useState, useEffect } from "react";
/*import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
} from "firebase/storage"; */
//import { storage } from "./firebase";
//import React from 'react'
//import { v4 } from "uuid";

function ImageUpload({username}) {


    const[image, setImage] = useState(null);
    const[progress, setProgress] = useState(0);
    const[caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(

            "state_changed",
            (snapshot) => {
                // progress logic
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //posts image to db

                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username

                        })

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }

        );
    };


    return (
        <div className="imageupload">

            <progress className="imageupload_progress" value={progress} max="100"/>
            <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>



        </div>
    )
}


export default ImageUpload

/*
function ImageUpload() {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);

    const imagesListRef = ref(storage, "images/");
    const uploadFile = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls((prev) => [...prev, url]);

            }) ;
        });
    };

    useEffect(() => {
        listAll(imagesListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageUrls((prev) => [...prev, url]);
                });
            });
        });
    }, []);

    return (
        <div>
            <input
                type="file"
                onChange={(event) => {
                    setImageUpload(event.target.files[0]);
                }}
            />
            <button onClick={uploadFile}> Upload Image</button>
            {imageUrls.map((url) => {
                return <img src={url} />;
            })}
        </div>
    );
}

export default ImageUpload; */

