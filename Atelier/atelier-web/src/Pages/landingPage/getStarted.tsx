import Footer from "../../Footer";
import { Box } from "@mui/material";
import "./getStarted.css";
import { Link } from "react-router-dom";

const GetStarted: React.FC = () => {
  return (
    <div>
      <Box sx={{}}>
        <Box sx={{ display: "flex" }}>
          <div className="hero-section">
            <div className="atelier-brand">
              <div className="atelier-logo">
                <img
                  src="./src/assets/atelier-logo2.png"
                  alt="Atelier Logo"
                  id="logo"
                />
              </div>
              <div style={{ height: "150px" }}></div>
              <h1 className="catch-phrase">
                Where art finds its voice. Where artists find their community.
              </h1>
              <p className="atelier-desc">
                Atelier is a vibrant community where artists of all kinds come
                together to showcase their work, find inspiration, and support
                one another. With Atelier, you can effortlessly share and sell
                your art while engaging with a diverse network of fellow
                creatives. Whether you're a painter, sculptor, photographer, or
                any other type of artist, Atelier provides the platform for you
                to shine.
              </p>
              <p className="join-us">
                Join us today and unlock a world of artistic possibilities!
              </p>
              <div style={{ height: "50px" }}></div>
              <Link id="start-link" to="/SignUp">
                <button id="get-started-button">Get Started</button>
              </Link>
            </div>
          </div>

          
            <div className="hero-image">
              <img
                src="./src/assets/atelier-room.png"
                alt="Atelier Room"
                id="hero"
              />
            </div>
          
        </Box>
      </Box>

      <Box>
        <div style={{ height: "50px", display: "flex" }}></div>
      </Box>

      <Box sx={{ display: "flex" }}>

        <div className="main-features-section">
          <div className="features-heading">
            <h1 id="howitworks-heading">How it Works</h1>
          </div>

          <div className="main-feature-box">
            <div className="main-feature-img">
              <img src="./src/assets/chat.png" alt="About Img" id="mfimg" />
            </div>
            <div className="main-feature-desc">
              <h2>Directly Interact</h2>
              <p className="atelier-desc">
                Atelier fosters a sense of community among fellow artists,
                enthusiasts, and buyers. Through its feature of direct messaging
                among users, Atelier encourages engagement, dialogue, and
                collaboration which strengthen connections and a supportive
                system for artistic growth.
              </p>
            </div>
          </div>

          <div className="main-feature-box">
            <div className="main-feature-desc2">
              <h2>Follow Fellow Artists</h2>
              <p className="atelier-desc">
                Atelier provides a place for artists to showcase their rich
                diversity and creativity. You can easily upload your artworks,
                complete with detailed descriptions, pricing information, and
                other online portfolio accounts in a visually appealing manner.
                This feature provides you with tools to effectively share and
                promote your work.
              </p>
            </div>
            <div className="main-feature-img2">
              <img src="./src/assets/follow.png" alt="About Img" id="mfimg" />
            </div>
          </div>

          <div className="main-feature-box">
            <div className="main-feature-img">
              <img src="./src/assets/post.png" alt="About Img" id="mfimg" />
            </div>
            <div className="main-feature-desc">
              <h2>Promote Your Art</h2>
              <p className="atelier-desc">
                Atelier is designed to nurture an interconnected art community.
                You can easily follow your favorite artists, stay updated on
                their latest works, exhibitions, and collections. With this
                feature, you not only show your support but can also gain
                inspiration and insight into different artistic styles and
                techniques.
              </p>
            </div>
          </div>
        </div>
      </Box>

      <Box>
        <div className="featured-arts-section">
          <div className="features-heading">
            <h1 id="artworks-heading">Featured Artworks</h1>
          </div>

          <div className="artworks-box">
            <div className="artwork-img">
              <img
                src="./src/assets/artwork1.jpg"
                alt="Featured Artwork"
                id="artwork"
              />
            </div>
            <div className="artwork-img">
              <img
                src="./src/assets/artwork2.jpg"
                alt="Featured Artwork"
                id="artwork"
              />
            </div>
          </div>
        </div>
      </Box>
      <div style={{ height: "50px", display: "flex" }}></div>

      <Box>
        <div className="featured-artists-section">
          <div className="features-heading">
            <h1>Featured Artists</h1>
          </div>

          <div className="artists-box">
            <div className="artist-profile">
              <img
                src="./src/assets/avatar1.png"
                alt="Artist Profile"
                id="artist"
              />
              <h4>Cecilia Summer</h4>
            </div>

            <div className="artist-profile">
              <img
                src="./src/assets/avatar2.png"
                alt="Artist Profile"
                id="artist"
              />
              <h4>Selene Gomez</h4>
            </div>
            <div className="artist-profile">
              <img
                src="./src/assets/avatar3.png"
                alt="Artist Profile"
                id="artist"
              />
              <h4>Kim Taehyun</h4>
            </div>
          </div>
        </div>
      </Box>
      <Footer />
    </div>
  );
};

export default GetStarted;