const dmp_all_btn = document.getElementById("dmp_all_btn")
const dmp_btn = document.getElementById("dmp_btn")
const all_tabs = document.getElementById("all_tabs")
const fileInput = document.getElementById("fileInput")
var textFile = null
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

chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
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
    label.appendChild(document.createTextNode(tab.title));

    tabItem.appendChild(checkbox);
    tabItem.appendChild(label);
    all_tabs.appendChild(tabItem);
    all_tabs.appendChild(document.createElement('hr'));
  });
});
function downloadTabs(tabs, file_name){
  let text = tabs.map(tab => tab.url).join('\n')

  let data = new Blob([text], {type: 'text/plain'});

  if (data !== null) {
    window.URL.revokeObjectURL(data);
  }

  textFile = window.URL.createObjectURL(data);

  const options = {
    url: textFile,
    filename: `${file_name}.txt`,

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
  const file_name = document.getElementById("file_name")
  const checkedItems = Array.from(document.querySelectorAll('input[name="tabs"]:checked'))
  .map(checkbox => JSON.parse(checkbox.value));

  downloadTabs(checkedItems, file_name.value)
}



function load() {
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const tabsArray = await readFileToArray(file);

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
  const file_name = document.getElementById("file_name")

  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    downloadTabs(tabs, file_name.value)
  });

}

dmp_all_btn.addEventListener('click',dumpAll)
dmp_btn.addEventListener('click',dump)
load()
