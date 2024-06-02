// Import necessary modules
import React, { useState, useEffect } from "react";
import { getDocs, collection, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../../FirebaseConfig"; // Import your Firestore instance
import "./shopStyle.css";
import Header from "../../Header";
import Footer from "../../Footer";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { MenuItem, Select, FormControl, InputLabel, Link } from "@mui/material";

// Define a function to filter artworks based on selected tag
const filterByTag = (artwork, selectedTag) => {
  if (!selectedTag) return true; // If no tag is selected, return true to include all artworks
  return artwork.tags && artwork.tags.includes(selectedTag); // Check if artwork has the selected tag
};

const sortArtworks = (artworks, sortOption) => {
  return [...artworks].sort((a, b) => {
    // Check if 'a' and 'b' have the necessary properties
    if (!a || !b || !a.name || !b.name || !a.artist || !b.artist || !a.dateAdded || !b.dateAdded) {
      return 0; // Return 0 if any of the properties are missing
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
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case "date-desc":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case "price":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });
};


const Shop: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // State for search input
  const [artworks, setArtworks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(30); // Set the number of artworks per page
  const [sortOption, setSortOption] = useState<string>("date-desc"); // State for sorting option, default to newest
  const [displayedArtworks, setDisplayedArtworks] = useState<any[]>([]);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const artworksCollection = collection(db, "accounts");
      const querySnapshot = await getDocs(artworksCollection);
      const users = querySnapshot.docs.map((doc) => doc.id); // Get IDs of all users

      const allArtworks = [];

      for (const user of users) {
        // Query each user's exhibit path
        const userExhibitCollection = collection(db, `accounts/${user}/exhibit`);
        const userExhibitSnapshot = await getDocs(userExhibitCollection);
        const userArtworks = userExhibitSnapshot.docs.map(async (doc) => {
          const userData = await getDoc(doc.ref.parent.parent);
          return {
            id: doc.id,
            ...doc.data(),
            artist: userData.data().username, // Fetch username from user data
          };
        });
        allArtworks.push(...(await Promise.all(userArtworks)));
      }

      setArtworks(allArtworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  // Define a function to filter artworks based on search input
  const filterBySearch = (artwork) => {
    if (!searchInput) return true; // If no search input, return true to include all artworks
    return artwork.name.toLowerCase().includes(searchInput.toLowerCase()); // Check if artwork name matches search input
  };

  // Define a function to paginate artworks
  const paginateArtworks = (artworks) => {
    const indexOfLastArtwork = currentPage * artworksPerPage;
    const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
    return artworks.slice(indexOfFirstArtwork, indexOfLastArtwork);
  };

  // Define a function to handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const filteredArtworks = artworks.filter((artwork) => filterByTag(artwork, selectedTag) && filterBySearch(artwork));
    const sortedFilteredArtworks = sortArtworks(filteredArtworks, sortOption);
    const paginatedArtworks = paginateArtworks(sortedFilteredArtworks);
    setDisplayedArtworks(paginatedArtworks);
  }, [artworks, currentPage, selectedTag, searchInput, sortOption]);

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

      <div className="filter-tags">
        <button onClick={() => setSelectedTag(null)}>All</button>
        <button onClick={() => setSelectedTag("Painting")}>Painting</button>
        <button onClick={() => setSelectedTag("Photograph")}>Photograph</button>
        <button onClick={() => setSelectedTag("Crafts")}>Crafts</button>
        <button onClick={() => setSelectedTag("Scripture")}>Scripture</button>
        <button onClick={() => setSelectedTag("Oil canvas")}>Oil Canvas</button>
        <button onClick={() => setSelectedTag("Digital")}>Digital</button>
      </div>

      <div style={{ marginBottom: "200px" }} className="artworks-container">
        {displayedArtworks.map((artwork, index) => (
          <div key={index} className="artwork">
            <div className="artwork-container">
                <img src={artwork.coverPhoto} alt={artwork.type} />
              <div className="artwork-details">
                <p className="title">
                  {artwork.name}, {artwork.artist}
                </p>
                <p className="price">{artwork.price}</p>
                <p className="category">{artwork.tags}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-container">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(displayedArtworks.length / artworksPerPage)}
            variant="outlined"
            onChange={handlePageChange}
          />
        </Stack>
      </div>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as string)}
        >
          <MenuItem value="name">Name (A-Z)</MenuItem>
          <MenuItem value="name-desc">Name (Z-A)</MenuItem>
          <MenuItem value="artist">Artist (A-Z)</MenuItem>
          <MenuItem value="artist-desc">Artist (Z-A)</MenuItem>
          <MenuItem value="date">Oldest Date</MenuItem>
          <MenuItem value="date-desc">Newest Date</MenuItem>
          <MenuItem value="price">Price (Low to High)</MenuItem>
          <MenuItem value="price-desc">Price (High to Low)</MenuItem>
        </Select>
      </FormControl>

      <Footer />
    </div>
  );
};

export default Shop;
