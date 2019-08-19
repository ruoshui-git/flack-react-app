import React from 'react';
import Card from "@material/react-card";

import {
    Body1,
    Body2,
    // Caption,
    // Headline1,
    // Headline2,
    Headline3,
    // Headline4,
    // Headline5,
    // Headline6,
    // Overline,
    // Subtitle1,
    // Subtitle2,
} from '@material/react-typography';

import TextField, { HelperText, Input, CharacterCounter } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

import Button from '@material/react-button';

import UsernameStore from './localStorage';

function Welcome(props) {
    const [name, setName] = React.useState('');
    const [isValid, setIsValid] = React.useState(true);
    const handleInputChange = e => {
        let username = e.currentTarget.value;

        setIsValid(isUsernameValid(username));
        setName(username);
    }
    const handleSubmit = e => {
        e.preventDefault();

        // Prevent user from submitting empty username
        let valid = isUsernameValid(name);
        setIsValid(valid);
        if (!valid) return false;

        // logic for storing username
        UsernameStore.setUsername(name);
        props.setUsername(name);
    }

    const renderHelperText = () => {
        if (isValid) {
            return (<HelperText>Please enter your username</HelperText>)
        } else {
            return (
                <HelperText
                    isValid={isValid}
                    isValidationMessage
                    validation
                >
                    {name.length === 0? 
                    'Username can\'t be empty' :
                        'Must not contain space'
                    }
                </HelperText>
            );
        }
    }
    return (
        <Card className='welcome-card'>
            <Headline3 className='welcome-title'>Welcome to Flack</Headline3>
            <main>
                <Body1>
                    This is a toy version of an online messaging service, similar in spirit to Slack. You can create, join, and communicate in channels (chatrooms).
                </Body1>
                <Body1>
                    To get started, enter your username below and click "GO!"
                </Body1>

                <StorageStatus />

                <form className='username-field' onSubmit={handleSubmit}>
                    <div>
                        <TextField
                            label='Username'
                            outlined
                            leadingIcon={<MaterialIcon icon='face' />}
                            name='username'
                            helperText={renderHelperText()}
                            characterCounter={<CharacterCounter />}

                        >
                            <Input
                                value={name}
                                onChange={handleInputChange}
                                maxLength={20}
                                isValid={isValid}
                            />
                        </TextField>
                    </div>
                    <Button
                        type='submit'
                        outlined
                    >GO!</Button>
                </form>
            </main>
        </Card>
    );
}

function StorageStatus() {
    if (UsernameStore.isAvailable) {
        return (
            <Body2>
                Your browser supports localStorage, so your username will be stored across browser sessions.
            </Body2>
        );
    } else {
        return (
            <Body2>
                Your browser doesn't seem to support localStorage, so your username will not be stored across browser sessions.
            </Body2>
        );
    }
}


function isUsernameValid(username) {
    // username should not include space
    return !(username.length === 0 || (username.includes(' ')));
}

export default Welcome;