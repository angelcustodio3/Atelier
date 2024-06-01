import React, { useState, useEffect } from "react";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../../FirebaseConfig";
import "./ExploreStyles.css";
import Header from "../../Header";
import Footer from "../../Footer";
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Pagination,
  Stack,
} from "@mui/material";

const Explore: React.FC = () => {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState<string>(''); // State for search input
    const [artworks, setArtworks] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [artworksPerPage] = useState(30); // Set the number of artworks per page
  
    useEffect(() => {
      fetchArtworks();
    }, []);
  
    const fetchArtworks = async () => {
        try {
          const imageRef = ref(storage, 'img');
          const images = await listAll(imageRef);
          const urls = await Promise.all(images.items.map(async (item) => {
            const url = await getDownloadURL(item);
            const types = ['painting', 'photograph', 'crafts', 'scripture', 'oil canvas'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const title = `${randomType.charAt(0).toUpperCase()}${randomType.slice(1)}`; // Capitalize the type for title
            const artistNames = ['John Doe', 'Jane Doe', 'Alice Smith', 'Bob Johnson']; // Sample artist names
            const randomArtist = artistNames[Math.floor(Math.random() * artistNames.length)];
            const price = Math.floor(Math.random() * 100) + 50; // Generate a random price
            return { imageUrl: url, type: randomType, title, artist: randomArtist, price };
          }));
          setArtworks(urls);
        } catch (error) {
          console.error('Error fetching artworks:', error);
        }
      };
  
    const filteredArtworks = artworks.filter((artwork) => {
      // Filter by selected tag
      if (selectedTag && artwork.type !== selectedTag) return false;
      // Filter by search input
      if (searchInput && !artwork.type.toLowerCase().includes(searchInput.toLowerCase())) return false;
      return true;
    });

    // Get current artworks
    const indexOfLastArtwork = currentPage * artworksPerPage;
    const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
    const currentArtworks = filteredArtworks.slice(indexOfFirstArtwork, indexOfLastArtwork);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
      <div>
        <Header />

        <h2 className='text-header'>Explore and discover amazing artworks and artists!</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search artworks"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="search-button">Search</button>
        </div>
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
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

  const handleClickOpen = (artwork) => {
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
        <Box m="0 auto"  sx={{ width: "80vw", height: "auto", overflowX: "none" }}>
          <ImageList variant="masonry" cols={4} gap={15}>
            {currentArtworks.map((artwork, index) => (
              <ImageListItem key={index}>
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.type} 
                  className="artwork" 
                />
                <ImageListItemBar position="below" title={artwork.artist} />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        <Stack spacing={2} sx={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}>
          <Pagination count={Math.ceil(filteredArtworks.length / artworksPerPage)} variant="outlined" shape="rounded" onChange={(event, page) => paginate(page)} />
        </Stack>

        <Footer />
      </div>
    );
  };
 
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
            Sort By
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
          <DialogTitle>{selectedTitle}</DialogTitle>
          <DialogContent>
            <img
              src={selectedImage}
              alt={selectedTitle}
              style={{ width: "100%", height: "auto" }}
            />
            <p>{selectedSubtitle}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Footer />
    </div>
  );
};

export default Explore;
