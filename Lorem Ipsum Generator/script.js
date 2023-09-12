// Constants for tag options
const tagOptions = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span"];

// Get DOM elements
const optionsContainer = document.querySelector(".options");
const outputContainer = document.querySelector(".output");
const tagsSelect = document.getElementById("tags");
const paragraphsSlider = document.getElementById("paragraphs");
const wordsSlider = document.getElementById("words");
const paragraphsValue = document.getElementById("paragraphsValue");
const wordsValue = document.getElementById("wordsValue");

// Create Options UI
function createOptionsUI() {
  // With tag options, fill up the <select> element.
  tagOptions.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = `<${tag}>`;
    tagsSelect.appendChild(option);
  });

  // Event listeners for sliders
  paragraphsSlider.addEventListener("input", updateParagraphsValue);
  wordsSlider.addEventListener("input", updateWordsValue);

  const generateButton = document.getElementById("generate");
  generateButton.addEventListener("click", generateLoremIpsum);
}

// Update the displayed value for Paragraphs
function updateParagraphsValue() {
  paragraphsValue.textContent = paragraphsSlider.value;
}

// Words per Paragraph have got to be updated on the display
function updateWordsValue() {
  wordsValue.textContent = wordsSlider.value;
}

// Generate Lorem Ipsum text
function generateLoremIpsum() {
  const paragraphs = parseInt(paragraphsSlider.value);
  const tag = document.getElementById("tags").value;
  const includeHtml = document.getElementById("include").value;
  const wordsPerParagraph = parseInt(wordsSlider.value);

  const loremIpsumText = generateText(
    paragraphs,
    tag,
    includeHtml,
    wordsPerParagraph
  );
  displayLoremIpsum(loremIpsumText);
}

// Function to generate Lorem Ipsum text
function generateText(paragraphs, tag, includeHtml, wordsPerParagraph) {
  const placeholderText = `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

  // Create an array of paragraphs
  const loremIpsumArray = new Array(paragraphs).fill("");

  // Generate words for each paragraph
  for (let i = 0; i < paragraphs; i++) {
    const words = generateWords(wordsPerParagraph);
    loremIpsumArray[i] =
      includeHtml === "Yes" ? `<${tag}>${words}</${tag}>` : words;
  }

  // Join paragraphs into a single string
  return loremIpsumArray.join("\n");
}

// Function to generate a specified number of words
function generateWords(numWords) {
  const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

  const words = loremIpsumText.split(" ");
  if (numWords <= words.length) {
    return words.slice(0, numWords).join(" ");
  } else {
    return words.join(" ");
  }
}

// Display Lorem Ipsum text
function displayLoremIpsum(text) {
  outputContainer.innerHTML = `<pre>${text}</pre>`;
}

// Initialize the app
createOptionsUI();
