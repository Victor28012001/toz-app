import { walletConnect } from "../../constants.js";
import { getSoundEnabled } from "../../utils/SoundToggleButton.js";

export function createSlider({
  containerSelector,
  dataUrl,
  onGameClick = () => {},
}) {
  const slider = document.querySelector(containerSelector);
  const newParent = document.querySelector("#newParent");
  const originalParent = slider;
  const body = document.body;
  let moved = false;

  fetch(dataUrl)
    .then((res) => res.json())
    .then((data) => {
      const games = data.games;
      const totalItems = games.length;
      console.log(games)

      slider.style.setProperty("--quantity", totalItems);

      games.forEach((game, i) => {
        const item = document.createElement("div");
        item.className = "item";
        item.setAttribute("style", `--position: ${i + 1}`);
        item.setAttribute("data-index", i + 1);

        const img = document.createElement("img");
        img.src = game.imgLink;
        img.alt = game.name;
        item.appendChild(img);
        slider.appendChild(item);

        item.addEventListener("click", () => {
          if (getSoundEnabled() && walletConnect) {
            walletConnect.currentTime = 0;
            walletConnect.play();
          }
        });

        item.addEventListener("click", () => {
          if (!moved) {
            item.innerHTML = "";

            const leftDiv = createLeftSection(game);
            const gameImg = createImage(game);
            const rightDiv = createRightSection(game);

            item.appendChild(gameImg);


            const contentWrapper = document.createElement("div");
            contentWrapper.classList.add("contentWrapper");
            contentWrapper.appendChild(leftDiv);
            contentWrapper.appendChild(item);
            contentWrapper.appendChild(rightDiv);

            newParent.appendChild(contentWrapper);
            moved = true;

            animateExpand(newParent, item, gameImg, body, slider);
          } else {
            resetSliderView(item, originalParent, newParent, game, slider, body);
            moved = false;
          }

          onGameClick(game); // Optional external callback
        });
      });
    });
}

function createLeftSection(game) {
  const div = document.createElement("div");
  div.classList.add("left");

  const name = document.createElement("h2");
  name.textContent = game.name;
  name.style.fontFamily = "ICA Rubrik, sans-serif";

  const creator = document.createElement("h4");
  creator.textContent = `By: ${game.creator}`;

  const creationDate = document.createElement("h4");
  creationDate.textContent = `Created: ${game.creationDate}`;

  const genre = document.createElement("h4");
  genre.textContent = `Genre: ${game.genre}`;

  div.appendChild(name);
  div.appendChild(creator);
  div.appendChild(creationDate);
  div.appendChild(genre);

  return div;
}

function createRightSection(game) {
  const div = document.createElement("div");
  div.classList.add("right");

  const description = document.createElement("p");
  description.textContent = game.description;

  const prize = document.createElement("h4");
  prize.textContent = `Prize: ${game.prize}`;
  prize.classList.add("prize");

  div.appendChild(description);
  div.appendChild(prize);

  return div;
}

function createImage(game) {
  const img = document.createElement("img");
  img.src = game.imgLink;
  img.alt = game.name;
  img.classList.add("img-expanded");
  return img;
}

function animateExpand(newParent, item, body, slider) {
  newParent.classList.add("new-parent-expanded");
  item.classList.add("item-expanded");

  slider.classList.add("paused");
  body.style.overflow = "hidden";
}

function resetSliderView(item, originalParent, newParent, game, slider, body) {
  item.innerHTML = "";

  const img = document.createElement("img");
  img.src = game.imgLink;
  img.alt = game.name;
  item.appendChild(img);

  originalParent.appendChild(item);
  newParent.innerHTML = "";

  newParent.classList.remove("new-parent-expanded");
  item.classList.remove("item-expanded");
  img.classList.remove("img-expanded");

  slider.classList.remove("paused");
  body.style.overflow = "";
}
