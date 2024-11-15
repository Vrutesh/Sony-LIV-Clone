// fetch data
const API_KEY = "f3fbd38c0c00cefd4bd7ffeb48aa7a17";
const API_URL = "https://api.themoviedb.org/3/movie/";

// Main Containers
const upcomingContainer = document.querySelector(".upcoming-content");
const latestContainer = document.querySelector(".latest-content");
const nowPlayingContainer = document.querySelector(".nowplaying-content");

// Carousel
const prevBtn = document.querySelector(".prev-btn");
prevBtn.setAttribute("aria-label", "Previous slide");
const nextBtn = document.querySelector(".next-btn");
nextBtn.setAttribute("aria-label", "Next slide");

// Default API URL
const customeUrl = (type) => {
  const defaultUrl = `${API_URL}${type}?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
  return defaultUrl;
};

// Default image URL
const imageURL = (url) => `https://image.tmdb.org/t/p/original${url}`;

// fetch data
const fetchCardData = async (url, container) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("There is some error");
    }
    const data = await response.json();
    const imageArray = data.results;

    const fragment = document.createDocumentFragment();

    for (const movie of imageArray) {
      if (!movie.backdrop_path) continue;

      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");
      img.src = imageURL(movie.backdrop_path);
      img.alt = "Movie Poster";
      img.loading = "lazy";

      const movieTitle = document.createElement("h4");
      movieTitle.classList.add("cardTitle");
      movieTitle.textContent = movie.original_title;

      card.appendChild(img);
      card.appendChild(movieTitle);
      fragment.appendChild(card);
    }

    container.appendChild(fragment);
  } catch (error) {
    console.log("There is an error in fetching data:", error);
  }
};

// Fetch movies for different categories
fetchCardData(customeUrl("upcoming"), upcomingContainer);
fetchCardData(customeUrl("popular"), latestContainer);
fetchCardData(customeUrl("now_playing"), nowPlayingContainer);

// fetching carousel data

const carousel = document.querySelector(".carousel");

const fetchCarousel = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("There is some error");
    }

    const data = await response.json();
    const carouselArray = data.results;

    if (!carouselArray || carouselArray.length === 0) return;

    const imageArray = carouselArray.filter((movie) => movie.backdrop_path);

    const fragment = document.createDocumentFragment();

    const createCarouselImage = (images) => {
      images.forEach((movie, index) => {
        const slides = document.createElement("div");
        slides.classList.add("slide");

        if (index === 0) slides.classList.add("active");

        const img = document.createElement("img");
        img.src = imageURL(movie.backdrop_path);
        img.classList.add("carousel-img");
        img.alt = "Movie-Poster";
        img.loading = "lazy";

        slides.appendChild(img);
        slides.appendChild(
          movie_Info(
            movie.title,
            movie.overview,
            movie.original_language,
            movie.popularity,
            movie.release_date
          )
        );
        fragment.appendChild(slides);
      });
    };
    createCarouselImage(imageArray);
    carousel.appendChild(fragment);
  } catch (error) {
    console.log("There is an error in fetching data:", error);
  }
};

fetchCarousel(customeUrl("upcoming"));

// carousel movie information data
const movie_Info = (title, overview, language, popularity, release) => {
  const moviefragment = document.createDocumentFragment();

  const movieDetails = document.createElement("div");
  movieDetails.classList.add("movie-details");

  const movieTitle = document.createElement("h1");
  movieTitle.classList.add("title");
  movieTitle.textContent = title;

  const movieOverview = document.createElement("h3");
  movieOverview.classList.add("overview");
  let words = overview.split(" ");
  if (words.length > 20) {
    movieOverview.textContent = words.slice(0, 20).join(" ") + "...";
  } else {
    movieOverview.textContent = words;
  }

  const movieGenre = document.createElement("div");
  movieGenre.classList.add("genre");

  // movie list
  const movielist = document.createElement("ul");

  const movie_lang = document.createElement("li");
  movie_lang.classList.add("language");

  if (language === "hi") language = "Hindi";
  else if (language === "en") language = "English";

  movie_lang.textContent = `Language - ${language}`;

  const movie_popularity = document.createElement("li");
  movie_popularity.classList.add("popularity");
  movie_popularity.textContent = `Views - ${popularity}M`;

  const movie_release = document.createElement("li");
  movie_release.classList.add("release");
  movie_release.textContent = `Release on - ${release}`;

  movielist.append(movie_lang, movie_popularity, movie_release);

  movieGenre.appendChild(movielist);

  movieDetails.append(movieTitle, movieOverview, movieGenre);

  return movieDetails;
};

// Carousel button Logic
let currentIndex = 0;

function showNextImage() {
  const slides = document.querySelectorAll(".slide");
  slides[currentIndex].classList.remove("active");

  currentIndex = (currentIndex + 1) % slides.length;

  slides[currentIndex].classList.add("active");
}

function showPrevImage() {
  const slides = document.querySelectorAll(".slide");
  slides[currentIndex].classList.remove("active");

  currentIndex = (currentIndex - 1 + slides.length) % slides.length;

  slides[currentIndex].classList.add("active");
}

if (nextBtn) {
  nextBtn.addEventListener("click", showNextImage);
}

if (prevBtn) {
  prevBtn.addEventListener("click", showPrevImage);
}

setInterval(showNextImage, 4000);
