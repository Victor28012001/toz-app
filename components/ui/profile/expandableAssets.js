// expandableAssets.js

export async function createExpandableAssetsTabs(data) {
  
    const container = document.createElement('section');
    container.className = 'asset-tabs';
  
    const categories = ['All', 'Characters', 'Collectibles', 'Badge', 'Juksbucks'];
    const radioGroupName = 'assetsTab';
  
    const tabsNav = document.createElement('div');
    tabsNav.className = 'tabs-nav';
  
    const tabsContent = document.createElement('div');
    tabsContent.className = 'tabs-content';
  
    categories.forEach((category, index) => {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = radioGroupName;
      input.id = `tab-${index}`;
      input.value = category.toLowerCase();
      if (index === 0) input.checked = true;
  
      const label = document.createElement('label');
      label.setAttribute('for', `tab-${index}`);
      label.textContent = category;
  
      const tabPane = document.createElement('div');
      tabPane.className = 'tab-pane';
      tabPane.setAttribute('data-category', category.toLowerCase());
  
      // Fill tab content
      if (category === 'All') {
        const allAssets = data['expandable-lists'].Assets.find(a => a.title === 'All')?.children || [];
        tabPane.append(...allAssets.map(createAssetCard));
      } else if (category === 'Juksbucks') {
        const jukValue = data['expandable-lists'].Assets.find(a => a.title === 'Juksbucks')?.children;
        tabPane.textContent = `Balance: ${jukValue}`;
      } else {
        const allAssets = data['expandable-lists'].Assets.find(a => a.title === 'All')?.children || [];
        const filtered = allAssets.filter(child => child.categoty?.toLowerCase() === category.toLowerCase());
        tabPane.append(...filtered.map(createAssetCard));
      }
  
      tabsNav.appendChild(input);
      tabsNav.appendChild(label);
      tabsContent.appendChild(tabPane);
    });
  
    container.appendChild(tabsNav);
    container.appendChild(tabsContent);
  
    // Show only the active tab content
    const updateVisibleTab = () => {
      const selected = container.querySelector(`input[name="${radioGroupName}"]:checked`).value;
      [...tabsContent.children].forEach(tab => {
        tab.style.display = tab.getAttribute('data-category') === selected ? 'block' : 'none';
      });
    };
  
    container.addEventListener('change', updateVisibleTab);
    updateVisibleTab(); // initial call
  
    return container;
  }
  
  function createAssetCard(asset) {
    const card = document.createElement('div');
    card.className = 'asset-card';
    card.innerHTML = `
      <img src="${asset.imgLink}.jpg" alt="${asset.name}" />
      <div class="asset-info">
        <h4>${asset.name}</h4>
        <p>Type: ${asset.categoty}</p>
        <p>Tier: ${asset.tier}</p>
        <p>Worth: ${asset.worth}</p>
      </div>
    `;
    return card;
  }
  