import React, { useState, useEffect } from "react";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { db, storage } from "../../../FirebaseConfig";
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
  Container,
  Typography,
  Grid,
  Paper,
  styled,
  Stack,
  Pagination,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";

const filterByTag = (artwork, selectedTag) => {
  if (!selectedTag) return true;
  return artwork.tags && artwork.tags.includes(selectedTag);
};

const sortArtworks = (artworks, sortOption) => {
  return [...artworks].sort((a, b) => {
    if (
      !a ||
      !b ||
      !a.name ||
      !b.name ||
      !a.artist ||
      !b.artist ||
      !a.dateAdded ||
      !b.dateAdded
    ) {
      return 0;
    }

    switch (sortOption) {
      case "name":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
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
};

const Explore: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [artworks, setArtworks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(30);
  const [sortOption, setSortOption] = useState<string>("date-desc");
  const [displayedArtworks, setDisplayedArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);

      const accountsSnapshot = await getDocs(collection(db, "accounts"));
      const allArtworks = [];

      for (const accountDoc of accountsSnapshot.docs) {
        const accountId = accountDoc.id;
        const collectionsSnapshot = await getDocs(
          collection(db, `accounts/${accountId}/collections`)
        );

        for (const collectionDoc of collectionsSnapshot.docs) {
          const collectionId = collectionDoc.id;
          const artworksSnapshot = await getDocs(
            collection(
              db,
              `accounts/${accountId}/collections/${collectionId}/artworks`
            )
          );

          const artworksData = artworksSnapshot.docs.map((artworkDoc) => {
            const artworkData = artworkDoc.data();
            return {
              id: artworkDoc.id,
              ...artworkData,
              owner: accountDoc.data().username, // Assuming username is stored in the account document
            };
          });

          allArtworks.push(...artworksData);
        }
      }

      setArtworks(allArtworks);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching artworks:", error);
    }
  };

  const filterBySearch = (artwork) => {
    if (!searchInput) return true;
    return artwork.name.toLowerCase().includes(searchInput.toLowerCase());
  };

  const paginateArtworks = (artworks) => {
    const indexOfLastArtwork = currentPage * artworksPerPage;
    const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
    return artworks.slice(indexOfFirstArtwork, indexOfLastArtwork);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filteredArtworks = artworks.filter(
      (artwork) => filterByTag(artwork, selectedTag) && filterBySearch(artwork)
    );
    const sortedFilteredArtworks = sortArtworks(filteredArtworks, sortOption);
    const paginatedArtworks = paginateArtworks(sortedFilteredArtworks);
    setDisplayedArtworks(paginatedArtworks);
  }, [artworks, currentPage, selectedTag, searchInput, sortOption]);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedSubtitle, setSelectedSubtitle] = useState("");

  const handleClickOpen = (artwork) => {
    setSelectedImage(artwork.coverPhoto);
    setSelectedTitle(artwork.name);
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

      {loading ? (
        <Box
          sx={{
            margin: "auto 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3%",
          }}
          className="loading-animation"
        >
          Loading...
        </Box>
      ) : (
        <div>
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
              <button onClick={() => setSelectedTag("Painting")}>
                Painting
              </button>
              <button onClick={() => setSelectedTag("Photograph")}>
                Photograph
              </button>
              <button onClick={() => setSelectedTag("Crafts")}>Crafts</button>
              <button onClick={() => setSelectedTag("Scripture")}>
                Scripture
              </button>
              <button onClick={() => setSelectedTag("Oil canvas")}>
                Oil Canvas
              </button>
              <button onClick={() => setSelectedTag("Digital")}>Digital</button>
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
              {/* <InputLabel id="sort-label">Sort By</InputLabel> */}
              <Select
                labelId="sort-label"
                value={sortOption}
                sx={{ fontFamily: "Montserrat", fontWeight: "500" }}
                onChange={(e) => setSortOption(e.target.value as string)}
              >
                <MenuItem className="menu-item" value="name">
                  Name (A-Z)
                </MenuItem>
                <MenuItem className="menu-item" value="name-desc">
                  Name (Z-A)
                </MenuItem>
                <MenuItem className="menu-item" value="artist">
                  Artist (A-Z)
                </MenuItem>
                <MenuItem className="menu-item" value="artist-desc">
                  Artist (Z-A)
                </MenuItem>
                <MenuItem className="menu-item" value="date">
                  Oldest Date
                </MenuItem>
                <MenuItem className="menu-item" value="date-desc">
                  Newest Date
                </MenuItem>
                <MenuItem className="menu-item" value="price">
                  Price (Low to High)
                </MenuItem>
                <MenuItem className="menu-item" value="price-desc">
                  Price (High to Low)
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box m="0 auto" sx={{ width: "80vw", height: "auto" }}>
            <ImageList variant="masonry" cols={4} gap={25}>
              {displayedArtworks.map((artwork, index) => (
                <ImageListItem
                  key={index}
                  onClick={() => handleClickOpen(artwork)}
                >
                  <img
                    src={artwork.coverPhoto}
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
                    title={artwork.name}
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
                      sample description of the artwork on the left. etc. etc.
                      etc.
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
                        <Item>{selectedSubtitle}</Item>
                      </Grid>
                      <Grid item xs>
                        <Item>{selectedSubtitle}</Item>
                      </Grid>
                      <Grid item xs>
                        <Item>{selectedSubtitle}</Item>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions></DialogActions>
            </Dialog>

            <Box
              className="pagination-container"
              sx={{
                margin: "auto 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "3%",
              }}
            >
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(displayedArtworks.length / artworksPerPage)}
                  variant="outlined"
                  onChange={handlePageChange}
                />
              </Stack>
            </Box>
          </Box>

          {/* <div style={{ marginBottom: "200px" }} className="artworks-container">
            {displayedArtworks.map((artwork, index) => (
              <div key={index} className="artwork">
                <div className="artwork-container">
                  <img src={artwork.coverPhoto} alt={artwork.type} />
                  <div className="artwork-details">
                    <p className="title">
                      {artwork.name} by: {artwork.artist}
                    </p>
                    <p className="owner">Owner: {artwork.owner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          <Footer />
        </div>
      )}
    </div>
  );
};

export default Explore;
