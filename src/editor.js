import React from 'react';
import Editor from 'draft-js-plugins-editor';
import { EditorState, RichUtils } from 'draft-js';

// import plugins
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
// import createMarkdownPlugin from 'draft-js-markdown-plugin';
import { ItalicButton, BoldButton, UnderlineButton, CodeButton } from 'draft-js-buttons';

// import styles
import "draft-js-static-toolbar-plugin/lib/plugin.css";

// make plugins
const staticToolbarPlugin = createToolbarPlugin({
    structure: [
        BoldButton,
        ItalicButton,
        UnderlineButton,
        CodeButton,
    ]
});

const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

function ChatInput() {
    const [editorState, setEditorState] = React.useState(
        EditorState.createEmpty()
    );
    const [hasFocus, setFocus] = React.useState(true);

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const editor = React.useRef(null);

    const focusEditor = () => {
        editor.current.focus();
        setFocus(true);
    };

    React.useEffect(() => {
        focusEditor();
    }, []);

    return (
            <div className={`editor-container ${hasFocus?'editor_focused':''}`} onClick={focusEditor}>
                <Editor
                    ref={editor}
                    editorState={editorState}
                    onChange={newState => setEditorState(newState)}
                    handleKeyCommand={handleKeyCommand}
                    onBlur={() => setFocus(false)}
                    onFocus={() => setFocus(true)}
                    plugins={plugins}
                    placeholder='say something...'
                />
                <Toolbar />
            </div>
    );
}

export default ChatInput;