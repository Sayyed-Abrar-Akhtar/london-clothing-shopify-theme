function initColorSwatches() {
  document.querySelectorAll('[data-color-swatch-type="link"]')?.forEach(swatch => {
    swatch.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      const link = this.dataset.colorSwatchLink;
      
      if (link) {
        // Ctrl+Click or Cmd+Click opens in new tab
        if (e.ctrlKey || e.metaKey) {
          window.open(link, '_blank');
        } else {
          window.location.href = link;
        }
      }
    });
    
  });
}

document.addEventListener('DOMContentLoaded', initColorSwatches);