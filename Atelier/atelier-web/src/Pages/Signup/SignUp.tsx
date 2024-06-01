import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../../FirebaseConfig";
import { useNavigate } from "react-router";
import { useState } from "react";
import { RadioGroup, Radio, FormControlLabel } from "@mui/material";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<'user' | 'artist'>('user');
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // Import useNavigate hook

  const db = getFirestore();
  const storage = getStorage();

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRole((event.target as HTMLInputElement).value as 'user' | 'artist');
  };

  const uploadProfilePhoto = async (file: File) => {
    const storageRef = ref(storage, `profile_photos/${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const uploadCoverPhoto = async (file: File) => {
    const storageRef = ref(storage, `cover_photos/${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const saveDataToFirestore = async () => {
    try {
      const profilePhotoURL = profilePhoto ? await uploadProfilePhoto(profilePhoto) : null;
      const coverPhotoURL = coverPhoto ? await uploadCoverPhoto(coverPhoto) : null;
      const accountCollection = "accounts";
      const docRef = await addDoc(collection(db, accountCollection), {
        email: email,
        fullName: fullName,
        username: username,
        description: description,
        profilePhoto: profilePhotoURL,
        coverPhoto: coverPhotoURL,
        role: selectedRole, // Save selected role
        followers: selectedRole === 'artist' ? 0 : null, // Add followers field if artist
      });
      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // Return the document ID
    } catch (err) {
      console.error("Error adding document: ", err);
      return null;
    }
  };

  const signUp = async () => {
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setOpenDialog(true);
    } catch (err) {
      if (err.message.includes("auth/invalid-email")) {
        setError("Sorry, we don't recognize this email.");
      } else if (err.message.includes("auth/invalid-credential")) {
        setError("Your password is incorrect. Please try again.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleDialogClose = async () => {
    setOpenDialog(false);
    const docId = await saveDataToFirestore(); // Get the document ID

    if (docId) {
      // Save the document ID and role to local storage
      localStorage.setItem('currentUserDocId', docId);
      localStorage.setItem('currentUserRole', selectedRole);

      // Determine the route based on the selected role
      const route = selectedRole === 'user' ? '/user' : '/artist';
      navigate(`${route}/${docId}`); // Navigate to the profile page with the document ID and role
    } else {
      // Handle error
      console.error("Failed to save data to Firestore.");
    }
  };

  return (
    <Box minHeight={"100vh"} sx={{ backgroundColor: "#E2C1BE" }}>
      <Box m="0 auto" maxWidth="500px">
        <Box m="0 auto" pt={"80px"} width={"280px"}>
          <img
            src="/src/assets/atelier-logo2.png"
            alt="Atelier"
            width={"100%"}
          />
        </Box>

        <Box mt={"15%"}>
          <Typography
            fontFamily={"Inknut Antiqua"}
            textAlign={"center"}
            color={"#232335"}
            fontSize={"175%"}
            fontWeight={"700"}
          >
            Sign Up
          </Typography>
        </Box>

        <Box mt={"10%"}>
          <TextField
            fullWidth
            required={true}
            label="Email"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                marginBottom: "15px",
                fontFamily: "Montserrat",
              },
            }}
          />

          <TextField
            fullWidth
            required={true}
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                marginBottom: "15px",
                fontFamily: "Montserrat",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            required={true}
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            variant="filled"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              disableUnderline: true,
              style: {
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
                marginBottom: "15px",
                fontFamily: "Montserrat",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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

          <Box mt="15%" display={"flex"} justifyContent={"center"}>
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
                "&:hover": {
                  backgroundColor: "#3B3B58",
                  fontWeight: "600",
                },
              }}
              onClick={signUp}
            >
              Sign Up
            </Button>
          </Box>

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
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/LogIn"
              sx={{
                textDecoration: "underline",
                fontWeight: "700",
                color: "#232335",
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Complete Your Profile</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            variant="filled"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Username"
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            variant="filled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="file"
            label="Profile Photo"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                setProfilePhoto(target.files[0]);
              }
            }}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="file"
            label="Cover Photo"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                setCoverPhoto(target.files[0]);
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
          <RadioGroup
            row
            aria-label="role"
            name="role"
            value={selectedRole}
            onChange={handleRoleChange}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="artist" control={<Radio />} label="Artist" />
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Launch Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SignUpPage;
