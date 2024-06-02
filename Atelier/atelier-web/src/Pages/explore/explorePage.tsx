import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../FirebaseConfig";
import "./ExploreStyles.css";
import Header from "../../Header";
import Footer from "../../Footer";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  styled,
} from "@mui/material";

const Explore: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // State for search input
  const [artworks, setArtworks] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<string>("date-desc"); // State for sorting option, default to newest
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedSubtitle, setSelectedSubtitle] = useState("");

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const allCollections = await db.listCollections();
      const allArtworks: any[] = [];
      for (const collectionRef of allCollections) {
        const querySnapshot = await getDocs(collection(collectionRef.path));
        querySnapshot.forEach((doc) => {
          allArtworks.push(doc.data());
        });
      }
      setArtworks(allArtworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  // Filter and sort logic remain the same...

  const handleClickOpen = (artwork: any) => {
    setSelectedImage(artwork.imageUrl);
    setSelectedTitle(artwork.title);
    setSelectedSubtitle(`by ${artwork.artist}`);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Header />

      <h2 className="text-header">
        Explore and discover amazing artworks and artists!
      </h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search artworks"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>

      <Box
        display="flex"
        m="0 auto"
        sx={{ width: "80vw", height: "auto", overflowX: "none" }}
      >
        <div className="filter-tags">
          <button onClick={() => setSelectedTag(null)}>All</button>
          <button onClick={() => setSelectedTag("painting")}>Painting</button>
          <button onClick={() => setSelectedTag("photograph")}>
            Photograph
          </button>
          <button onClick={() => setSelectedTag("crafts")}>Crafts</button>
          <button onClick={() => setSelectedTag("scripture")}>Scripture</button>
          <button onClick={() => setSelectedTag("oil canvas")}>
            Oil Canvas
          </button>
        </div>

        <FormControl
          sx={{
            m: 1,
            minWidth: 250,
            minHeight: "auto",
            fontFamily: "Montserrat",
            fontWeight: "400",
          }}
        >
          <InputLabel
            id="sort-label"
            sx={{ fontFamily: "Montserrat", fontWeight: "400" }}
          >
            {/* Sort By */}
          </InputLabel>
          <Select
            labelId="sort-label"
            value={sortOption}
            sx={{ fontFamily: "Montserrat", fontWeight: "500" }}
            onChange={(e) => setSortOption(e.target.value as string)}
          >
            <MenuItem value="name" className="menu-item">
              Name (A-Z)
            </MenuItem>
            <MenuItem value="name-desc" className="menu-item">
              Name (Z-A)
            </MenuItem>
            <MenuItem value="artist" className="menu-item">
              Artist (A-Z)
            </MenuItem>
            <MenuItem value="artist-desc" className="menu-item">
              Artist (Z-A)
            </MenuItem>
            <MenuItem value="date" className="menu-item">
              Oldest Date
            </MenuItem>
            <MenuItem value="date-desc" className="menu-item">
              Newest Date
            </MenuItem>
            <MenuItem value="price" className="menu-item">
              Price (Low to High)
            </MenuItem>
            <MenuItem value="price-desc" className="menu-item">
              Price (High to Low)
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box m="0 auto" sx={{ width: "80vw", height: "auto" }}>
        <ImageList variant="masonry" cols={4} gap={25}>
          {sortedArtworks.map((artwork, index) => (
            <ImageListItem key={index} onClick={() => handleClickOpen(artwork)}>
              <img
                src={artwork.imageUrl}
                alt={artwork.type}
                style={{ cursor: "pointer" }} // Make the image cursor pointer
              />
              <ImageListItemBar
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: "500",
                  height: "auto",
                  overflowX: "none",
                }}
                position="below"
                title={artwork.title}
                subtitle={`by ${artwork.artist}`}
              />
            </ImageListItem>
          ))}
        </ImageList>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle
            display="center"
            sx={{
              fontFamily: "Inknut Antiqua",
              fontWeight: "500",
              fontSize: "100%",
            }}
          >
            {selectedTitle}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent sx={{ display: "flex" }}>
            <Box sx={{ width: "50%", eight: "100%" }}>
              <img
                src={selectedImage}
                alt={selectedTitle}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
            <Box>desc</Box>
            <p>{selectedSubtitle}</p>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </Box>

      <Footer />
    </div>
  );
};

export default Explore;
