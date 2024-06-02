import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../FirebaseConfig"; // Import your Firestore instance
import "./shopStyle.css";
import Header from "../../Header";
import Footer from "../../Footer";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const Shop: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // State for search input
  const [artworks, setArtworks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [artworksPerPage] = useState(30); // Set the number of artworks per page
  const [sortOption, setSortOption] = useState<string>("date-desc"); // State for sorting option, default to newest

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const artworksCollection = collection(db, "exhibit");
      const querySnapshot = await getDocs(artworksCollection);
      const artworksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArtworks(artworksData);
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

  // Logic for pagination
  const indexOfLastArtwork = currentPage * artworksPerPage;
  const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
  const currentArtworks = filteredArtworks.slice(
    indexOfFirstArtwork,
    indexOfLastArtwork
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

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
        <button onClick={() => setSelectedTag("painting")}>Painting</button>
        <button onClick={() => setSelectedTag("photograph")}>Photograph</button>
        <button onClick={() => setSelectedTag("crafts")}>Crafts</button>
        <button onClick={() => setSelectedTag("scripture")}>Scripture</button>
        <button onClick={() => setSelectedTag("oil canvas")}>Oil Canvas</button>
      </div>

      <div style={{ marginBottom: "200px" }} className="artworks-container">
        {currentArtworks.map((artwork, index) => (
          <div key={index} className="artwork">
            <div className="artwork-container">
              <img src={artwork.imageUrl} alt={artwork.type} />
              <div className="artwork-details">
                <p className="title">
                  {artwork.title}, {artwork.artist}
                </p>
                <p className="price">{artwork.price}</p>
                <p className="category">{artwork.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-container">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredArtworks.length / artworksPerPage)}
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
