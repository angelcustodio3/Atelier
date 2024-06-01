import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../FirebaseConfig';
import './artistProfileStyle.css';
import Header from '../../Header';
import Footer from '../../Footer';

const Artist: React.FC = () => {
    const [coverURL, setLogoIconURL] = useState('');
    const [profileURL, setProfileURL] = useState('');


    useEffect(() => {
        fetchIconURLs(); // Fetch icon URLs
    }, []);

    const fetchIconURLs = async () => {
        try {
          // Fetch icon URLs from Firebase Storage
          const iconsRef = ref(storage, 'img');
          const coverURL = await getDownloadURL(ref(iconsRef, 'hero3.jpg'));
          const profileURL = await getDownloadURL(ref(iconsRef, '/profile/pp3.jpg'));
          
          setLogoIconURL(coverURL);
          setProfileURL(profileURL);
          
        } catch (error) {
          console.error('Error fetching icon URLs:', error);
        }
    };
    
    return (
        <div>
            <Header />
            
            <div id='profile-banner'>

                <div id='profile-cover'>
                <img src={coverURL} className="cover-photo" alt="Artist cover photo" />
                </div>

                <div id='profile-elements'>

                    <div id='profile-cont'>
                        <div id='profile-picture'>
                        <img src={profileURL} className="profile-photo" alt="Artist profile photo" />
                        </div>

                        <div id='profile-deets'>
                            <p id='artist-name'>John Doe</p>
                            <p id='artist-username'>@johndoe</p>
                            <p id='artist-followers'>21 Followers</p>
                        </div>

                    </div>

                    <div id='profile-buttons'>
                        <button className='artist-profile-btns' id='msg-button'>
                            Message
                        </button>

                        <button className='artist-profile-btns' id='follow-button'>
                            Follow
                        </button>
                    </div>
                </div>

            </div>


            <Footer />
        </div>
    );
};

export default Artist;
