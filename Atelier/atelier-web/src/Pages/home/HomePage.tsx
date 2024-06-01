
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../FirebaseConfig';
import { Box, Button } from '@mui/material';
import './HomePage.css';
import Header from '../../Header';
import Footer from '../../Footer';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../FirebaseConfig";
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Dialog,
  Typography,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material";
import "./HomePage.css";
import Header from "../../Header";
import Footer from "../../Footer";

const Home: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [popupDescription, setPopupDescription] = useState("");
  const [popupImageSrc, setPopupImageSrc] = useState("");
  const [popupDisplay, setPopupDisplay] = useState("none");
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const names = [
    "John Doe",
    "Alice Wane",
    "Bobby Brown",
    "Emma Rock",
    "Amane Yugi",
    "Tsukasa Yugi",
    "Yashiro Nene",
    "Amane Yugi",
    "Tsukasa Yugi",
    "Yashiro Nene",
  ];

  useEffect(() => {
    fetchIconURLs(); // Fetch icon URLs
  }, []);

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex, imageURLs]); // Include imageURLs in the dependency array

  const fetchIconURLs = async () => {
    try {
      // Fetch image URLs from Firebase Storage
      const imageRef = ref(storage, "img");
      const urls: string[] = await Promise.all(
        [
          "hero1.jpg",
          "hero2.jpg",
          "hero3.jpg",
          "hero4.jpg",
          "hero5.png",
          "hero6.jpg",
          "hero7.jpg",
          "image18.png",
          "image19.png",
          "image20.png",
          "image21.png",
          "image22.png",
          "image23.png",
          "image7.png",
          "image8.png",
          "image9.png",
          "image10.png",
          "image11.png",
          "image12.png",
          "image1.png",
          "image2.png",
          "image3.png",
          "image4.png",
          "image5.png",
          "image6.png",
          "image13.png",
          "image14.png",
          "image15.png",
          "image16.png",
          "image17.png",
          "image17.png",
          "image24.png",
          "cover1.png",
          "cover2.png",
          "cover3.png", // Add all image names here
        ].map(async (imageName) => {
          return await getDownloadURL(ref(imageRef, imageName));
        })
      );
      const shuffledImageURLs = shuffleArray(urls);
      setImageURLs(shuffledImageURLs);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
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
            {imageURLs.slice(0, 10).map((url, index) => (
              <div key={index} className="artist-wrapper">
                <Link to="/Profile">
                  <img
                    className="featured-artist"
                    src={url}
                    alt={`Featured Artist ${index + 1}`}
                  />
                </Link>
                <div className="artist-name">{names[index]}</div>
              </div>
            ))}
          </div>

          <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
          <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>

        </div>
      </Box>

      <Box style={{ marginBottom: '100px' }}>

        <p className='text-header'>Featured Artists</p>

        <div className="artists-section">

          {imageURLs.slice(0, 10).map((url, index) => (

            <div key={index} className="artist-wrapper">
              <Link to="/Profile"><img className="featured-artist" src={url} alt={`Featured Artist ${index + 1}`} /></Link>
              <div className="artist-name">{names[index]}</div>
            </div>

          ))}

        </div>

      </Box>

      <Box style={{ marginBottom: '200px' }}>

        <p className='text-header'>Explore</p>

        <div className="collage">

          {imageURLs.slice(6, 36).map((url, index) => (

            <div key={index} className="collage_pics" data-description="Whale House, John Doe">
              <img src={url} style={{ width: '100%' }} onClick={showDescription} />
            </div>
            
          ))}

        </div>

        <Box textAlign="center" mt={4}>
          <Button variant="contained" component={Link} to="/explore">
            Explore More
          </Button>
        </Box>

      </Box>

      <div id="popup-container" className="popup-container" onClick={handleClosePopup} style={{ display: popupDisplay }}>
        <div id="popup-content" className="popup-content">
          <img id="popup-image" src={popupImageSrc} alt="Clicked Image" />
          <p id="popup-description">
          <Link to="/product">{popupDescription}</Link>
          </p>
        </div>
      </div>
        </Box>

        <Box m="0 auto" sx={{ width: "80vw", height: "auto" }}>
          <p className="text-header">Explore</p>

          {/* <div className="collage">
            {imageURLs.slice(6).map((url, index) => (
              <div
                key={index}
                className="collage_pics"
                data-description="Whale House, John Doe"
              >
                <img
                  src={url}
                  style={{ width: "100%" }}
                  onClick={showDescription}
                />
              </div>
            ))}
          </div> */}

          <ImageList variant="masonry" cols={4} gap={25}>
            {imageURLs.map((url, index) => (
              <ImageListItem key={index}>
                <img
                  key={index}
                  src={url}
                  onClick={showDescription}
                  //alt={artwork.type}
                  //className="artwork"
                />

                <ImageListItemBar
                  position="below"
                  title={"Title"}
                  subtitle={`by Artist Name`}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        <Box
          className="popup-container"
          onClick={handleClosePopup}
          style={{ display: popupDisplay }}
        >
          <div className="popup-content">
            <img id="popup-image" src={popupImageSrc} alt="Clicked Image" />
            <p id="popup-description">
              <Link to="/product">{popupDescription}</Link>
            </p>
          </div>
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
