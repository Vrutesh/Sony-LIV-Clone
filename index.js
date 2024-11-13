// fetch data
const API_KEY = "f3fbd38c0c00cefd4bd7ffeb48aa7a17";
const API_URL = "https://api.themoviedb.org/3/movie/";

// Main Containers
const upcomingContainer = document.querySelector(".upcoming-content");
const latestContainer = document.querySelector(".latest-content");
const nowPlayingContainer = document.querySelector(".nowplaying-content");

const slide = document.querySelector(".slide")

const customeUrl = (type)=>{
  const defaultUrl = `${API_URL}${type}?language=en-US&page=1&region=IN&api_key=${API_KEY}`;
  return defaultUrl
}

const peopleUrl = `https://api.themoviedb.org/3/person/popular`

// Default image URL
const imageURL = (url) => `https://image.tmdb.org/t/p/w500${url}`;

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

// const fetchCarousel = (url)=>{
//   fetch(url)
//   .then((response)=>{
//     if(!response.ok){
//       throw new Error("There is some error");
//     }
//     return response.json()
//   })
//   .then((data)=>{
//     if(!data.results){
//       return
//     }
//     const fragment = document.createDocumentFragment()
//     for (const movie of data.results) {
//       console.log(movie)
//       if (!movie.poster_path) continue;

//         const card = document.createElement("div");
//         card.classList.add("card");

//         const img = document.createElement("img");
//         img.src = imageURL(movie.poster_path);
//         console.log(img)
//         img.alt = "Movie Poster";
//         img.loading = "lazy";


//         card.appendChild(img);
//         fragment.appendChild(card);
//     }
//     slide.appendChild(fragment)
//   })
// }

// fetchCarousel(customeUrl("upcoming"))

