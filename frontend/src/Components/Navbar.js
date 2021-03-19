import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Menu, Icon } from "semantic-ui-react";
import AuthContext from "../context/AuthContext";

const Navbar = (props) => {
  const [activeItem, setActiveItem] = useState("My Tickets");
  const { handleLogout, currentUser } = useContext(AuthContext);

  const handleItemClick = (name) => {
    setActiveItem(name);
  };

  const nonAuthMarkUp = () => {
    return (
      <div>
        <Menu pointing secondary>
          <Menu.Menu position="right">
            <Link to="/login">
              <Menu.Item
                icon="user"
                iconposition="left"
                name="Login"
                active={activeItem === "Login"}
                onClick={() => handleItemClick("Login")}
              />
            </Link>
          </Menu.Menu>
        </Menu>
      </div>
    );
  };

  if (!currentUser) return nonAuthMarkUp();

  return (
    <div>
      <Menu pointing secondary>
        <Dropdown item icon="plus" simple>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Icon name="dropdown" />
              <span className="text">New</span>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/newTicket">
                    <Icon name="file alternate outline" />
                    Ticket
                  </Link>
                </Dropdown.Item>
                {currentUser.isadmin && (
                  <Dropdown.Item>
                    <Link to="/newUser">
                      <Icon name="user" />
                      User
                    </Link>
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
        <Link to="/tickets">
          <Menu.Item
            name="My Tickets"
            active={activeItem === "My Tickets"}
            onClick={() => handleItemClick("My Tickets")}
          />
        </Link>

        <Link to="/group">
          <Menu.Item
            name="Group Tickets"
            active={activeItem === "Group Tickets"}
            onClick={() => handleItemClick("Group Tickets")}
          />
        </Link>

        <Link to="/recent">
          <Menu.Item
            name="Recent Tickets"
            active={activeItem === "Recent Tickets"}
            onClick={() => handleItemClick("Recent Tickets")}
          />
        </Link>

        <Link to="/search">
          <Menu.Item
            name="Search Tickets"
            icon="search"
            iconposition="left"
            active={activeItem === "Search Tickets"}
            onClick={() => handleItemClick("Search Tickets")}
          />
        </Link>
        {
          currentUser.isadmin && (
          <Link to="/users">
            <Menu.Item
              icon="users"
              iconposition="left" 
              name="Users"
              active={activeItem === 'Users'}
              onClick={() => handleItemClick('Users')}
            />
          </Link>
          )}
        <Menu.Menu position="right">
          <Menu.Item
            name="logout"
            icon="user"
            iconposition="left"
            active={activeItem === "logout"}
            onClick={handleLogout}
          />
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default Navbar;
