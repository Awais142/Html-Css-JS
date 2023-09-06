function openLightbox(element) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");

  // Set lightbox image and caption
  lightboxImage.src = element.querySelector("img").src;
  lightboxCaption.textContent = element.querySelector(".caption").textContent;

  // Show the lightbox
  lightbox.style.display = "flex";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
}
