/**
 * Format currency in Pakistani Rupees (PKR)
 */
export function formatPKR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'PKR 0';
  const num = Number(amount);
  
  if (num >= 10000000) {
    return `PKR ${(num / 10000000).toFixed(2)} Crore`;
  }
  if (num >= 100000) {
    return `PKR ${(num / 100000).toFixed(1)} Lakh`;
  }
  if (num >= 1000) {
    return `PKR ${num.toLocaleString('en-PK')}`;
  }
  return `PKR ${num.toLocaleString('en-PK')}`;
}

/**
 * Compact PKR string e.g. "PKR 50k", "PKR 2.5 Lakh"
 */
export function formatPKRCompact(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'PKR 0';
  const num = Number(amount);
  
  if (num >= 10000000) {
    return `PKR ${(num / 10000000).toFixed(1)} Cr`;
  }
  if (num >= 100000) {
    return `PKR ${(num / 100000).toFixed(1)} Lakh`;
  }
  if (num >= 1000) {
    return `PKR ${(num / 1000).toFixed(0)}k`;
  }
  return `PKR ${num}`;
}

/**
 * Format relative date (e.g., '2 days ago', 'Just now')
 */
export function formatRelativeTime(dateStringOrTimestamp) {
  if (!dateStringOrTimestamp) return 'Recently';
  
  const date = typeof dateStringOrTimestamp === 'number'
    ? new Date(dateStringOrTimestamp)
    : new Date(dateStringOrTimestamp);
    
  if (isNaN(date.getTime())) return 'Recently';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hrs = Math.floor(diffInSeconds / 3600);
    return `${hrs}h ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
  return date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Generate consistent avatar placeholder or SVG
 */
export function getAvatarUrl(name, seed) {
  const query = encodeURIComponent(seed || name || 'IdeaVault User');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${query}&backgroundColor=1e293b,2563eb,0f172a,3b82f6&textColor=ffffff`;
}

/**
 * Truncate text nicely
 */
export function truncate(text, length = 120) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

