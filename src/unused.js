function Sidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Drawer modal open={open} onClose={() => setOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>My Channels</DrawerTitle>
        </DrawerHeader>

        <DrawerContent>
          <List>
            <ListItem>
              <ListItemGraphic icon="inbox" />
              <ListItemText>
                <ListItemPrimaryText>
                  Inbox
                </ListItemPrimaryText>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemGraphic icon='send' />
              <ListItemText>
                <ListItemPrimaryText>
                  Outgoing
                </ListItemPrimaryText>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemGraphic icon='drafts' />
              <ListItemText>
                <ListItemPrimaryText>
                  Drafts
                </ListItemPrimaryText>
              </ListItemText>
            </ListItem>
          </List>
        </DrawerContent>
      </Drawer>

      <DrawerAppContent>
        App Content
        <Button onClick={() => setOpen(!open)} raised>
          Toggle Dismissible
        </Button>
      </DrawerAppContent>

    </>
  );
}