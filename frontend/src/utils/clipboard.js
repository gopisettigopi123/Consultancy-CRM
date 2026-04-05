/**
 * Copies text to the clipboard with a fallback for non-secure contexts (HTTP).
 * navigator.clipboard is only available in secure contexts (HTTPS/localhost).
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  // 1. Try modern API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Modern clipboard API failed:', err);
    }
  }

  // 2. Fallback to older document.execCommand('copy') for HTTP/non-secure contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Ensure the textarea is not visible but part of the DOM
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) return true;
    throw new Error('execCommand failed');
  } catch (err) {
    console.error('Clipboard fallback failed:', err);
    return false;
  }
};
