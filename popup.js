const dmp_btn = document.getElementById("dmp_btn")
const all_tabs = document.getElementById("all_tabs")
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
function dump(){
  all_tabs.innerHTML = ''
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    tabs.forEach((tab) => {
      const elem = document.createElement('div')
      elem.innerHTML = `<p>${tab.url}</p>`
      all_tabs.appendChild(elem)
    })
    downloadTabs(tabs)
  });
}
var textFile = null



dmp_btn.addEventListener('click',dump)
