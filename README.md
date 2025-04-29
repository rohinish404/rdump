# rdump tab export/import extension

This Chrome/Edge/Brave extension has two features:

- Export list of currently open tabs to a text file.
- Import a text file with a newline-separated list of links, and it'll open them all for you.

The code, logic, everything is by https://github.com/rohinish404/rdump. I just gave it a cyberpunk/vaporwave aesthetic, made a couple of UX changes, and wrote an expanded `README.md`.

<img width="500" alt="rdump interface screenshot" src="https://github.com/user-attachments/assets/6ad72b86-3db8-48f1-969a-f857d6529b55">


## Installation

- Clone the git repo
  
```bash
  git clone https://github.com/claudejaune/rdump-prettified.git
```

- Go to `Settings` > `Extensions` in Google Chrome 

<img width="344" alt="Screenshot 2024-07-19 at 4 33 26 PM" src="https://github.com/user-attachments/assets/ed483436-805d-4ffe-b572-286d37d055c7">

- Toggle on Developer mode in the top-right corner.
  
- Click **Load unpacked** and select the `rdump-prettified` folder.
  
<img width="494" alt="Screenshot 2024-07-19 at 4 34 10 PM" src="https://github.com/user-attachments/assets/a077b2da-f941-4541-b1e3-f86db45fea31"><br/>


You'll now have it in your extension list.

## How to use

### Export tab list

- Select the tabs you wish to export
- Enter the destination filename (**Important**: the app will silently fail if you don't write a filename)
- Click **Export selected**

Alternatively, enter a filename and click **Export all**.

### Import URLs

- Click **Choose file** and select a text file with a newline-separated list of URLs

### Video demo (minus the cyberpunk theme)

https://github.com/user-attachments/assets/b8f9e39e-4ea4-4d63-b357-2d6190de35b6

## Caveats

- Need to enter a filename _before_ clicking the export button. Otherwise, it'll silently fail.
- The extension expects a newline-separated list of links to open. However, _the input file is not sanitized in any way_. I have no idea what will happen if you feed it random text files. Your computer might explode idk
- Only detects the tabs open in the current browser window. If you want to export tabs from other windows, you'll need to go to each window individually and export.
- The Cyberpunk theme is vibe coded.


**Original**: https://github.com/rohinish404/rdump
