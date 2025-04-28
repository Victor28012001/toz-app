// expandableAssets.js

export async function createExpandableLobbiesTabs() {
  
    const container = document.createElement("section");
    container.className = "asset-tabs";
  
    
  
    const tabsContent = document.createElement("div");
    tabsContent.className = "tabs-content";
  
    
    const tabPane = document.createElement("div");
    tabPane.className = "tab-pane";
    tabPane.setAttribute("data-category", "characters");
  
    // const allAssets =
    //   data["expandable-lists"].LoresNQuests ||
    //   [];
    // tabPane.append(...allAssets.map(createAssetCard));
    tabsContent.appendChild(tabPane);
    container.appendChild(tabsContent);
  
  
    return container;
  }
  
 