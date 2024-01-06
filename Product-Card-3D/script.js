// Movement Animation
const card = document.querySelector(".card");
const container = document.querySelector(".container");
const sneaker = document.querySelector(".sneaker img");
const title = document.querySelector(".info h1");
const description = document.querySelector(".info h3");
const sizes = document.querySelector(".sizes");
const purchase = document.querySelector(".purchase");

// Moving Animation Event
container.addEventListener("mousemove", (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Animate In
container.addEventListener("mouseenter", (e) => {
    card.style.transition = "none";
    
    // Pop out effect
    sneaker.style.transform = "translateZ(150px) rotateZ(-45deg)";
    title.style.transform = "translateZ(150px)";
    description.style.transform = "translateZ(125px)";
    sizes.style.transform = "translateZ(100px)";
    purchase.style.transform = "translateZ(75px)";
});

// Animate Out
container.addEventListener("mouseleave", (e) => {
    card.style.transition = "all 0.5s ease";
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    
    // Pop back
    sneaker.style.transform = "translateZ(0px) rotateZ(0deg)";
    title.style.transform = "translateZ(0px)";
    description.style.transform = "translateZ(0px)";
    sizes.style.transform = "translateZ(0px)";
    purchase.style.transform = "translateZ(0px)";
});

// Size Selection
const sizeButtons = document.querySelectorAll('.sizes button');
sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        sizeButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
    });
});

// Purchase Animation
const purchaseButton = document.querySelector('.purchase button');
purchaseButton.addEventListener('click', () => {
    card.classList.add('animate');
    
    // Remove animation class after it completes
    setTimeout(() => {
        card.classList.remove('animate');
    }, 750);
});
