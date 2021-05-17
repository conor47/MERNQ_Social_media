import React, { useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";

// we imported this MenuBar component from semantic-ui react library. It was initially a class based component
// so we had to convert it to a functional component

function MenuBar() {
  // we will be using the authorization context to display custom information related to a specific user

  const { user, logout } = useContext(AuthContext);

  //   we will get the pathname from the window object to find out which page the user is currently viewing.
  //   we will use this to configure which link is highlighted

  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  // We will use the context to check if a user is logged in. If they are we return a different Menubar.
  // If there is no user logged in then we return the base Menubar.

  const menuBar = user ? (
    <Menu pointing secondar size="massive" color="teal">
      <Menu.Item name={user.username} active as={Link} to={"/"} />

      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondar size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to={"/"}
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to={"/login"}
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to={"/register"}
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
