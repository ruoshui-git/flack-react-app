import React from 'react';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from '@material/react-dialog';
import TextField, { HelperText, Input, CharacterCounter } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

function CreateChannel(props) {
  const [action, setAction] = React.useState('');
  const [channelName, setChannelName] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  const handleInputChange = e => {
    let name = e.currentTarget.value;
    setIsValid(isNameValid(name));
    setChannelName(name);
  }

  const renderHelperText = () => {
    if (isValid) {
      return (<HelperText>Enter a channel name</HelperText>)
    } else {
      return (
        <HelperText
          isValid={isValid}
          isValidationMessage
          validation
        >
          {channelName.length === 0 ?
            'Name can\'t be empty' :
            'Must not contain space'
          }
        </HelperText>
      );
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (action === 'dismiss' || channelName.length === 0) return false;

    let valid = isNameValid(channelName);
    setIsValid(valid);
    console.log("submitting: " + channelName);
    if (!valid) {
      props.onError();
      return false;
    }

    // channel creation mechanism
    console.log("channel created!");

    // TODO: add error-catching mechanism
    props.onSuccess();
    setChannelName('');
    setIsValid(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Dialog
        onClosing={action => {
          props.setDialogOpen(false);
          setAction(action);
        }}
        open={props.isDialogOpen}
        scrimClickAction=''
        role='dialog'
      >
        <DialogTitle>Create a new channel</DialogTitle>
        <DialogContent>
          <div id='channel-name__input--container'>
            <TextField
              label='Channel Name'
              outlined
              leadingIcon={<MaterialIcon icon='group_add' />}
              name='channelName'
              helperText={renderHelperText()}
              characterCounter={<CharacterCounter />}
            >
              <Input
                value={channelName}
                onChange={handleInputChange}
                maxLength={20}
                isValid={isValid}
                onKeyDown={
                  e => {
                    if (e.keyCode === 13) {
                      e.preventDefault();
                      // Optionally handle submit here
                    }
                  }
                }
              />
            </TextField>
          </div>
        </DialogContent>
        <DialogFooter>
          <DialogButton action='dismiss'>Cancel</DialogButton>
          <DialogButton action='submit' type='submit' disabled={!isValid || channelName.length === 0}>Create</DialogButton>
        </DialogFooter>
      </Dialog>
    </form>
  );
}

function isNameValid(name) {
  return !name.includes(' ');
  // return !(name.length === 0 || (name.includes(' ')));
}

export default CreateChannel;