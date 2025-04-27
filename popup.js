const dmp_all_btn    = document.getElementById("dmp_all_btn");
const dmp_btn        = document.getElementById("dmp_btn");
const all_tabs       = document.getElementById("all_tabs");
const fileInput      = document.getElementById("fileInput");
const fileNameInput  = document.getElementById("file_name");
const outputRadios   = document.querySelectorAll('input[name="output_mode"]');
let textFile = null;

// keep the same injected style for .tab-item/.tab-label
const style = document.createElement('style');
style.textContent = `
.tab-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tab-label {
  font-family: Arial, sans-serif;
  font-size: 14px;
  cursor: pointer;
}
`;
document.head.appendChild(style);

// disable filename input when “Copy to Clipboard” is selected
outputRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    fileNameInput.disabled = (radio.value === 'clipboard');
  });
});

// list all tabs in current window
chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
  tabs.forEach((tab, index) => {
    const tabItem = document.createElement('div');
    tabItem.className = 'tab-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `tab${index}`;
    checkbox.name = 'tabs';
    checkbox.value = JSON.stringify(tab);
    checkbox.className = 'tab-checkbox';

    const label = document.createElement('label');
    label.htmlFor = `tab${index}`;
    label.className = 'tab-label';
    label.textContent = tab.title;

    tabItem.appendChild(checkbox);
    tabItem.appendChild(label);
    all_tabs.appendChild(tabItem);
    all_tabs.appendChild(document.createElement('hr'));
  });
});

// helper to create a .txt and download
function downloadTabs(tabs, file_name) {
  const text = tabs.map(tab => tab.url).join('\n');
  const blob = new Blob([text], {type: 'text/plain'});
  if (textFile) window.URL.revokeObjectURL(textFile);
  textFile = window.URL.createObjectURL(blob);

  chrome.downloads.download({
    url: textFile,
    filename: `${file_name}.txt`,
  }, id => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Download initiated with ID:', id);
    }
  });
}

// helper to copy URLs to clipboard
function copyToClipboard(tabs) {
  const text = tabs.map(t => t.url).join('\n');
  navigator.clipboard.writeText(text)
    .then(() => console.log('URLs copied to clipboard'))
    .catch(err => console.error('Copy failed', err));
}

// export selected tabs
function dump() {
  const mode = document.querySelector('input[name="output_mode"]:checked').value;
  const selected = Array.from(document.querySelectorAll('input[name="tabs"]:checked'))
    .map(cb => JSON.parse(cb.value));

  if (mode === 'file') {
    downloadTabs(selected, fileNameInput.value);
  } else {
    copyToClipboard(selected);
  }
}

// export all tabs
function dumpAll() {
  const mode = document.querySelector('input[name="output_mode"]:checked').value;
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, tabs => {
    if (mode === 'file') {
      downloadTabs(tabs, fileNameInput.value);
    } else {
      copyToClipboard(tabs);
    }
  });
}

// file‐input → open URLs
function readFileToArray(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => res(e.target.result.split('\n'));
    reader.onerror = rej;
    reader.readAsText(file);
  });
}

function load() {
  fileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const urls = await readFileToArray(file);
      urls.forEach(url => chrome.tabs.create({ url }));
    } catch (err) {
      console.error('Error reading file:', err);
    }
  });
}

// wire up buttons
dmp_btn.addEventListener('click', dump);
dmp_all_btn.addEventListener('click', dumpAll);
load();
