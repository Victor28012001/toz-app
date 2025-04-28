export function distanceInWordsToNow(date, { addSuffix = false, locale = 'en' } = {}) {
    if (!(date instanceof Date)) date = new Date(date);
  
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const isPast = diffInSeconds >= 0;
    const absSeconds = Math.abs(diffInSeconds);
  
    const units = [
      { label: 'yr', seconds: 365 * 24 * 60 * 60 },
      { label: 'mo', seconds: 30 * 24 * 60 * 60 },
      { label: 'day', seconds: 24 * 60 * 60 },
      { label: 'hr', seconds: 60 * 60 },
      { label: 'min', seconds: 60 },
      { label: 'sec', seconds: 1 },
    ];
  
    const parts = [];
  
    let remainingSeconds = absSeconds;
  
    for (const { label, seconds } of units) {
      const value = Math.floor(remainingSeconds / seconds);
      if (value > 0) {
        parts.push(`${value} ${label}${value !== 1 ? 's' : ''}`);
        remainingSeconds %= seconds;
        if (parts.length === 2) break; // Limit to 2 parts for readability
      }
    }
  
    let result = parts.join(' ');
  
    if (addSuffix) {
      if (locale === 'en') {
        result = isPast ? `${result} ago` : `in ${result}`;
      }
      // Example: add more locale support
      else if (locale === 'es') {
        result = isPast ? `hace ${result}` : `en ${result}`;
      }
    }
  
    return result || (addSuffix ? (isPast ? 'just now' : 'soon') : '0 seconds');
  }
  