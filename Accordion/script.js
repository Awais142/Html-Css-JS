function toggleAccordion(element) {
  const header = element;
  const content = header.nextElementSibling;
  const icon = header.querySelector(".icon");

  if (content.style.maxHeight) {
    content.style.maxHeight = null;
    icon.classList.remove("rotate-icon");
  } else {
    document.querySelectorAll(".accordion-content").forEach((el) => {
      el.style.maxHeight = null;
      el.previousElementSibling
        .querySelector(".icon")
        .classList.remove("rotate-icon");
    });
    content.style.maxHeight = content.scrollHeight + "px";
    icon.classList.add("rotate-icon");
  }
}
