// expandableAssets.js

export async function createExpandableLoresTabs(data) {
  
    const container = document.createElement("section");
    container.className = "asset-tabs";
  
    
  
    const tabsContent = document.createElement("div");
    tabsContent.className = "tabs-content";
  
    
    const tabPane = document.createElement("div");
    tabPane.className = "tab-pane";
    tabPane.setAttribute("data-category", "characters");
  
    const allAssets =
      data["expandable-lists"].LoresNQuests ||
      [];
    tabPane.append(...allAssets.map(createAssetCard));
    tabsContent.appendChild(tabPane);
    container.appendChild(tabsContent);
  
  
    return container;
  }
  
  function createAssetCard(asset) {
    const card = document.createElement("div");
    card.className = "asset-card";
    card.innerHTML = `
        <img src="${asset.bg}" alt="${asset.title}" />
        <div class="asset-info">
          <h4>${asset.title}</h4>
          <p>achievement: ${asset.achievement}</p>
          <p>description: ${asset.description}</p>
          <p>views: ${asset.views}</p>
        </div>
      `;
    return card;
  }
 