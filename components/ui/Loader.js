// src/ui/loader.js
export function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
  }
  
  export function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
  }
  