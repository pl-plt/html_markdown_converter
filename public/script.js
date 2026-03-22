document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('html-input');
    const markdownOutput = document.getElementById('markdown-output');
    const convertBtn = document.getElementById('convert-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const htmlUpload = document.getElementById('html-upload');
    const downloadBtn = document.getElementById('download-btn');

    if (localStorage.getItem('htmlInput')) {
        htmlInput.value = localStorage.getItem('htmlInput');
    }
    if (localStorage.getItem('markdownOutput')) {
        markdownOutput.value = localStorage.getItem('markdownOutput');
    }

    const saveState = () => {
        localStorage.setItem('htmlInput', htmlInput.value);
        localStorage.setItem('markdownOutput', markdownOutput.value);
    };

    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });

    function extractCodeText(n) {
        let text = '';
        n.childNodes.forEach(c => {
            if (c.nodeType === 3) {
                text += c.nodeValue;
            } else if (c.nodeName === 'BR') {
                text += '\n';
            } else if (c.nodeName === 'DIV' || c.nodeName === 'P') {
                const inner = extractCodeText(c);
                text += inner;
                if (inner && !inner.endsWith('\n')) text += '\n';
            } else {
                text += extractCodeText(c);
            }
        });
        return text;
    }

    function preprocessHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('div.code-container').forEach(container => {
            const language = container.getAttribute('data-code-prettify') || '';
            const text = extractCodeText(container).trim();
            const pre = doc.createElement('pre');
            const code = doc.createElement('code');
            if (language) code.className = 'language-' + language;
            code.textContent = text; 
            pre.appendChild(code);
            container.parentNode.replaceChild(pre, container);
        });
        return doc.body.innerHTML;
    }

    const convert = () => {
        const html = htmlInput.value;
        if (!html.trim()) {
            markdownOutput.value = '';
            return;
        }
        
        try {
            const markdown = turndownService.turndown(preprocessHTML(html));
            markdownOutput.value = markdown;
            saveState();
        } catch (error) {
            console.error('Conversion error:', error);
            markdownOutput.value = 'Error converting HTML to Markdown.';
        }
    };

    convertBtn.addEventListener('click', convert);
    htmlInput.addEventListener('input', saveState);

    uploadBtn.addEventListener('click', () => {
        htmlUpload.click();
    });

    htmlUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            htmlInput.value = e.target.result;
            saveState();
        };
        reader.readAsText(file);
    });

    // Download functionality
    downloadBtn.addEventListener('click', () => {
        const markdown = markdownOutput.value;
        if (!markdown) return;

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.md';
        a.click();
        URL.revokeObjectURL(url);
    });
});