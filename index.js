// hero-banner slider
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slick-dots li");

  // Set the initial dot color
  dots[0].style.backgroundColor = "white";
  dots[0].style.width = "40px";

  // Add click event listeners to slide buttons
  const slideButtons = document.querySelectorAll(".slide-btns button");
  slideButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Find the index of the current active slide
      let currentIndex;
      slides.forEach(function (slide, index) {
        if (slide.classList.contains("active")) {
          currentIndex = index;
        }
      });

      // Update dot colors based on the current active slide index
      dots.forEach(function (dot, index) {
        if (index === currentIndex) {
          dot.style.backgroundColor = "white"; // Change color of current dot
          dot.style.width = "40px";
        } else {
          dot.style.backgroundColor = "gray"; // Reset color of other dots
          dot.style.width = "";
        }
      });
    });
  });
});



let next_btn = document.querySelector(".next-button");
let previous_btn = document.querySelector(".prev-btn");
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;

const next_Slide = () => {
  slides[currentSlide].classList.remove("active");
  currentSlide = [currentSlide + 1] % slides.length;
  slides[currentSlide].classList.add("active");

  if (currentSlide >= 0) {
    previous_btn.style.opacity = "1";
    previous_btn.style.cursor = "pointer";
    previous_btn.addEventListener("click", previous);
  }
};

const previous_Slide = () => {
  slides[currentSlide].classList.remove("active");
  currentSlide = [currentSlide - 1 + slides.length] % slides.length;
  slides[currentSlide].classList.add("active");

  if (currentSlide === slides.length - 2) {
    next_btn.style.opacity = "1";
    next_btn.style.cursor = "pointer";
    next_btn.addEventListener("click", next);
  }
};

const next = () => {
  console.log("Next button Clicked");
  next_Slide();
};

const previous = () => {
  console.log("Previous button Clicked");
  previous_Slide();
};

next_btn.addEventListener("click", next);
previous_btn.addEventListener("click", previous);

// fetch data
const API_KEY = "f3fbd38c0c00cefd4bd7ffeb48aa7a17";
const API_URL = "https://api.themoviedb.org/3/movie/";
const TV_API_URL = "https://api.themoviedb.org/3/tv/";

const backdrops = document.querySelectorAll(".slide img");
const upcomingCards = document.querySelectorAll(".upcoming img");
const trendingCards = document.querySelectorAll(".trending img");
const latestMovieCards = document.querySelectorAll(".latest img");
const topratedMoviesCards = document.querySelectorAll(".toprated img");

const upcomingURL = `${API_URL}upcoming?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
const popularURL = `${API_URL}popular?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
const latestURL = `${API_URL}now_playing?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
const topratedURL = `${API_URL}top_rated?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
const tvURL = `${TV_API_URL}top_rated?language=en-US&page=1&region=IN&api_key=${API_KEY}`;

//upcoming movies data

fetch(upcomingURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((upcomingData) => {
    // Handle upcoming data
    const upcomingMovies = upcomingData.results;

    upcomingMovies.forEach((movie, index) => {
      if (movie && movie.poster_path) {
        const imageURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        upcomingCards[index].src = imageURL;
      } else {
        // Hide the card if the image URL is null or undefined
        upcomingCards[index].style.display = "none";
      }
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

//slider movies data

fetch(popularURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((popularData) => {
    // Handle popular data
    const popularMovies = popularData.results;

    popularMovies.forEach((movie, index) => {
      // Check if the movie data is available and if the slide index exists
      if (movie && movie.backdrop_path && movie.overview && backdrops[index]) {
        const backdropURL = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
        backdrops[index].src = backdropURL;

        // Select the correct overview element for this slide
        //title
        const titleElement = document.querySelectorAll(".title")[index];
        titleElement.textContent = movie.original_title;
        //overview
        const overviewElement = document.querySelectorAll(".overview")[index];
        const overviewWords = movie.overview.split(" "); // Split overview into an array of words
        const desiredWords = overviewWords.slice(0, 20); // Get the first 10 words (adjust as needed)
        const desiredOverview = desiredWords.join(" "); // Join the words back into a string
        const truncatedOverview =
          overviewWords.length > 10 ? desiredOverview + "..." : desiredOverview;

        overviewElement.textContent = truncatedOverview;
        //language
        const languageElement = document.querySelectorAll(".language")[index];
        languageElement.textContent = `Language - ${movie.original_language}`;
        //popularity
        const popularityElement =
          document.querySelectorAll(".popularity")[index];
        popularityElement.textContent = `Popularity - ${movie.popularity}`;
        //release date
        const releaseDate = document.querySelectorAll(".release-date")[index];
        releaseDate.textContent = `Release Date - ${movie.release_date}`;
      } else {
        // Hide the slide if the image URL is null or undefined
        if (backdrops[index]) {
          backdrops[index].style.display = "none";
        }
      }
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

//latest movies data

fetch(latestURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((latestMoviesData) => {
    // Handle upcoming data
    const latestMovies = latestMoviesData.results;

    latestMovieCards.forEach((card, index) => {
      if (latestMovies[index]) {
        const imageURL = `https://image.tmdb.org/t/p/w500${latestMovies[index].poster_path}`;
        card.src = imageURL;
      }
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

//tv series data

fetch(tvURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((tvData) => {
    // Handle trending data
    const tvSeries = tvData.results;

    trendingCards.forEach((card, index) => {
      if (tvSeries[index]) {
        const imageURL = `https://image.tmdb.org/t/p/w500${tvSeries[index].poster_path}`;
        card.src = imageURL;
      }
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

fetch(topratedURL)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((topratedData) => {
    // Handle trending data
    const topratedMovies = topratedData.results;

    topratedMoviesCards.forEach((card, index) => {
      if (topratedMovies[index]) {
        const imageURL = `https://image.tmdb.org/t/p/w500${topratedMovies[index].poster_path}`;
        card.src = imageURL;
      }
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

document.addEventListener("DOMContentLoaded", function () {
  const contents = document.querySelectorAll(".content");
  const nextBtns = document.querySelectorAll(".card-next-btn");

  contents.forEach(function (content) {
    const cardsContainer = content;
    const cards = content.querySelectorAll(".card");
    const nextBtn = content.querySelector(".card-next-btn");

    content.addEventListener("mouseenter", function () {
      nextBtn.style.display = "block";
    });

    content.addEventListener("mouseleave", function () {
      nextBtn.style.display = "none";
    });

    nextBtn.addEventListener("click", function () {
      const lastCard = cards[cards.length - 1];
      const containerWidth = cardsContainer.offsetWidth;
      const lastCardWidth = lastCard.offsetWidth;
      const cardsTotalWidth = lastCard.offsetLeft + lastCardWidth;
      const scrollDistance = cardsTotalWidth - containerWidth;

      cardsContainer.scrollTo({
        left: scrollDistance,
        behavior: "smooth",
      });
      console.log("Scroll Distance:", scrollDistance);

      // Hide the next button after scrolling
      nextBtn.style.display = "none";
    });
  });
});


