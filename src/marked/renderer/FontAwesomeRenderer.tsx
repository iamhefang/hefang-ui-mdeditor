import {Renderer} from "marked";
import * as katex from "katex"

export class FontAwesomeRenderer extends Renderer {
    text(text: string): string {
        return text
            .replace(/:(fa|fab|far|fas) ([a-z0-9\-]*?):/ig, '<i class="$1 fa-$2"></i>')
    }

    code(code: string, language: string, isEscaped: boolean) {
        if (!code.trim()) return code;
        if (language === 'katex') {
            return `<p class="text-center">${katex.renderToString(code)}</p>`
        }
        code = code.replace(/>/g, '&gt;').replace(/</g, '&lt;');
        return `<pre class="prettyprint linenums"><code class="language-${language}">${code}</code></pre>`;
    }
}