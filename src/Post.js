import { Avatar } from '@material-ui/core'
import React from 'react'
import './Post.css'
import { db } from './firebase'
import { useState, useEffect } from 'react';
import firebase from 'firebase';


function Post({ username, caption, imageUrl, postId, user }) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timeStamp', 'desc')
                .onSnapshot(snapshot => setComments(snapshot.docs.map(doc => doc.data())))
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault()
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar
                    className='post__avatar'
                />
                <h3>{username}</h3>
            </div>
            <img src={imageUrl} alt="" className="post__image" />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>
            {
                user && (
                    <form action="" className='post__commentFormBox'>
                        <input
                            type="text"
                            className='post__input'
                            placeholder='Add Comment...'
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />

                        <button
                            type="submit"
                            onClick={postComment}
                            disabled={!comment}
                            className='post__button'
                        >
                            Post
                        </button>
                    </form>
                )
            }

        </div>
    )
}

export default Post
