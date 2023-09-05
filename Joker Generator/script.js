function generateJoke() {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  const joke = jokes[randomIndex];

  document.getElementById("jokeText").textContent = joke.text;
}
