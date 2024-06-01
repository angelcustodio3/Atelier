import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link, Checkbox, FormGroup, FormControlLabel, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Navigate, useNavigate, Link as RouterLink } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../FirebaseConfig';
import { getFirestore, doc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';

function LogInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const firestore = getFirestore();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;
  
      // Query Firestore to find the user document with the corresponding email
      const querySnapshot = await getDocs(query(collection(firestore, 'accounts'), where('email', '==', userEmail)));
  
      if (!querySnapshot.empty) {
        // Assuming there's only one document matching the email
        const docId = querySnapshot.docs[0].id;
        const userData = querySnapshot.docs[0].data();
        const userRole = userData.role; // Assuming you have a 'role' field in the user document
  
        // Store the document ID and role in local storage
        localStorage.setItem('currentUserDocId', docId);
        localStorage.setItem('currentUserRole', userRole);
  
        // Determine the route based on the user's role
        const route = userRole === 'user' ? '/user' : '/artist';
        navigate(`${route}/${docId}`);
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
    }
  };
  

  return (
    <Box minHeight="100vh" sx={{ backgroundColor: "#E2C1BE" }}>
      <Box m="0 auto" maxWidth="500px">
        <Box m="0 auto" pt="80px" width="280px">
          <img src="/src/assets/atelier-logo2.png" alt="Atelier" width="100%" />
        </Box>
        <Box mt="15%">
          <Typography fontFamily="Inknut Antiqua" textAlign="center" color="#232335" fontSize="175%" fontWeight="700">
            Log In
          </Typography>
        </Box>
        <Box mt="10%">
          <TextField
            fullWidth
            required
            label="Email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ disableUnderline: true, style: { backgroundColor: "#FFFFFF", borderRadius: "5px", marginBottom: "15px", fontFamily: "Montserrat" } }}
          />
          <TextField
            fullWidth
            required
            type={showPassword ? 'text' : 'password'}
            label="Password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { backgroundColor: "#FFFFFF", borderRadius: "5px", marginBottom: "15px", fontFamily: "Montserrat" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Box display="flex" justifyContent="space-between">
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="Remember me" sx={{ fontFamily: "Montserrat" }} />
            </FormGroup>
            <Typography fontFamily="Montserrat" fontWeight="500">
              <Link component={RouterLink} to="/forgot-password" sx={{ textDecoration: "none", color: "#232335" }}>
                Forgot Password?
              </Link>
            </Typography>
          </Box>
          <Box mt="15%" display="flex" justifyContent="center">
            <Button
              fullWidth
              size="medium"
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#91488A",
                borderRadius: "5px",
                height: "50px",
                fontFamily: "Montserrat",
                fontSize: "20px",
                fontWeight: "500",
                "&:hover": { backgroundColor: "#3B3B58", fontWeight: "600" },
              }}
              onClick={logIn}
            >
              Log In
            </Button>
          </Box>
          <Typography fontFamily="Montserrat" textAlign="center" color="#232335" fontSize="18px" fontWeight="400" sx={{ marginTop: "10px" }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/SignUp" sx={{ textDecoration: "underline", fontWeight: "700", color: "#232335" }}>
        </Box>

        <Box mt={"3%"} display={"flex"} justifyContent={"space-between"}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox color="default" sx={{ color: "#232335" }} />}
              label={
                <Typography
                  fontFamily={"Montserrat"}
                  textAlign={"center"}
                  color={"#232335"}
                  fontSize={"18px"}
                  fontWeight={"400"}
                >
                  Remember Me
                </Typography>
              }
              sx={{ color: "#232335", "& .MuiSvgIcon-root": { fontSize: 18 } }}
            />
          </FormGroup>

          <Box>
            <Link
              // href="#"
              component={RouterLink}
              to="/forgot-password" 
              sx={{
                textDecoration: "underline",
                fontFamily: "Montserrat",
                color: "#232335",
              }}
            >
              {/* backgroundColor: "#7A5980", */}
              Forgot Password?
            </Link>
          </Box>
        </Box>

        <Box mt={"5px"}>
          <Typography
            fontFamily={"Montserrat"}
            textAlign={"center"}
            color={"#232335"}
            fontSize={"18px"}
            fontWeight={"400"}
            sx={{
              marginTop: "10px",
            }}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/SignUp"
              sx={{
                textDecoration: "underline",
                fontWeight: "700",
                color: "#232335",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LogInPage;