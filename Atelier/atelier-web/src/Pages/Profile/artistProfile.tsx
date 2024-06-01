import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import './artistProfileStyle.css';
import Header from '../../Header';
import Footer from '../../Footer';

const ArtistProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState(0); // State for followers count
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'accounts', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setFollowers(data.followers || 0); // Initialize followers count
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchData();
  }, [userId, db]);

  const handleFollow = async () => {
    try {
      const docRef = doc(db, 'accounts', userId);
      if (userData && userData.role === 'artist') {
        const newFollowersCount = followers + 1; // Increment followers count
        await updateDoc(docRef, { followers: newFollowersCount });
        setFollowers(newFollowersCount); // Update local state
      }
    } catch (error) {
      console.error('Error updating followers count:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const docRef = doc(db, 'accounts', userId);
      if (userData && userData.role === 'artist' && followers > 0) {
        const newFollowersCount = followers - 1; // Decrement followers count
        await updateDoc(docRef, { followers: newFollowersCount });
        setFollowers(newFollowersCount); // Update local state
      }
    } catch (error) {
      console.error('Error updating followers count:', error);
    }
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Header />
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      {userData.coverPhoto && <img src={userData.coverPhoto} alt="Cover" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />}
      <Avatar src={userData.profilePhoto} alt={userData.fullName} sx={{ width: 100, height: 100 }} />
      <Typography variant="h5">{userData.fullName}</Typography>
      <Typography variant="body1">@{userData.username}</Typography>
      <Typography variant="body2">{userData.role}</Typography>
      <Typography variant="body2">{userData.description}</Typography>
      
      {userData.role === 'artist' && (
        <Box mt={2}>
          {followers === 0 ? (
            <Button variant="contained" onClick={handleFollow}>Follow</Button>
          ) : (
            <Button variant="outlined" onClick={handleUnfollow}>Unfollow</Button>
          )}
          <Typography variant="body2">Followers: {followers}</Typography>
        </Box>
      )}
    </Box>

    <Footer />
    </div>
  );
};

export default ArtistProfile;
