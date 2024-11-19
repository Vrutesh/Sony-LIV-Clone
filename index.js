// fetch data
const API_KEY = "f3fbd38c0c00cefd4bd7ffeb48aa7a17";
const API_URL = "https://api.themoviedb.org/3/";

// Main Containers

const cardsSection = document.querySelector(".cards-section");
const video_container = document.querySelector(".video-container");

// Carousel
const prevBtn = document.querySelector(".prev-btn");
prevBtn.setAttribute("aria-label", "Previous slide");
const nextBtn = document.querySelector(".next-btn");
nextBtn.setAttribute("aria-label", "Next slide");

// Default API URL
const customeUrl = (category, type) => {
  const defaultUrl = `${API_URL}${category}/${type}?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
  return defaultUrl;
};

// Default image URL
const imageURL = (url) => `https://image.tmdb.org/t/p/original${url}`;

// fetch data
const fetchCardData = async (apiUrl, contentType, categoryName) => {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("There is some error");
    }
    const data = await response.json();
    const imageItems = data.results;

    const mainContainer = document.createElement("section");
    mainContainer.classList.add("heading-title");

    const categoryHeading = document.createElement("h3");
    categoryHeading.textContent = categoryName;

    if (categoryName === "Upcoming Movies") {
      const gradientOverlay = document.createElement("div");
      gradientOverlay.classList.add("gradient");
      mainContainer.appendChild(gradientOverlay);
    }

    const rightArrow = document.createElement("img");
    rightArrow.classList.add("right-arrow");
    rightArrow.src = "assets/icons/right_arrow.svg";
    rightArrow.loading = "lazy";
    rightArrow.alt = "right-arrow";

    categoryHeading.appendChild(rightArrow);

    const cardsWrapper = document.createElement("div");
    cardsWrapper.classList.add("card-container");

    const content = document.createElement("div");
    content.classList.add("movie-content", "content");

    const fragment = document.createDocumentFragment();

    for (const item of imageItems) {
      if (contentType === "movie" && !item.backdrop_path) continue;
      if (contentType === "person" && !item.profile_path) continue;
      if (contentType === "tv" && !item.backdrop_path) continue;
      const cardHolder = document.createElement("div");
      cardHolder.classList.add("card-holder");

      const card = document.createElement("div");
      card.classList.add("card");

      const img = document.createElement("img");

      if (contentType === "movie") {
        img.src = imageURL(item.backdrop_path);
      } else if (contentType === "person") {
        img.src = imageURL(item.profile_path);
      } else if (contentType === "tv") {
        img.src = imageURL(item.backdrop_path);
      }

      img.alt = contentType === "movie" ? "Movie Poster" : "Person Poster";
      img.loading = "lazy";

      const movieRating = document.createElement("p");
      movieRating.classList.add("movie-rating");
      if (item.vote_average && item.vote_average !== 0) {
        movieRating.textContent = item.vote_average.toFixed(1);
      } else {
        movieRating.textContent = "";
      }

      const movieTitle = document.createElement("h4");
      movieTitle.classList.add("cardTitle");
      movieTitle.textContent =
        contentType === "movie" ? item.original_title : item.name;

      const watchingnowContainer = document.createElement("div");
      watchingnowContainer.classList.add("watchContainer");

      const watchNowText = document.createElement("p");
      watchNowText.classList.add("watch-now");

      const watchHeading = document.createElement("p");
      watchHeading.classList.add("watch-heading");
      watchHeading.textContent = "watching now";

      if (contentType === "person") {
        watchingnowContainer.style.display = "none";
      }

      if (item.vote_count <= 0) {
        watchHeading.textContent = "To be Released";
        watchNowText.textContent = `${(item.vote_count * 3)
          .toString()
          .slice(0, 3)}k`;
      } else {
        watchNowText.textContent = `${(item.vote_count * 3)
          .toString()
          .slice(0, 3)}k`;
      }

      watchingnowContainer.append(watchNowText, watchHeading);

      card.appendChild(img);
      card.appendChild(movieRating);
      card.appendChild(movieTitle);
      card.appendChild(watchingnowContainer);
      cardHolder.appendChild(card);
      fragment.appendChild(cardHolder);
    }

    content.appendChild(fragment);
    cardsWrapper.appendChild(content);
    mainContainer.appendChild(categoryHeading);
    mainContainer.appendChild(cardsWrapper);
    cardsSection.appendChild(mainContainer);
  } catch (error) {
    console.log("There is an error in fetching data:", error);
  }
};

// Fetch movies for different categories in a specific order
const fetchDataInOrder = async () => {
  await fetchCardData(
    customeUrl("movie", "upcoming"),
    "movie",
    "Upcoming Movies"
  );
  await fetchCardData(
    customeUrl("movie", "popular"),
    "movie",
    "Popular Movies"
  );
  await fetchCardData(
    customeUrl("tv", "airing_today"),
    "tv",
    "TV Shows Airing Today"
  );
  await fetchCardData(customeUrl("tv", "popular"), "tv", "Popular TV Shows");
  await fetchCardData(
    customeUrl("movie", "now_playing"),
    "movie",
    "Now Playing Movies"
  );
  await fetchCardData(
    customeUrl("person", "popular"),
    "person",
    "Famous People"
  );
  await fetchCardData(
    customeUrl("tv", "top_rated"),
    "tv",
    "Top Rated TV Shows"
  );
};

// Call the function to fetch the data in order
fetchDataInOrder();

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

fetchCarousel(customeUrl("movie", "upcoming"));

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

let carouselInterval;

const startInterval = () => {
  carouselInterval = setInterval(showNextImage, 5000);
};

const stopInterval = () => {
  clearInterval(carouselInterval);
};

nextBtn.addEventListener("click", () => {
  stopInterval();
  showNextImage();
  startInterval();
});

prevBtn.addEventListener("click", () => {
  stopInterval();
  showPrevImage();
  startInterval();
});

// featuring container

const getFeatureTrailer = () => {
  const iframe = document.createElement("iframe");
  iframe.classList.add("trailer-video");
  iframe.src = `https://www.youtube.com/embed/mMhDgAn_Kng?start=2`;
  iframe.allow =
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  video_container.appendChild(iframe);
};

getFeatureTrailer();

// const searchUrl = (category, type, query)=>{
//   const defaultUrl = `${API_URL}${category}/${type}?query=${query}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`
//   return defaultUrl
// }

// const fetchSearchData = async (url) =>{
//   try{
//     const response = await fetch(url)
//     if(!response.ok){
//       throw new Error("Error");

//     }
//     const data = await response.json()
//     const result = data.results
//     console.log(result)
//   }catch (error){
//     console.log("there is a error")
//   }
// }
// document.addEventListener("DOMContentLoaded",()=>{
//   const searchInput = document.querySelector('.search-input');
//   let timeout;
//   if(searchInput){
//     searchInput.addEventListener("input", (event) => {
//       clearTimeout(timeout);

//         timeout = setTimeout(() => {
//           console.log("Final input value:", event.target.value);
//         }, 1000);
//       const searchValue = event.target.value
//       if(searchValue === ""){
//         console.log([]);  }
//         else{
//           fetchSearchData(searchUrl("search","keyword", searchValue))
//         }
//       });
//   }
//   else{
//     console.log("error")
//   }

//   })
