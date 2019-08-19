import React from 'react';
import TopAppBar, { TopAppBarFixedAdjust, TopAppBarRow, TopAppBarSection, TopAppBarIcon, TopAppBarTitle } from '@material/react-top-app-bar';
import Drawer, { DrawerAppContent, DrawerContent, DrawerHeader, DrawerTitle } from '@material/react-drawer';
import List, { ListItem, ListItemGraphic, ListItemText, ListDivider } from '@material/react-list';
import MaterialIcon from '@material/react-material-icon';
import {
  Body1,
  Body2,
  Caption,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
  Overline,
  Subtitle1,
  Subtitle2,
} from '@material/react-typography';
import Fab from '@material/react-fab';

import { Scrollbars } from 'react-custom-scrollbars';

import { useMediaQuery } from './hooks';

import ChatInput from './editor';

function ChatApp(props) {

  // this is only used for modal drawer on small screen size
  const [open, setOpen] = React.useState(false);
  const [selectedChannelIndex, setSelectedChannelIndex] = React.useState(0);
  const drawerEl = React.useRef(null);

  let isSmallScreen = useMediaQuery("(max-width: 900px)", (matches) => {
    
    if (matches) {
      // on small screen, set modal to closed on default
      setOpen(false);
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
        <Fab className='add-channel_fab' icon={<MaterialIcon icon="add" />} />
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
        open={open}
        onClose={() => setOpen(false)}
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
                  <MaterialIcon hasRipple icon='menu' onClick={() => setOpen(true)} />
                </TopAppBarIcon>
              }
              <TopAppBarTitle>{channels.length ?
                channels[selectedChannelIndex].name : "No available channels"}
              </TopAppBarTitle>
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust className='chat-app'>
          <ChatMessages />
          <ChatInput />
        </TopAppBarFixedAdjust>
      </DrawerAppContent>
    </div>
  );
}

function ChatMessages(props) {
  return (
  
    <div className='chat-messages'></div>
  
  );
}

function generateChannels(num) {
  let channels = [];
  for (let i = 0; i < num; i++) {
    channels.push({
      name: `long long long long long long long klsjdflkjsaldkfj channel ${i}`,
      id: i,
    });
  }
  return channels;
}

export default ChatApp;