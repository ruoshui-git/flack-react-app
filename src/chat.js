import React from 'react';
import TopAppBar, { TopAppBarFixedAdjust, TopAppBarRow, TopAppBarSection, TopAppBarIcon, TopAppBarTitle } from '@material/react-top-app-bar';
import Drawer, { DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle } from '@material/react-drawer';
import List, { ListItem, ListItemGraphic, ListItemText, ListDivider } from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';
import {
  // Body1,
  Body2,
  // Caption,
  // Headline1,
  // Headline2,
  // Headline3,
  // Headline4,
  Headline5,
  // Headline6,
  Overline,
  // Subtitle1,
  // Subtitle2,
} from '@material/react-typography';
import Fab from '@material/react-fab';
import { Snackbar } from '@material/react-snackbar';
import { Scrollbars } from 'react-custom-scrollbars';

import CreateChannel from './CreateChannel';
import ChatInput from './Editor';
import MessageList from './MessageList';

import { useMediaQuery } from './hooks';


function ChatApp(props) {

  // this is only used for modal drawer on small screen size
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedChannelIndex, setSelectedChannelIndex] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = React.useState(false);
  const [snackbarFailedOpen, setSnackbarFailedOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const drawerEl = React.useRef(null);

  const addMessage = message => {
    setMessages(messages.concat(message));
  }

  let isSmallScreen = useMediaQuery("(max-width: 900px)", (matches) => {

    if (matches) {
      // on small screen, set modal to closed on default
      setSidebarOpen(false);
    } else {
      // when switching to large screen, this class has to be removed from 'aside' in order to display correctly
      drawerEl.current.classList.remove('mdc-drawer--open');
    }
  });

  const channels = generateChannels(30);

  let appDrawerContent = (
    <>
      <DrawerHeader>
        <DrawerTitle tag={Headline5}>{props.username}</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <CreateChannel isDialogOpen={dialogOpen} setDialogOpen={setDialogOpen} onSuccess={() => {
          setSnackbarSuccessOpen(true);
        }} 
          onError={() => {
            setSnackbarFailedOpen(true);
          }}
        />
        <Fab className='add-channel_fab' icon={<MaterialIcon icon="add" />} onClick={() => setDialogOpen(true)} />
        <Scrollbars autoHide autoHideTimeout={500} autoHideDuration={200}>
          <Overline className='channel-container-text'>Channels</Overline>
          <ListDivider tag='div' />
          {
            channels.length === 0 ?
              <Body2 className='channel-container-text'>No channels to display</Body2>
              :
              <List singleSelection selectedIndex={selectedChannelIndex} handleSelect={index => setSelectedChannelIndex(index)}>
                {
                  channels.map((channel, i) => {
                    return (
                      <ListItem key={channel.id}>
                        <ListItemGraphic graphic={<MaterialIcon icon={selectedChannelIndex === i ? 'chat' : 'chat_bubble_outline'} />} />
                        <ListItemText primaryText={channel.name} />
                      </ListItem>
                    )
                  })
                }
              </List>
          }

        </Scrollbars>
      </DrawerContent>
    </>
  );

  let drawer;
  if (isSmallScreen) {
    drawer = (
      <Drawer
        modal
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        innerRef={drawerEl}
      >
        {appDrawerContent}
      </Drawer>
    );
  } else {
    drawer = (
      <Drawer
        // open={open}
        innerRef={drawerEl}
      >
        {appDrawerContent}
      </Drawer>
    );
  }


  return (
    <div className='drawer-container'>

      {drawer}

      <DrawerAppContent className='drawer-app-content'>
        <TopAppBar>
          <TopAppBarRow>
            <TopAppBarSection align='start'>
              {
                isSmallScreen &&
                <TopAppBarIcon navIcon tabIndex={0}>
                  <MaterialIcon hasRipple icon='menu' onClick={() => setSidebarOpen(true)} />
                </TopAppBarIcon>
              }
              <TopAppBarTitle>{channels.length ?
                channels[selectedChannelIndex].name : 'No available channels'}
              </TopAppBarTitle>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust className='chat-app'>
          <MessageList messages={messages} />
          <ChatInput addMessage={addMessage} />
          <Snackbar 
          open={snackbarSuccessOpen} 
          onClose={
            () => {
              setSnackbarSuccessOpen(false);
            }
          } 
          message='Channel created' 
          actionText='dismiss' />
          <Snackbar 
          open={snackbarFailedOpen} 
          onClose={
            () => {
              setSnackbarFailedOpen(false);
            }
          } 
          message="Can't create channel"
          actionText='Retry' 
          />
        </TopAppBarFixedAdjust>
      </DrawerAppContent>
    </div>
  );
}

function generateChannels(num) {
  let channels = [];
  for (let i = 0; i < num; i++) {
    channels.push({
      name: `channel ${i}`,
      id: i,
    });
  }
  return channels;
}

export default ChatApp;