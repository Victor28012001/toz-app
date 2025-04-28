// document.addEventListener("DOMContentLoaded", () => {
import { HeaderComponent } from "./components/ui/HeaderComponent.js";
import { createSlider } from "./components/ui/SliderComponent.js";
import { createSolanaWalletButton } from "./utils/ConnectWalletButton.js";
import { ScrambleHoverEffect } from "./utils/ScrambleHoverEffect.js";
import { SoundToggleButton } from "./utils/SoundToggleButton.js";
import { getUserPublicKey } from "./utils/walletState.js";

const publicKey = getUserPublicKey();

localStorage.setItem("userPublicKey", publicKey);

new HeaderComponent();

createSlider({
  containerSelector: ".slider",
  dataUrl: "./datas/games.json",
  onGameClick: (game) => {
    console.log("User clicked game:", game.name);
  },
});

ScrambleHoverEffect({
  selector: "h1, h2, h3, button",
  excludedIds: ["toggle-music"],
  duration: 600,
  intervalTime: 25,
});

SoundToggleButton();

createSolanaWalletButton("#connect-wallet");
