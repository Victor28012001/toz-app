// expandableAssets.js

export async function createExpandableCharactersTabs(data) {
  
    const container = document.createElement("section");
    container.className = "asset-tabs";
  
    const tabsContent = document.createElement("div");
    tabsContent.className = "tabs-content";
  
    const tabPane = document.createElement("div");
    tabPane.className = "tab-pane";
    tabPane.setAttribute("data-category", "characters");
  
    const allCharacters = data["expandable-lists"].Characters || [];
  
    // Use spread operator to append multiple nodes
    tabPane.append(...allCharacters.map(createCharacterCard));
  
    tabsContent.appendChild(tabPane);
    container.appendChild(tabsContent);
  
    return container;
  }
  
  function createCharacterCard(character) {
    const card = document.createElement("div");
    card.className = "asset-card";
  
    card.innerHTML = `
      <img src="${character.imgLink}" alt="${character.name}" />
      <div class="asset-info">
        <h4>${character.name}</h4>
        <p>description: ${character.description}</p>
        <p>Tier: ${character.tier}</p>
        <p>Worth: ${character.worth}</p>
      </div>
    `;
  
    return card;
  }
  
