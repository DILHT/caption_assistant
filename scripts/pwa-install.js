let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});
function showInstallPromotion() {
  const installContainer = document.createElement('div');
  installContainer.className = 'fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50';
  installContainer.innerHTML = `
    <div class="flex items-center space-x-4">
      <div>
        <h3 class="font-bold">Install Caption Assistant</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">Add to your home screen for quick access</p>
      </div>
      <button id="installBtn" class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded transition">
        Install
      </button>
      <button id="dismissBtn" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
    </div>`;
  document.body.appendChild(installContainer);
  document.getElementById('installBtn').addEventListener('click', async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') installContainer.remove();
    deferredPrompt = null;
  });
  document.getElementById('dismissBtn').addEventListener('click', () => {
    installContainer.remove();
  });
}