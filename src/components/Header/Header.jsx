import { useRef, useState, useEffect } from "react";
import styles from "./Header.module.css";
import { Form, Button } from "react-bootstrap";

const API = "https://api.unsplash.com/search/photos";
const images_per_page = 30;

const Header = () => {
  const searchInput = useRef(null);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Initialize with page 1

  useEffect(() => {
    searchPhotos(); // Fetch images whenever currentPage changes
  }, [currentPage]);

  const searchPhotos = async () => {
    try {
      const response = await fetch(
        `${API}?query=${
          searchInput.current.value
        }&page=${currentPage}&per_page=${images_per_page}&client_id=${
          import.meta.env.VITE_API
        }`,
        {
          headers: {
            Authorization: `y7tu2syWZJVpanMRBeVQW3ITyzZZS-76RA34-brZhms`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setImages(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchPhotos();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
  };

  return (
    <div className={styles.Header}>
      <h1>Image Search App</h1>
      <div className={styles.search}>
        <form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Search Something..."
            ref={searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div className={styles.btns}>
        <Button variant="success" onClick={() => handleSelection("nature")}>
          Nature
        </Button>{" "}
        <Button variant="success" onClick={() => handleSelection("dogs")}>
          Dogs
        </Button>{" "}
        <Button variant="success" onClick={() => handleSelection("cats")}>
          Cats
        </Button>{" "}
      </div>
      <div className={styles.imgresults}>
        {images.map((image) => (
          <img key={image.id} src={image.urls.small} />
        ))}
      </div>
      <div>
        <Button
          variant="danger"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>{" "}
        <Button
          variant="danger"
          onClick={handleNextPage}
          disabled={images.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Header;
