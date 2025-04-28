import { getSoundEnabled } from "../../utils/SoundToggleButton.js";
import { original, divider, links, walletConnect, expanded } from "../../constants.js";
export class HeaderComponent {
  constructor() {
    this.links = links;
    this.container = divider;
    this.original = original;
    this.expanded = expanded;
    this.walletConnect = walletConnect;

    if (!this.container) {
      console.error(`Container with ID '${containerId}' not found`);
      return;
    }

    this.init();
  }

  init() {
    this.links.forEach((link) => {
      const svg = this.createSvgElement(link);
      this.container.appendChild(svg);
    });
  }

  createSvgElement(link) {
    const svg = this.createSvg();
    const clipPathId = `clip-${link.name.toLowerCase()}`;

    const defs = this.createClipDefs(clipPathId, this.original);
    svg.appendChild(defs);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const image = this.createImage(link.bg, clipPathId);
    g.appendChild(image);

    const svgLink = this.createSvgLink("#");
    const path = this.createPath(this.original);
    svgLink.appendChild(path);
    g.appendChild(svgLink);
    svg.appendChild(g);

    const text = this.createText(link.name);

    svgLink.addEventListener("mouseenter", () => {
      gsap.to([path, defs.querySelector("path")], {
        duration: 0.3,
        attr: { d: this.expanded },
        ease: "power2.out",
      });

      svg.appendChild(text);

      if (getSoundEnabled() && this.walletConnect) {
        this.walletConnect.currentTime = 0;
        this.walletConnect.play();
      }
    });

    svgLink.addEventListener("mouseleave", () => {
      gsap.to([path, defs.querySelector("path")], {
        duration: 0.3,
        attr: { d: this.original },
        ease: "power2.out",
      });

      svg.removeChild(text);

      if (getSoundEnabled() && this.walletConnect) {
        this.walletConnect.currentTime = 0;
        this.walletConnect.play();
      }
    });

    svgLink.addEventListener("click", async (e) => {
      e.preventDefault();

      const root = document.getElementById("newParent");
      if (!root) return;

      // Remove all children in #newParent
      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }

      // Add class to parent
      root.classList.add("new-parent-expanded");

      // Dynamically load the correct component based on link.name
      switch (link.name) {
        case "Profile":
          const { createProfileComponent } = await import(
            "./layouts/ProfileComponent.js"
          );
          createProfileComponent("newParent");
          this.addCloseButton(root);
          break;
        case "Lobby":
          const { createLobbyComponent } = await import("./layouts/LobbyComponent.js");
          createLobbyComponent("newParent");
          this.addCloseButton(root);
          break;
        case "Games":
          const { createGamesComponent } = await import("./layouts/GamesComponent.js");
          createGamesComponent("newParent");
          this.addCloseButton(root);
          break;
        case "Character":
          const { createCharacterComponent } = await import(
            "./layouts/CharacterComponent.js"
          );
          createCharacterComponent("newParent");
          this.addCloseButton(root);
          break;
        case "Assets":
          const { createAssetsComponent } = await import(
            "./layouts/AssetsComponent.js"
          );
          createAssetsComponent("newParent");
          this.addCloseButton(root);
          break;
        case "Chats":
          const { createFriendsComponent } = await import(
            "./layouts/FriendsComponent.js"
          );
          createFriendsComponent("newParent");
          this.addCloseButton(root);
          break;
        default:
          console.warn(`No component found for ${link.name}`);
      }
    });

    return svg;
  }

  addCloseButton(root) {
    // Avoid adding multiple close buttons
    if (root.querySelector(".close-button")) return;

    const btn = document.createElement("button");
    btn.textContent = "Close";
    btn.className = "close-button";
    btn.style.cssText = `
      padding: 6px 12px;
      background-color: transparent;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      position: absolute;
      top: 5rem;
      right: 2rem;
      font-family: "ICA Rubrik";
    `;

    btn.addEventListener("click", () => {
      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }
      root.classList.remove("new-parent-expanded");
    });

    root.appendChild(btn);
  }

  createSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "300");
    svg.setAttribute("height", "60");
    svg.setAttribute("viewBox", "0 0 300 60");
    svg.setAttribute("class", "hover-expand");
    svg.setAttribute(
      "style",
      "overflow: visible; pointer-events: none; scale: 1.2;"
    );
    return svg;
  }

  createClipDefs(id, d) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const clipPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "clipPath"
    );
    clipPath.setAttribute("id", id);

    const shape = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    shape.setAttribute("d", d);

    clipPath.appendChild(shape);
    defs.appendChild(clipPath);

    return defs;
  }

  createImage(href, clipPathId) {
    const image = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
    image.setAttribute("width", "300");
    image.setAttribute("height", "60");
    image.setAttribute("opacity", "0.8");
    image.setAttribute("preserveAspectRatio", "xMidYMid slice");
    image.setAttribute("clip-path", `url(#${clipPathId})`);
    return image;
  }

  createSvgLink(url) {
    const link = document.createElementNS("http://www.w3.org/2000/svg", "a");
    link.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);
    link.setAttribute("target", "_self");
    return link;
  }

  createPath(d) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "rgba(0,0,0,0.001)");
    path.setAttribute("stroke", "#000");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("opacity", "0.6");
    path.setAttribute("style", "cursor: pointer; pointer-events: auto;");
    return path;
  }

  createText(content) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "150");
    text.setAttribute("y", "32");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#fff");
    text.setAttribute("font-size", "16");
    text.setAttribute("font-family", "ICA Rubrik");
    text.setAttribute("stroke", "#000");
    text.textContent = content;
    return text;
  }
}
