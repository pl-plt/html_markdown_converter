document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('html-input');
    const markdownOutput = document.getElementById('markdown-output');
    const convertBtn = document.getElementById('convert-btn');

    // Load saved state from localStorage
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

    // Initialize Turndown service
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
            
            // Helper to preserve newlines and handle <br>
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

    // Function to perform conversion
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

    // Event listeners
    convertBtn.addEventListener('click', convert);
    htmlInput.addEventListener('input', saveState);
    
    // Optional: Live conversion as you type (debounce could be added for performance)
    // htmlInput.addEventListener('input', convert);
});