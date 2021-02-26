import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const Navbar = props => {
  const [activeItem, setActiveItem] = useState('My Tickets');
  const handleItemClick = (name) => {
    setActiveItem(name)
  };

  return (
    <div>
      <Menu pointing secondary>
        <Link to="/mine">
          <Menu.Item
            name='My Tickets'
            active={activeItem === 'My Tickets'}
            onClick={() => handleItemClick('My Tickets')}
          />
        </Link>
        <Link to="/group">
          <Menu.Item
            name='Group Tickets'
            active={activeItem === 'Group Tickets'}
            onClick={() => handleItemClick('Group Tickets')}
          />
        </Link>
        <Link to="/recent">
          <Menu.Item
            name='Recent Tickets'
            active={activeItem === 'Recent Tickets'}
            onClick={() => handleItemClick('Recent Tickets')}
          />
        </Link>
        <Link to="/search">
          <Menu.Item
            name='Search Tickets'
            active={activeItem === 'Search Tickets'}
            onClick={() => handleItemClick('Search Tickets')}
          />
        </Link>

        <Menu.Menu position='right'>
          <Menu.Item
            name="logout"
            active={activeItem === 'logout'}
            onClick={() => handleItemClick('logout')}
          />
        </Menu.Menu>
      </Menu>
    </div>
  )
}

export default Navbar;