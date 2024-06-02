import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../FirebaseConfig";
import "./HomePage.css";
import Header from "../../Header";
import Footer from "../../Footer";
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { collection, getDocs, getDoc, getFirestore } from "firebase/firestore";

const Home: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [popupDescription, setPopupDescription] = useState("");
  const [popupImageSrc, setPopupImageSrc] = useState("");
  const [popupDisplay, setPopupDisplay] = useState("none");
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<any[]>([]);

  const db = getFirestore();
  useEffect(() => {
    fetchSlideshowArtworks();
    fetchFeaturedArtists(); // Call the function here
  }, []);

  const fetchSlideshowArtworks = async () => {
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
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };
  

  const fetchFeaturedArtists = async () => {
    try {
      // Fetch top 5 users with most followers
      const usersRef = db.collection("accounts").orderBy("followers", "desc").limit(5);
      const querySnapshot = await usersRef.get();
      const artistsData: any[] = [];
      querySnapshot.forEach((doc) => {
        artistsData.push(doc.data());
      });
      setFeaturedArtists(artistsData);
    } catch (error) {
      console.error("Error fetching featured artists:", error);
    }
  };

  const showSlides = (n: number) => {
    // Ensure that slides exist before accessing their properties
    let slides = document.getElementsByClassName(
      "mySlides"
    ) as HTMLCollectionOf<HTMLElement>;
    let dots = document.getElementsByClassName(
      "dot"
    ) as HTMLCollectionOf<HTMLElement>;
    if (slides.length === 0 || dots.length === 0) {
      // Elements not found, wait for the next render
      return;
    }

    if (n > slides.length) setSlideIndex(1);
    if (n < 1) setSlideIndex(slides.length);
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  };

  const plusSlides = (n: number) => {
    setSlideIndex((prevSlideIndex) => {
      const newIndex = prevSlideIndex + n;
      showSlides(newIndex);
      return newIndex;
    });
  };

  const currentSlide = (n: number) => {
    setSlideIndex(n);
    showSlides(n);
  };

  const showDescription = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const image = e.currentTarget;
    const description =
      image.parentElement?.getAttribute("data-description") || "";
    setPopupDescription(description);
    setPopupImageSrc(image.src);
    setPopupDisplay("block");
  };

  const handleClosePopup = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      setPopupDisplay("none");
    }
  };

  return (
    <>
      <div>
        <Header />
        <div>
          <Box style={{ marginBottom: "100px" }}>
            <div className="slideshow-container">
              {imageURLs.slice(0, 7).map((url, index) => (
                <div key={index} className="mySlides fade">
                  <img src={url} style={{ width: "100%" }} />
                </div>
              ))}

              <div className="dot-container">
                {imageURLs.slice(0, 7).map((_, index) => (
                  <span
                    key={index}
                    className="dot"
                    onClick={() => currentSlide(index + 1)}
                  ></span>
                ))}
              </div>

              <a className="prev" onClick={() => plusSlides(-1)}>
                &#10094;
              </a>
              <a className="next" onClick={() => plusSlides(1)}>
                &#10095;
              </a>
            </div>
          </Box>

          <Box style={{ marginBottom: "100px" }}>
            <p className="text-header">Featured Artists</p>

            <div className="artists-section">
              {featuredArtists.map((artist, index) => (
                <div key={index} className="artist-wrapper">
                  <Link to={`/profile/${artist.username}`}>
                    <img
                      className="featured-artist"
                      src={artist.profilePicture}
                      alt={`Featured Artist ${index + 1}`}
                    />
                  </Link>
                  <div className="artist-name">{artist.username}</div>
                </div>
              ))}
            </div>
          </Box>

          <Box m="0 auto" sx={{ width: "80vw", height: "auto" }}>
            <p className="text-header">Explore</p>

            <ImageList variant="masonry" cols={4} gap={25}>
              {imageURLs.slice(0, 20).map((url, index) => (
                <ImageListItem key={index}>
                  <img key={index} src={url} onClick={showDescription} />
                  <ImageListItemBar
                    position="below"
                    title={"Title"}
                    subtitle={`by Artist Name`}
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: "100%",
                paddingBottom: "5%",
                paddingTop: "3%",
              }}
            >
              <Link to={"/explore"} style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    margin: "0 auto",
                    fontFamily: "Montserrat",
                    fontSize: "120%",
                    fontWeight: "500",
                    textDecoration: "underline",
                  }}
                >
                  Explore more...
                </Typography>
              </Link>
            </Box>
          </Box>

          <Box
            className="popup-container"
            onClick={handleClosePopup}
            style={{ display: popupDisplay }}
          >
            <div id="popup-content"
          className="popup-content">
          <img id="popup-image" src={popupImageSrc} alt="Clicked Image" />
          <p id="popup-description">{popupDescription}</p>
        </div>
      </Box>
    </div>
  </div>
  <Footer />
</>
);
};

export default Home;
