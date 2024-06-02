import React, { useState, useEffect } from "react";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../../FirebaseConfig";
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

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const imageRef = ref(storage, "img");
      const images = await listAll(imageRef);
      const urls = await Promise.all(
        images.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const types = [
            "painting",
            "photograph",
            "crafts",
            "scripture",
            "oil canvas",
          ];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const title = `${randomType
            .charAt(0)
            .toUpperCase()}${randomType.slice(1)}`; // Capitalize the type for title
          const artistNames = [
            "John Doe",
            "Jane Doe",
            "Alice Smith",
            "Bob Johnson",
          ]; // Sample artist names
          const randomArtist =
            artistNames[Math.floor(Math.random() * artistNames.length)];
          const price = Math.floor(Math.random() * 100) + 50; // Generate a random price
          const dateAdded = new Date().toISOString(); // Use current date as added date
          return {
            imageUrl: url,
            type: randomType,
            title,
            artist: randomArtist,
            price,
            dateAdded,
          };
        })
      );
      setArtworks(urls);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  const filteredArtworks = artworks.filter((artwork) => {
    // Filter by selected tag
    if (selectedTag && artwork.type !== selectedTag) return false;
    // Filter by search input
    if (
      searchInput &&
      !artwork.type.toLowerCase().includes(searchInput.toLowerCase())
    )
      return false;
    return true;
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortOption) {
      case "name":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "artist-desc":
        return b.artist.localeCompare(a.artist);
      case "date":
        return (
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      case "date-desc":
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      case "price":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedSubtitle, setSelectedSubtitle] = useState("");

  const handleClickOpen = (artwork: {
    imageUrl: React.SetStateAction<null>;
    title: React.SetStateAction<string>;
    artist: any;
  }) => {
    setSelectedImage(artwork.imageUrl);
    setSelectedTitle(artwork.title);
    setSelectedSubtitle(`by ${artwork.artist}`);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: "1%",
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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
        justifyContent={"space-between"}
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
          {/* <InputLabel
            id="sort-label"
            sx={{ fontFamily: "Montserrat", fontWeight: "400" }}
          >
           Sort By 
          </InputLabel> */}

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
            sx={{
              fontFamily: "Inknut Antiqua",
              fontWeight: "500",
              fontSize: "100%",
              justifyContent: "flex-start",
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
            <Box sx={{ width: "40%", height: "100%" }}>
              <img
                src={selectedImage}
                alt={selectedTitle}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
            <Box
              sx={{
                width: "60%",
                height: "100%",
                padding: "2%",
                alignment: "flex-start",
                justifyContent: "flex-start",
                direction: "column",
                //backgroundColor: "lightblue",
              }}
            >
              <Box
                id="artist-box"
                sx={{
                  width: "100%",
                  height: "40%", //40-50-10
                  padding: "1%",
                  direction: "row",
                  justifyContent: "flex-start",
                  alignment: "center",
                  //backgroundColor: "pink",
                }}
              >
                <Box sx={{ width: "20%", height: "100%" }}>
                  <img
                    src="src/assets/avatar1.png"
                    alt={selectedSubtitle}
                    style={{
                      borderRadius: "100%",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    width: "60%",
                    height: "100%",
                    //backgroundColor: "yellow",
                  }}
                >
                  <Typography style={{ display: "flex-start" }}>
                    {selectedSubtitle}
                  </Typography>
                </Box>
              </Box>
              <Box
                id="desc-box"
                sx={{
                  width: "auto",
                  height: "50%",
                  padding: "1%",
                }}
              >
                <Typography>Description</Typography>
                <Typography>
                  sample description of the artwork on the left. etc. etc. etc.
                </Typography>
              </Box>
              <Box
                id="tags-box"
                sx={{
                  width: "auto",
                  height: "50%",
                  flexGrow: 1,
                }}
              >
                <Grid
                  container
                  spacing={3}
                  sx={{ justifyContent: "flex-start" }}
                >
                  <Grid item xs>
                    <Item>category</Item>
                  </Grid>
                  <Grid item xs>
                    <Item>tags</Item>
                  </Grid>
                  <Grid item xs>
                    <Item>tags</Item>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </Box>

      <Footer />
    </div>
  );
};

export default Explore;
