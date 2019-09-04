import React from 'react';
import Message from './Message';
import { Scrollbars } from 'react-custom-scrollbars';

export default function MessageList(props) {
    const scrollbarEl = React.useRef(null);

    React.useEffect(() => {
        scrollbarEl.current.scrollToBottom();
    });

    return (
        <div className='message-list'>
            <Scrollbars ref={scrollbarEl} autoHide autoHideTimeout={500} autoHideDuration={200}>
                {
                    props.messages.map((message, i) => {
                        return <Message key={i} id={i} message={message} />;
                    })
                }
            </Scrollbars>
        </div>
    );
}