const form = document.getElementById('captionForm');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMsg = document.getElementById('errorMsg');
const results = document.getElementById('results');
const captionsList = document.getElementById('captionsList');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.classList.add('hidden');
  results.classList.add('hidden');
  captionsList.innerHTML = '';
  btnText.textContent = 'Generating...';
  loadingSpinner.classList.remove('hidden');
  form.querySelector('button').disabled = true;

  const formData = new FormData(form);
  try {
    const res = await fetch('https://captionassistantbackend.onrender.com/generate-captions', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    data.captions.forEach((c) => {
      const p = document.createElement('p');
      p.textContent = c.replace(/^[0-9#].*?:?\s*/g, '').trim();
      p.className = 'bg-gray-100 dark:bg-gray-700 p-3 rounded';
      captionsList.appendChild(p);
    });
    results.classList.remove('hidden');
  } catch (err) {
    errorMsg.textContent = '⚠️ ' + err.message;
    errorMsg.classList.remove('hidden');
  }
  loadingSpinner.classList.add('hidden');
  btnText.textContent = 'Generate Captions';
  form.querySelector('button').disabled = false;
});