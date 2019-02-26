import {Renderer} from "marked";

export class FontAwesomeRenderer extends Renderer {
    text(text: string): string {
        return text.replace(/:(fa|fab|far|fas) ([a-z0-9\-]*?):/ig, '<i class="$1 fa-$2"></i>');
    }
}