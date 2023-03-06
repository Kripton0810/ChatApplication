import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';

const Chats = () => {
    const { user } = useAuth();
    console.log(user);
    const history = useHistory();

    const handleLogout = async () => {
        await auth.signOut();
        history.push('/'); //renavigate to login page
    }

    useEffect(() => {
        if(!user) {
            history.push('/');
            return;
        }

        axios.get('https://api.chatengine.io/users/me', {
            headers: {
                'project-id': 'a2639f4a-0906-4ce1-b4be-965f13d279db',
                'user-name' : user.email
            }
        })
    }, [user, history]);
    return (
        <div className='chat-page'>
            <div className='nav-bar'>
                <div className='logo-tab'>
                    Arrowhead <SendOutlined />
                </div>
                <div onClick={handleLogout} className='logout-tab'>
                    Logout
                </div>
            </div>

            <ChatEngine
                height='calc(100vh - 66px)'
                projectId='a2639f4a-0906-4ce1-b4be-965f13d279db'
                userName='.'
                userSecret='.'
            />
        </div>
    )
}

export default Chats