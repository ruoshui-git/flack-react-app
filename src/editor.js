import React from 'react';
import Editor from 'draft-js-plugins-editor';
import { EditorState, RichUtils, convertToRaw } from 'draft-js';

import Button from '@material/react-button';

// import plugins
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
    SubButton,
    SupButton
} from 'draft-js-buttons';

import UsernameStore from './localStorage';

// import styles
import "draft-js-static-toolbar-plugin/lib/plugin.css";
import './editorStyles.css';

// make plugins
const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

const username = UsernameStore.getUsername();

export default function ChatInput(props) {
    const [editorState, setEditorState] = React.useState(
        EditorState.createEmpty()
    );
    // eslint-disable-next-line
    const [hasFocus, setFocus] = React.useState(true);

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const handleSubmit = e => {
        e.preventDefault();

        const content = editorState.getCurrentContent();
        const timestamp = new Date();
        const message = {
            username,
            content,
            timestamp
        }

        const rawMessage = { ...message, content: convertToRaw(content) };
        //TODO: emit message to socket

        //on Success:
        message.fromMe = true;
        props.addMessage(message);
        setEditorState(EditorState.createEmpty());
    }

    const editor = React.useRef(null);

    const focusEditor = () => {
        editor.current.focus();
        setFocus(true);
    };

    React.useEffect(() => {
        focusEditor();
    }, []);

    return (
        <div className='editor-container' onClick={focusEditor}>
            <Editor
                ref={editor}
                editorState={editorState}
                onChange={newState => setEditorState(newState)}
                handleKeyCommand={handleKeyCommand}
                onBlur={() => setFocus(false)}
                onFocus={() => setFocus(true)}
                plugins={plugins}
                placeholder='say something...'
                customStyleMap={{
                    SUBSCRIPT: { fontSize: '0.6em', verticalAlign: 'sub' },
                    SUPERSCRIPT: { fontSize: '0.6em', verticalAlign: 'super' }
                }}
                spellCheck
            />
            <Toolbar>
                {
                    (externalProps) => (
                        <>
                            <BoldButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <CodeButton {...externalProps} />
                            <Separator {...externalProps} />
                            <HeadlinesButton {...externalProps} />
                            <UnorderedListButton {...externalProps} />
                            <OrderedListButton {...externalProps} />
                            <BlockquoteButton {...externalProps} />
                            <CodeBlockButton {...externalProps} />
                            <Separator {...externalProps} />
                            <SubButton {...externalProps} />
                            <SupButton {...externalProps} />
                            <Separator {...externalProps} />
                            <Button type='submit' onClick={handleSubmit} dense>submit</Button>
                        </>
                    )
                }
            </Toolbar>
        </div>
    );
}

// https://www.draft-js-plugins.com/plugin/static-toolbar
function HeadlinesPicker(props) {

    const onWindowClick = () =>
        // Call `onOverrideContent` again with `undefined`
        // so the toolbar can show its regular content again.
        props.onOverrideContent(undefined);


    React.useEffect(() => {
        window.addEventListener('click', onWindowClick);

        return () => window.removeEventListener('click', onWindowClick);
    });

    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];

    return (
        <div>
            {buttons.map((Button, i) =>
                <Button key={i} {...props} />
            )}
        </div>
    );
}

function HeadlinesButton(props) {
    const onClick = () =>
        // A button can call `onOverrideContent` to replace the content
        // of the toolbar. This can be useful for displaying sub
        // menus or requesting additional information from the user.
        props.onOverrideContent(HeadlinesPicker);

    return (
        <div className='headlineButtonWrapper'>
            <button onClick={onClick} className='headlineButton'>
                H
            </button>
        </div>
    );
}