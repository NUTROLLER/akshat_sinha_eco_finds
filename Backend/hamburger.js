window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector("#hamburger-icon");
  const hamburgerElement = document.querySelector(".hamburger-content");

  console.log('DOM loaded, elements:', hamburger, hamburgerElement);

  if (!hamburger || !hamburgerElement) {
    console.error('Hamburger elements not found!');
    return;
  }

  hamburger.addEventListener('click', () => {
    console.log("Clicked hamburger!");
    hamburgerElement.classList.toggle('open');
  });
});