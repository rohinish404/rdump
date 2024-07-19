const dmp_all_btn = document.getElementById("dmp_all_btn")
const dmp_btn = document.getElementById("dmp_btn")
const all_tabs = document.getElementById("all_tabs")
const fileInput = document.getElementById("fileInput")
var textFile = null
chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
  tabs.forEach((tab, index) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `tab${index}`;
    checkbox.name = 'tabs';
    checkbox.value = JSON.stringify(tab);

    const label = document.createElement('label');
    label.htmlFor = `tab${index}`;
    label.appendChild(document.createTextNode(tab.url));

    all_tabs.appendChild(checkbox);
    all_tabs.appendChild(label);
    all_tabs.appendChild(document.createElement('br'));
  })

});
function downloadTabs(tabs){
  let text = tabs.map(tab => tab.url).join('\n')

  let data = new Blob([text], {type: 'text/plain'});

  if (data !== null) {
    window.URL.revokeObjectURL(data);
  }

  textFile = window.URL.createObjectURL(data);

  const date = new Date().toISOString().slice(0,10);
  const options = {
    url: textFile,
    filename: `tabs_${date}.txt`,

  };

  chrome.downloads.download(options, (downloadId) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log('Download initiated with ID:', downloadId);
    }
  });
}
function readFileToArray(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const linesArray = contents.split('\n');
      resolve(linesArray);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
}
function dump(){

  const checkedItems = Array.from(document.querySelectorAll('input[name="tabs"]:checked'))
  .map(checkbox => JSON.parse(checkbox.value));

  checkedItems.forEach((tab) => {
    const elem = document.createElement('div')
    elem.innerHTML = `<p>${tab.url}</p>`
    all_tabs.appendChild(elem)
  })
  downloadTabs(checkedItems)
}



function load() {
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const tabsArray = await readFileToArray(file);
        const elem = document.createElement('div');
        elem.innerHTML = `<p>${tabsArray.join(', ')}</p>`;
        all_tabs.appendChild(elem);
        console.log('File contents as array:', tabsArray);
        
        tabsArray.forEach((tab) => {
          chrome.tabs.create({ url: tab });
        });
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  });
}

function dumpAll(){
  all_tabs.innerHTML = ''
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    downloadTabs(tabs)
  });

}

dmp_all_btn.addEventListener('click',dumpAll)
dmp_btn.addEventListener('click',dump)
load()
