function generateQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("quoteText").textContent = `"${quote.text}"`;
  document.getElementById("quoteAuthor").textContent = `- ${quote.author}`;
}
