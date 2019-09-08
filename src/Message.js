import React from 'react';
import { Editor, EditorState } from 'draft-js';
import {
    // Body1,
    // Body2,
    Caption,
    // Headline1,
    // Headline2,
    // Headline3,
    // Headline4,
    // Headline5,
    // Headline6,
    // Overline,
    // Subtitle1,
    // Subtitle2,
} from '@material/react-typography';
import Card from '@material/react-card';

import ReactTooltip from 'react-tooltip';

const dateFormat = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric'
}

export default function Message(props) {
    const message = props.message;
    message.timeString = new Intl.DateTimeFormat('en-US', dateFormat).format(message.timestamp);
    // console.log(message);
    return (
        <div className={`message ${message.fromMe ? 'from-me' : ''}`} >
            <Caption className='username'>
                {message.username}
            </Caption>
            <Card className='message-body' data-tip data-for={`message-${props.id}`}>
                <Editor
                    readOnly
                    editorState={EditorState.createWithContent(message.content)}
                />
            </Card>
            <ReactTooltip id={`message-${props.id}`} place={message.fromMe? 'left':'right'} type="dark" effect="solid">
                <span>{`${message.username} on ${message.timeString}`}</span>
            </ReactTooltip>
        </div>
    );
}