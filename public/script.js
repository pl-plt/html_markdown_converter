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

    turndownService.addRule('codeContainer', {
        filter: function (node) {
            return node.nodeName === 'DIV' && node.classList.contains('code-container');
        },
        replacement: function (content, node) {
            const language = node.getAttribute('data-code-prettify') || '';
            
            function getText(n) {
                let text = '';
                n.childNodes.forEach(c => {
                    if (c.nodeType === 3) { // Text node
                        text += c.nodeValue;
                    } else if (c.nodeName === 'BR') {
                        text += '\n';
                    } else {
                        text += getText(c);
                    }
                });
                return text;
            }

            return '\n```' + language + '\n' + getText(node).trim() + '\n```\n';
        }
    });

    const convert = () => {
        const html = htmlInput.value;
        if (!html.trim()) {
            markdownOutput.value = '';
            return;
        }
        
        try {
            const markdown = turndownService.turndown(html);
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