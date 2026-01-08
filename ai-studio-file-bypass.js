// ==UserScript==
// @name         AI Studio文件类型限制绕过
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  AI Studio文件类型限制绕过
// @author       xian
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // 配置：需要处理的后缀名 (使用 Set 提高查询效率)
    const TARGET_EXTS = new Set(['kt', 'java', 'py', 'ts', 'cpp', 'c', 'h', 'hpp']);

    console.log("🚀 AI Studio File Bypass 已加载");

    /**
     * 同步转换文件对象 (无需 FileReader，直接利用 Blob 特性)
     * @param {File} file 原文件
     * @returns {File} 伪装成 txt 的新文件
     */
    function convertToTxt(file) {
        // 直接使用原文件的 slice (即自身) 创建新 File，零内存开销，无需读取内容
        return new File([file], `${file.name}.txt`, { type: 'text/plain' });
    }

    /**
     * 查找输入框，优先获取当前焦点元素
     */
    function findInput() {
        const active = document.activeElement;
        // 如果当前焦点是输入框，直接返回
        if (active && (active.tagName === 'TEXTAREA' || active.isContentEditable)) {
            return active;
        }
        // 否则尝试通过选择器查找
        return document.querySelector('textarea[placeholder*="prompt"]') ||
               document.querySelector('[contenteditable="true"]') ||
               document.querySelector('textarea');
    }

    /**
     * 模拟粘贴操作
     * @param {File} file
     */
    function simulatePaste(file) {
        const input = findInput();
        if (!input) return console.warn("❌ 未找到输入框");

        input.focus();
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: dataTransfer
        });

        input.dispatchEvent(pasteEvent);
        console.log(`📋 已发送: ${file.name}`);
    }

    /**
     * 核心处理逻辑
     * @param {Event} e 事件对象
     * @param {FileList} fileList 文件列表
     */
    async function handleFiles(e, fileList) {
        if (!fileList || fileList.length === 0) return;

        const files = Array.from(fileList);
        // 筛选出不支持的文件
        const unsupported = files.filter(f => {
            const ext = f.name.split('.').pop().toLowerCase();
            return TARGET_EXTS.has(ext);
        });

        if (unsupported.length > 0) {
            e.preventDefault();
            e.stopPropagation(); // 阻止冒泡，防止重复触发

            console.log(`🛠️ 检测到 ${unsupported.length} 个受限文件，开始转换...`);

            for (const file of unsupported) {
                const newFile = convertToTxt(file);
                simulatePaste(newFile);
                // 保留少量延迟以防止 UI 假死或粘贴顺序错乱
                await new Promise(r => setTimeout(r, 200));
            }
        }
    }

    // --- 事件监听 ---

    document.addEventListener('dragover', e => e.preventDefault());

    document.addEventListener('drop', e => {
        handleFiles(e, e.dataTransfer?.files);
    });

    document.addEventListener('paste', e => {
        // 确保是粘贴文件而不是文本
        if (e.clipboardData?.files?.length) {
            handleFiles(e, e.clipboardData.files);
        }
    });

})();