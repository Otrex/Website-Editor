export const uid = (p='el') => `${p}-${Math.random().toString(36).slice(2,9)}`;
export const escapeHtml = (s) => typeof s !== 'string' ? s : s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');