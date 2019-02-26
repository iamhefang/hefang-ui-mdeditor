import * as React from "react";
import {Ace, edit} from "ace-builds";
import {execute, extend, guid, isFunction, repeat, type, Types} from "hefang-js";
import "code-prettify/src/prettify.css"
import "github-markdown-css/github-markdown.css"
import {Icon} from "hefang-ui-react";
import * as marked from "marked"
import "code-prettify";
import "../index.css"
import {FontAwesomeRenderer} from "./marked/renderer/FontAwesomeRenderer";
import {toolsMap} from "./toolbars";

declare const PR;


export interface MarkdownEditorProps {
    id?: string
    showPreview?: boolean
    toolbar?: string[]
    onChange?: (html: string, markdown?: string) => void
    defaultValue?: string
}

export interface MarkdownEditorState {
    showPreview?: boolean
    html?: string,
    markdown?: string
}

export class MarkdownEditor extends React.Component<MarkdownEditorProps, MarkdownEditorState> {
    private static readonly defaultProps: MarkdownEditorProps = {
        showPreview: true,
        toolbar: [
            'undo', 'redo', '|',
            'bold', 'italic', 'strikethrough', 'quote', '|',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '|',
            'list-ol', 'list-ul', 'line', '|',
            'link', 'table', 'image', '|',
            'code', 'code-block', 'clock', 'fontawesome', 'clean', '|',
            'preview', 'help', 'about'
        ],
    };
    private ace: Ace.Editor;
    private id: string;

    constructor(props: MarkdownEditorProps) {
        super(props);
        this.id = props.id || guid();
        this.state = {
            showPreview: props.showPreview,
            html: '',
            markdown: ''
        };
    }

    componentDidMount() {
        this.ace = edit(`editor${this.id}`, {
            mode: 'ace/mode/markdown',
            theme: 'ace/theme/github',
        });
        if (this.props.defaultValue) {
            this.ace.setValue(this.props.defaultValue);
            this.renderHtml();
            this.ace.clearSelection();
            this.ace.focus();
        }
        this.ace.on("change", () => this.renderHtml())
    }

    private renderHtml = (state: MarkdownEditorState = null) => {
        const markdown = this.ace.getValue();
        let html = marked(markdown, {renderer: new FontAwesomeRenderer()});
        html = html.replace(/<pre>/ig, '<pre class="prettyprint linenums">');
        execute(this.props.onChange, html, markdown);
        this.setState(extend(true, {}, state || {}, {html, markdown}), () => {
            this.state.showPreview && PR.prettyPrint()
        });
    };
    private insertHeading = (level: number) => {
        const pos = this.ace.getCursorPosition();
        pos.column = 0;
        this.ace.getSession().insert(pos, repeat('#', level) + ' ');
        this.ace.focus();
    };
    private renderToolbar = () => {
        return this.props.toolbar.map(id => {
            if (id === '|') {
                return <span className='toolbar-decollator'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            } else if (id === '\\') {
                return <br/>
            } else if (id in toolsMap) {
                const tool = toolsMap[id];
                let icon = tool.icon;
                if (type(icon) === Types.String) {
                    icon = <Icon name={icon as string}/>
                } else if (isFunction(icon)) {
                    icon = execute(icon, this);
                }
                return <button title={isFunction(tool.name) ? execute(tool.name, this) : tool.name} onClick={e => {
                    execute(tool.action, this, this.ace);
                }}><span className='toolbar-icon'>{icon}</span></button>
            } else {
                return undefined;
            }
        });
    };

    render() {
        return <div className='markdown-editor display-flex-column'>
            <div className='markdown-editor-toolbar'>
                {this.renderToolbar()}
            </div>
            <div className='flex-1 display-flex-row'>
                <div id={`editor${this.id}`} className='flex-1 markdown-editor-ace'/>
                {this.state.showPreview ? <div className="flex-1 markdown-body"
                                               dangerouslySetInnerHTML={{__html: this.state.html}}/> : undefined}
            </div>
        </div>
    }
}
