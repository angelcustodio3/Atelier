// UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Box, Typography, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import './userProfileStyle.css';
import Header from '../../Header';
import Footer from '../../Footer';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'accounts', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchData();
  }, [userId, db]);

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
    </Box>

    <Footer />
    </div>
  );
};

export default UserProfile;