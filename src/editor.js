import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

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
            <div className={`chat-input editor-container ${hasFocus?'editor_focused':''}`} >
                <Editor
                    ref={editor}
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={handleKeyCommand}
                    onBlur={() => setFocus(false)}
                    onFocus={() => setFocus(true)}
                    placeholder='say something...'
                />
            </div>
    );
}

export default ChatInput;