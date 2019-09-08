import React from 'react';
import Editor from 'draft-js-plugins-editor';
import {
    EditorState,
    RichUtils,
    convertToRaw,
    ContentState,
    getDefaultKeyBinding,
    KeyBindingUtil,
    Modifier,
    SelectionState,
} from 'draft-js';


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

const { hasCommandModifier } = KeyBindingUtil;

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
    const [canSubmit, setCanSubmit] = React.useState(false);

    
    const handleSubmit = e => {
        e && e.preventDefault();

        if (!canSubmit) return;

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
        // const newState = EditorState.push(editorState, ContentState.createFromText(''), 'remove-range');



        const newState = clearEditorContent(editorState);
        // direct setEditorState doesn't work, probably because they are batched together and this one is ignored
        setTimeout(() => setEditorState(newState));
        setCanSubmit(false);
    }
    
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        if (command === 'submit') {
            handleSubmit();
            return 'handled';
        } 
        return 'not-handled';
    };

    const handleChange = newState => {
        setEditorState(newState);
        setCanSubmit(newState.getCurrentContent().hasText());
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
                onChange={handleChange}
                handleKeyCommand={handleKeyCommand}
                onBlur={() => setFocus(false)}
                onFocus={() => setFocus(true)}
                plugins={plugins}
                placeholder='say something...'
                customStyleMap={{
                    SUBSCRIPT: { fontSize: '0.6em', verticalAlign: 'sub' },
                    SUPERSCRIPT: { fontSize: '0.6em', verticalAlign: 'super' }
                }}
                keyBindingFn={handleSubmitKeyFn}
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
                            <Button type='submit' onClick={handleSubmit} dense disabled={!canSubmit}>submit</Button>
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

// https://github.com/jpuri/draftjs-utils/blob/master/js/block.js
function clearEditorContent(editorState) {
    const blocks = editorState
        .getCurrentContent()
        .getBlockMap()
        .toList();
    const updatedSelection = editorState.getSelection().merge({
        anchorKey: blocks.first().get("key"),
        anchorOffset: 0,
        focusKey: blocks.last().get("key"),
        focusOffset: blocks.last().getLength()
    });
    const newContentState = Modifier.removeRange(
        editorState.getCurrentContent(),
        updatedSelection,
        "forward"
    );
    return EditorState.push(editorState, newContentState, "remove-range");
}

function handleSubmitKeyFn(e) {
    if (e.keyCode === 13 /* `enter` key */ && hasCommandModifier(e)) {
        return 'submit';
    }
    return getDefaultKeyBinding(e);
}