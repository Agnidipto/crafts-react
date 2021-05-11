import React from "react";
import { Icon, Menu, Sidebar, Rail, Sticky } from "semantic-ui-react";

function AppSidebar(props) {
  return (
    <Sidebar
      as={Menu}
      animation='overlay'
      icon='labeled'
      inverted
      onHide={props.onHide}
      vertical
      visible={props.visible}
      width='thin'
      style={{ position: "fixed" }}
    >
      <Menu.Item as='a'>
        <Icon name='home' />
        Home
      </Menu.Item>
      <Menu.Item as='a'>
        <Icon name='gamepad' />
        Games
      </Menu.Item>
      <Menu.Item as='a'>
        <Icon name='camera' />
        Channels
      </Menu.Item>
    </Sidebar>
  );
}

export default AppSidebar;
