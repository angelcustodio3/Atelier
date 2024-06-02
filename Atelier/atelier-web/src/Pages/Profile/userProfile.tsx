import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Header";
import Footer from "../../Footer";
import "./userProfileStyle.css";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [collections, setCollections] = useState([]);
  const [exhibitArtworks, setExhibitArtworks] = useState([]);
  const [openCollectionDialog, setOpenCollectionDialog] = useState(false);
  const [openArtworkDialog, setOpenArtworkDialog] = useState(false);
  const [openExhibitDialog, setOpenExhibitDialog] = useState(false);
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [newCollectionData, setNewCollectionData] = useState({
    name: "",
    description: "",
    coverPhoto: "",
  });
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [newArtworkData, setNewArtworkData] = useState({
    name: "",
    description: "",
    coverPhoto: "",
  });
  const [newExhibitArtwork, setNewExhibitArtwork] = useState({
    name: "",
    photo: "",
    description: "",
    tags: [],
    price: "",
    stock: "",
  });
  const [editedUserData, setEditedUserData] = useState({});
  const [selectedCollectionArtworks, setSelectedCollectionArtworks] = useState(
    []
  );
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "accounts", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          // Fetch collections
          const collectionsRef = collection(docRef, "collections");
          const collectionsSnapshot = await getDocs(collectionsRef);
          const collectionsList = collectionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCollections(collectionsList);
          // Fetch exhibit artworks
          const exhibitRef = collection(docRef, "exhibit");
          const exhibitSnapshot = await getDocs(exhibitRef);
          const exhibitList = exhibitSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setExhibitArtworks(exhibitList);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, [userId, db]);

  const handleTabChange = (_event, newValue) => {
    setTabIndex(newValue);
  };

  const handleEditProfile = () => {
    setEditedUserData(userData);
    setOpenEditProfileDialog(true);
  };

  const handleSaveProfileChanges = async () => {
    const docRef = doc(db, "accounts", userId);
    await updateDoc(docRef, editedUserData);
    setUserData(editedUserData);
    setOpenEditProfileDialog(false);
  };

  const handleDeleteAccount = async () => {
    const docRef = doc(db, "accounts", userId);
    await deleteDoc(docRef);
    navigate("/");
  };

  const handleLogout = () => {
    // Implement logout functionality here, e.g., clearing session, redirecting to login page
    navigate("/");
  };

  const handleCollectionClick = async (collectionId) => {
    // Fetch artworks for the selected collection
    const artworksSnapshot = await getDocs(
      collection(
        db,
        "accounts",
        userId,
        "collections",
        collectionId,
        "artworks"
      )
    );
    const artworksList = artworksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Update state to store the artworks for the selected collection
    const updatedCollections = collections.map((collectionItem) => {
      if (collectionItem.id === collectionId) {
        return { ...collectionItem, artworks: artworksList };
      } else {
        return collectionItem;
      }
    });
    setCollections(updatedCollections);
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Size in MB
      if (fileSize > 2) {
        // File size exceeds 2MB, show error message or prevent form submission
        alert("Please upload an image with a maximum size of 2MB.");
        // Reset the file input field
        event.target.value = "";
        return;
      }
      // Proceed with saving the file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // Set the file data to state
        setEditedUserData({ ...editedUserData, profilePhoto: reader.result });
      };
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Size in MB
      if (fileSize > 2) {
        // File size exceeds 2MB, show error message or prevent form submission
        alert("Please upload an image with a maximum size of 2MB.");
        // Reset the file input field
        event.target.value = "";
        return;
      }
      // Proceed with saving the file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // Set the file data to state
        setNewCollectionData({
          ...newCollectionData,
          coverPhoto: reader.result,
        });
        // or setNewArtworkData({ ...newArtworkData, coverPhoto: reader.result });
      };
    }
  };

  const handleAddCollection = async () => {
    const collectionRef = collection(db, "accounts", userId, "collections");
    await addDoc(collectionRef, newCollectionData);
    setNewCollectionData({ name: "", description: "", coverPhoto: "" }); // Reset the form after adding
    setOpenCollectionDialog(false);
    // Fetch collections again
    const collectionsSnapshot = await getDocs(collectionRef);
    const collectionsList = collectionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCollections(collectionsList);
  };

  const handleAddArtwork = async () => {
    const artworkRef = collection(
      db,
      "accounts",
      userId,
      "collections",
      selectedCollectionId,
      "artworks"
    );
    await addDoc(artworkRef, newArtworkData);
    setNewArtworkData({ name: "", description: "", coverPhoto: "" }); // Reset the form after adding
    // Fetch artworks again after adding
    const artworksSnapshot = await getDocs(
      collection(
        db,
        "accounts",
        userId,
        "collections",
        selectedCollectionId,
        "artworks"
      )
    );
    const updatedArtworksList = artworksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    saveArtworks(updatedArtworksList);
  };

  const handleDeleteCollection = async (collectionId) => {
    const collectionRef = doc(
      db,
      "accounts",
      userId,
      "collections",
      collectionId
    );
    await deleteDoc(collectionRef);
    // Fetch collections again after deletion
    const collectionsSnapshot = await getDocs(
      collection(db, "accounts", userId, "collections")
    );
    const updatedCollectionsList = collectionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCollections(updatedCollectionsList);
  };

  const handleDeleteArtwork = async (collectionId, artworkId) => {
    const artworkRef = doc(
      db,
      "accounts",
      userId,
      "collections",
      collectionId,
      "artworks",
      artworkId
    );
    await deleteDoc(artworkRef);
    // Fetch artworks again after deletion
    const artworksSnapshot = await getDocs(
      collection(
        db,
        "accounts",
        userId,
        "collections",
        collectionId,
        "artworks"
      )
    );
    const updatedArtworksList = artworksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    saveArtworks(updatedArtworksList);
  };

  const saveArtworks = async (artworks) => {
    for (const artwork of artworks) {
      const artworkRef = collection(
        db,
        "accounts",
        userId,
        "collections",
        selectedCollectionId,
        "artworks"
      );
      await addDoc(artworkRef, artwork);
    }
    setOpenArtworkDialog(false);
  };

  const openArtworkDialogForCollection = (collectionId) => {
    setSelectedCollectionId(collectionId);
    setOpenArtworkDialog(true);
  };

  const handleAddExhibitArtwork = async () => {
    const exhibitRef = collection(db, "accounts", userId, "exhibit");
    await addDoc(exhibitRef, newExhibitArtwork);
    setNewExhibitArtwork({
      name: "",
      photo: "",
      description: "",
      tags: [],
      price: "",
      stock: "",
    });
    setOpenExhibitDialog(false);
    // Fetch exhibit artworks again
    const exhibitSnapshot = await getDocs(exhibitRef);
    const exhibitList = exhibitSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setExhibitArtworks(exhibitList);
  };

  const handleTagChange = (tag) => {
    setNewExhibitArtwork((prevState) => {
      const tags = prevState.tags.includes(tag)
        ? prevState.tags.filter((t) => t !== tag)
        : [...prevState.tags, tag];
      return { ...prevState, tags };
    });
  };

  const availableTags = [
    "Painting",
    "Oil Pastel",
    "Digital",
    "Sculpture",
    "Photography",
  ];

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Corrected property name
          width: "80vw",
          height: "auto",
          margin: "0 auto",
          //backgroundColor: "red",
          overflow: "hidden", // Ensure inner boxes are contained
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "40vh",
            padding: "1%",
            margin: "0 auto",
            //backgroundColor: "green",
          }}
        >
          {userData.coverPhoto && (
            <img
              src={userData.coverPhoto}
              alt="Cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "20vh",
            padding: "1%",
            margin: "0 auto",
            //backgroundColor: "pink",
          }}
        >
          <Box
            sx={{
              width: "12%",
              height: "100%",
              //backgroundColor: "aqua",
            }}
          >
            <Avatar
              src={userData.profilePhoto}
              alt={userData.fullName}
              sx={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Box
            sx={{
              width: "73%",
              height: "100%",
              paddingLeft: "2%",
              paddingTop: "3%",
              direction: "column",
              //backgroundColor: "yellow",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Inknut Antiqua",
                fontSize: "145%",
                fontWeight: "600",
              }}
            >
              {userData.fullName}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Montserrat",
                fontSize: "115%",
                fontWeight: "400",
              }}
            >
              @{userData.username}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Montserrat",
                fontSize: "100%",
                fontWeight: "400",
                padding: "1%",
              }}
            >
              {userData.followers} Followers
            </Typography>{" "}
          </Box>
          <Box
            sx={{
              width: "15%",
              height: "100%",
              //backgroundColor: "violet",
            }}
          >
            <Button
              onClick={handleEditProfile}
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
            >
              Edit Profile
            </Button>
          </Box>
        </Box>

        {/* <Box
          sx={{
            width: "80vw",
            height: "40vh",
            margin: "0 auto",
            // backgroundColor: "pink",
          }}
        >
          {userData.coverPhoto && (
            <img
              src={userData.coverPhoto}
              alt="Cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          )}
        </Box>
        <Box>
          <Box
            sx={{
              width: "80vw",
              height: "25vh",
              margin: "0 auto",
              padding: "1%",
              backgroundColor: "pink",
            }}
          >
            <Avatar
              src={userData.profilePhoto}
              alt={userData.fullName}
              sx={{ width: "20%", height: "auto" }}
            />
          </Box>
          <Box
            sx={{
              width: "80vw",
              height: "25vh",
              margin: "0 auto",
              padding: "1%",
              backgroundColor: "lightBlue",
            }}
          >
            <Typography variant="h5">{userData.fullName}</Typography>
            <Typography variant="body1">@{userData.username}</Typography>
            <Typography variant="body2">{userData.description}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditProfile}
            sx={{ marginTop: 2 }}
          >
            Edit Profile
          </Button>
        </Box> */}
      </Box>

      <Box
        sx={{
          // display: "flex",
          // flexDirection: "column", // Corrected property name
          width: "80vw",
          height: "auto",
          margin: "0 auto",
          paddingTop: "2%",
          //backgroundColor: "pink",
          //overflow: "hidden", // Ensure inner boxes are contained
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          start
          sx={{
            fontFamily: "Inknut Antiqua",
            fontWeight: "600",
          }}
        >
          <Tab
            label="About"
            sx={{
              fontFamily: "Inknut Antiqua",
              fontWeight: "600",
              fontSize: "110%",
              textTransform: "none",
              color: "black",
            }}
          />
          <Tab
            label="Collection"
            sx={{
              fontFamily: "Inknut Antiqua",
              fontWeight: "600",
              fontSize: "110%",
              textTransform: "none",
              color: "black",
            }}
          />
          <Tab
            label="Exhibit"
            sx={{
              fontFamily: "Inknut Antiqua",
              fontWeight: "600",
              fontSize: "110%",
              textTransform: "none",
              color: "black",
            }}
          />
        </Tabs>

        {tabIndex === 0 && (
          <Box p={2}>
            <Typography variant="h6">About</Typography>
            <Typography>{userData.description}</Typography>

            <Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                sx={{ marginTop: 2 }}
              >
                Logout
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAccount}
                sx={{ marginTop: 2 }}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box p={2}>
            <Typography variant="h6">Collection</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCollectionDialog(true)}
            >
              Add Collection
            </Button>
            <Box mt={2}>
              {collections.map((collection) => (
                <Box
                  key={collection.id}
                  p={2}
                  border={1}
                  borderColor="grey.400"
                  mb={2}
                >
                  <img
                    src={collection.coverPhoto}
                    alt={collection.name}
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <Typography variant="h6">{collection.name}</Typography>
                  <Typography>{collection.description}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteCollection(collection.id)}
                  >
                    Delete Collection
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      openArtworkDialogForCollection(collection.id)
                    }
                  >
                    Add Artwork
                  </Button>
                  {/* Render artworks for this collection */}
                  <Box mt={2}>
                    {collection.artworks &&
                      collection.artworks.map((artwork) => (
                        <Box
                          key={artwork.id}
                          p={2}
                          border={1}
                          borderColor="grey.400"
                          mb={2}
                        >
                          <img
                            src={artwork.coverPhoto}
                            alt={artwork.name}
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              objectFit: "cover",
                            }}
                          />
                          <Typography variant="h6">{artwork.name}</Typography>
                          <Typography>{artwork.description}</Typography>
                          {/* Add more artwork details here */}
                        </Box>
                      ))}
                  </Box>
                  {/* Add event handler for collection click */}
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCollectionClick(collection.id)}
                    >
                      View Artworks
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box p={2}>
            <Typography variant="h6">Exhibit</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenExhibitDialog(true)}
            >
              Add Artwork to Exhibit
            </Button>
            <Box mt={2}>
              {exhibitArtworks.map((artwork) => (
                <Box
                  key={artwork.id}
                  p={2}
                  border={1}
                  borderColor="grey.400"
                  mb={2}
                >
                  <img
                    src={artwork.coverPhoto}
                    alt={artwork.name}
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <Typography variant="h6">{artwork.name}</Typography>
                  <Typography>{artwork.description}</Typography>
                  <Typography>Tags: {artwork.tags.join(", ")}</Typography>
                  <Typography>Price: ${artwork.price}</Typography>
                  <Typography>Stock: {artwork.stock}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handleDeleteArtwork(selectedCollectionId, artwork.id)
                    }
                  >
                    Delete Artwork
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={openCollectionDialog}
        onClose={() => setOpenCollectionDialog(false)}
      >
        <DialogTitle>Add Collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={newCollectionData.name}
            onChange={(e) =>
              setNewCollectionData({
                ...newCollectionData,
                name: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newCollectionData.description}
            onChange={(e) =>
              setNewCollectionData({
                ...newCollectionData,
                description: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Cover Photo"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={handleCoverPhotoChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCollectionDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCollection}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openArtworkDialog}
        onClose={() => setOpenArtworkDialog(false)}
      >
        <DialogTitle>Add Artwork</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Artwork Name"
            type="text"
            fullWidth
            value={newArtworkData.name}
            onChange={(e) =>
              setNewArtworkData({ ...newArtworkData, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newArtworkData.description}
            onChange={(e) =>
              setNewArtworkData({
                ...newArtworkData,
                description: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Cover Photo"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={handleCoverPhotoChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenArtworkDialog(false)}>Cancel</Button>
          <Button onClick={handleAddArtwork}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding exhibit artwork */}
      <Dialog
        open={openExhibitDialog}
        onClose={() => setOpenExhibitDialog(false)}
      >
        <DialogTitle>Add Artwork to Exhibit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Artwork Name"
            type="text"
            fullWidth
            value={newExhibitArtwork.name}
            onChange={(e) =>
              setNewExhibitArtwork({
                ...newExhibitArtwork,
                name: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Cover Photo"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={handleCoverPhotoChange}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={newExhibitArtwork.description}
            onChange={(e) =>
              setNewExhibitArtwork({
                ...newExhibitArtwork,
                description: e.target.value,
              })
            }
          />
          <Typography>Tags</Typography>
          {availableTags.map((tag) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  checked={newExhibitArtwork.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                  name={tag}
                />
              }
              label={tag}
            />
          ))}
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newExhibitArtwork.price}
            onChange={(e) =>
              setNewExhibitArtwork({
                ...newExhibitArtwork,
                price: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Stock"
            type="number"
            fullWidth
            value={newExhibitArtwork.stock}
            onChange={(e) =>
              setNewExhibitArtwork({
                ...newExhibitArtwork,
                stock: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenExhibitDialog(false)}>Cancel</Button>
          <Button onClick={handleAddExhibitArtwork}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing profile */}
      <Dialog
        open={openEditProfileDialog}
        onClose={() => setOpenEditProfileDialog(false)}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={editedUserData.fullName}
            onChange={(e) =>
              setEditedUserData({ ...editedUserData, fullName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={editedUserData.username}
            onChange={(e) =>
              setEditedUserData({ ...editedUserData, username: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={editedUserData.description}
            onChange={(e) =>
              setEditedUserData({
                ...editedUserData,
                description: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Profile Photo"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={handleProfilePhotoChange}
          />
          <TextField
            margin="dense"
            label="Cover Photo"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={handleCoverPhotoChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfileDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfileChanges}>Save</Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </div>
  );
};

export default UserProfile;
