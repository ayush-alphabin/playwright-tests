// Memory leak fix
function cleanupEventListeners() {
  // Remove all event listeners on cleanup
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClick);
}
