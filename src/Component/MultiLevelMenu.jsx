// MultiLevelMenu.js
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, ExpandLess, ExpandMore, Inbox as InboxIcon } from '@mui/icons-material';

const MultiLevelMenu = () => {
  const [open, setOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState({});
  
  const menuItems = [
    {
      title: 'Category 1',
      icon: <InboxIcon />,
      items: [
        { title: 'Option 1' },
        { title: 'Option 2' },
        { title: 'Option 3' },
      ],
    },
    {
      title: 'Category 2',
      icon: <InboxIcon />,
      items: [
        { title: 'Option 4' },
        { title: 'Option 5' },
      ],
    },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const handleNestedClick = (category) => {
    setNestedOpen((prevNestedOpen) => ({
      ...prevNestedOpen,
      [category]: !prevNestedOpen[category],
    }));
  };

  return (
    <div>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((menuItem) => (
              <div key={menuItem.title}>
                <ListItem button onClick={() => handleNestedClick(menuItem.title)}>
                  <ListItemIcon>
                    {menuItem.icon}
                  </ListItemIcon>
                  <ListItemText primary={menuItem.title} />
                  {nestedOpen[menuItem.title] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={nestedOpen[menuItem.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menuItem.items.map((subItem) => (
                      <ListItem key={subItem.title} button sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={subItem.title} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
          <Divider />
          {/* Add more nested lists or other items here if needed */}
        </div>
      </Drawer>
    </div>
  );
};

export default MultiLevelMenu;
