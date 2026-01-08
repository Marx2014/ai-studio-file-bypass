# ai-studio-file-bypass

# 🚀 Google AI Studio File Type Restriction Bypass

A UserScript (Tampermonkey) that bypasses the file type restrictions on [Google AI Studio](https://aistudio.google.com/), allowing you to upload code files (like `.py`, `.java`, `.cpp`, etc.) directly into the chat interface.

## 🧐 The Problem
By default, Google AI Studio only allows basic file types (like `.txt`, `.md`, images) to be uploaded as attachments. If you try to upload source code files (e.g., Python, Java, Kotlin), the system rejects them.

## 💡 The Solution
This script acts as a middleware between your browser and the AI Studio input box.
1. It intercepts **Drag & Drop** and **Paste** events.
2. It detects if the file extension is in the restricted list (e.g., `.py`).
3. It instantly renames the file to `.txt` (in memory) and sets the MIME type to `text/plain`.
4. It simulates a native paste event into the input box, tricking AI Studio into accepting the file as a valid text attachment.

## ✨ Features
*   **Drag & Drop Support**: Drag code files directly into the prompt text area.
*   **Clipboard Support**: Copy code files from your file manager and paste them (Ctrl+V) into the input box.
*   **Multi-file Support**: Supports uploading multiple files at once.
*   **Zero Delay**: Uses the browser's native `File` API for instant conversion without reading file content.

## 🛠️ Installation

1.  **Install Tampermonkey**:
    You need a userscript manager extension.
    *   [Chrome / Edge / Firefox / Safari](https://www.tampermonkey.net/)
2.  **Install the Script**:
    *   create a new script in Tampermonkey and copy the code into it.

## 📝 Supported Formats (Default)
The script is pre-configured to handle the following extensions:
*   `kt` (Kotlin)
*   `java`
*   `py` (Python)
*   `ts` (TypeScript)
*   `cpp`, `c`, `h`, `hpp` (C/C++)

> **Note**: You can easily add more formats by modifying the code.

## ⚙️ Configuration
To add more file types, open the script in the Tampermonkey editor and modify the `TARGET_EXTS` set:

```javascript
// Add 'rb' or 'go' to this list
const TARGET_EXTS = new Set(['kt', 'java', 'py', 'ts', 'cpp', 'c', 'h', 'hpp', 'rb', 'go']);
```

## ⚠️ Limitations
*   **"Upload File" Button**: The native "Upload" (+) button in the UI is **not** modified. You must use Drag & Drop or Paste (Ctrl+V) for this script to work.
    *   *Reason*: I personally find Drag & Drop much faster than browsing through file dialogs, and I haven't had the spare time to reverse-engineer the internal logic of the upload button.
    *   *Contribution*: If you are interested in fixing this, **Pull Requests are welcome!** 🤝

