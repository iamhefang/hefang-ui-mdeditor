import * as React from "react";
import {RefObject} from "react";
import {Ace, edit} from "ace-builds";
import {execute, guid, isFunction, type, Types} from "hefang-js";
import "code-prettify/src/prettify.css"
import "github-markdown-css/github-markdown.css"
import {Dialog, Icon} from "hefang-ui-react";
import * as marked from "marked"
import {Renderer} from "marked"
import "code-prettify";
import "../index.css"
import {FontAwesomeRenderer} from "./marked/renderer/FontAwesomeRenderer";
import {toolsMap} from "./toolbars";

declare const PR;


export interface MarkdownEditorProps {
    id?: string
    showPreview?: boolean
    bindScroll?: boolean
    toolbar?: string[]
    onChange?: (html: string, markdown?: string) => void
    onPreviewVisibleChange?: (shown: boolean) => boolean | void
    value?: string
    theme?: string
    dialogConfirm?: typeof Dialog.confirm
    dialogAlert?: typeof Dialog.alert
}

export interface MarkdownEditorState {
    showPreview?: boolean
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
        bindScroll: true,
        theme: 'light',
        dialogConfirm: Dialog.confirm,
        dialogAlert: Dialog.alert
    };
    private ace: Ace.Editor;
    private renderer: Renderer = new FontAwesomeRenderer();
    private id: string;
    private silent: boolean = false;
    private refPreview: RefObject<HTMLDivElement> = React.createRef();

    constructor(props: MarkdownEditorProps) {
        super(props);
        this.id = props.id || guid();
        this.state = {
            showPreview: props.showPreview,
        };
    }

    private onChange = () => {
        const markdown = this.ace.getValue()
            , html = this.renderHtml(markdown);
        this.silent || execute(this.props.onChange, html, markdown);
    };

    public renderHtml = (markdown: string) => {
        const html = marked(markdown, {renderer: this.renderer});
        this.state.showPreview && (this.refPreview.current.innerHTML = html);
        PR.prettyPrint();
        return html;
    };

    componentDidMount() {
        this.ace = edit(`editor${this.id}`, {
            mode: 'ace/mode/markdown',
            theme: 'ace/theme/github'
        });
        this.ace.setValue(this.props.value || '');
        this.onChange();
        this.ace.clearSelection();
        this.ace.focus();
        this.ace.on("change", this.onChange)
    }

    componentWillReceiveProps(nextProps: MarkdownEditorProps) {
        this.setState({showPreview: nextProps.showPreview}, () => {
            this.renderHtml(this.ace.getValue())
        })
    }

    componentDidUpdate(preProps: MarkdownEditorProps) {
        if (this.ace && this.ace.getValue() !== this.props.value) {
            this.silent = true;
            const select = this.ace.getSelection().isEmpty();
            this.ace.setValue(this.props.value || '');
            select && this.ace.clearSelection();
            this.silent = false;
        }
    }


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
                {this.state.showPreview ?
                    <div className="flex-1 markdown-body"
                         ref={this.refPreview}/> : undefined}
            </div>
        </div>
    }
}
