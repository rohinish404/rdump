const dmp_btn = document.getElementById("dmp_btn")
const all_tabs = document.getElementById("all_tabs")

function dump(){
  all_tabs.innerHTML = ''
  chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
    tabs.forEach((tab) => {
      const elem = document.createElement('div')
      elem.innerHTML = `<p>${tab.url}</p>`
      all_tabs.appendChild(elem)
    })
  });
}
dmp_btn.addEventListener('click',dump)
