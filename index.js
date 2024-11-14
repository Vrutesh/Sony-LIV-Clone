// fetch data
const API_KEY = "f3fbd38c0c00cefd4bd7ffeb48aa7a17";
const API_URL = "https://api.themoviedb.org/3/movie/";

// Main Containers
const upcomingContainer = document.querySelector(".upcoming-content");
const latestContainer = document.querySelector(".latest-content");
const nowPlayingContainer = document.querySelector(".nowplaying-content");

// Carousel
const slide = document.querySelector(".slide");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

// Default API URL
const customeUrl = (type) => {
  const defaultUrl = `${API_URL}${type}?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
  return defaultUrl;
};

// Default image URL
const imageURL = (url) => `https://image.tmdb.org/t/p/original${url}`;

// fetch data
const fetchCardData = (url, container) => {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("There is some error");
      }
      return response.json();
    })
    .then((data) => {
      const fragment = document.createDocumentFragment();
      for (const movie of data.results) {
        if (!movie.backdrop_path) continue;

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = imageURL(movie.backdrop_path);
        img.alt = "Movie Poster";
        img.loading = "lazy";

        card.appendChild(img);
        fragment.appendChild(card);
      }

      container.appendChild(fragment);
    })
    .catch((error) => {
      console.log("There is an error in fetching data:", error);
    });
};

// Fetch movies for different categories
fetchCardData(customeUrl("upcoming"), upcomingContainer);
fetchCardData(customeUrl("popular"), latestContainer);
fetchCardData(customeUrl("now_playing"), nowPlayingContainer);

// fetching carousel data

const carousel = document.querySelector(".carousel");

const fetchCarousel = (url) => {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("There is some error");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.results) {
        return;
      }
      const imageArray = data.results.filter((movie) => movie.backdrop_path);

      const fragment = document.createDocumentFragment();
      const createCarouselImage = (images) => {
        images.forEach((movie, index) => {
          const slides = document.createElement("div");
          slides.classList.add("slide");
          

          if (index === 0) {
            slides.classList.add("active");
          }

          const img = document.createElement("img");
          img.src = imageURL(movie.backdrop_path);
          img.classList.add("carousel-img");
          img.alt = "Movie Poster";
          img.loading = "lazy";

          slides.appendChild(img);
          fragment.appendChild(slides);
        });
      };
      createCarouselImage(imageArray);
      carousel.appendChild(fragment);
    })
    .catch((error) => {
      console.log("There is an error in fetching data:", error);
    });
};

fetchCarousel(customeUrl("upcoming"));

// Carousel Logic
let currentIndex = 0;

function showNextImage() {
  const slides = document.querySelectorAll(".slide"); 
  slides[currentIndex].classList.remove("active");


  if(currentIndex < slides.length -1){
    currentIndex++
  }
  if(currentIndex > slides.length -1){
    currentIndex--
  }

  slides[currentIndex].classList.add("active");

}

function showPrevImage() {
  const slides = document.querySelectorAll(".slide");
  slides[currentIndex].classList.remove("active");

  // Decrement index for the previous button, but don't go below the first slide
  if (currentIndex > 0) {
    currentIndex--;
  }

  slides[currentIndex].classList.add("active");
}

if (nextBtn) {
  nextBtn.addEventListener('click', showNextImage);
}


if (prevBtn) {
  prevBtn.addEventListener('click', showPrevImage);
}

// Set an interval to cycle through images every 3 seconds
// setInterval(showNextImage, 3000);