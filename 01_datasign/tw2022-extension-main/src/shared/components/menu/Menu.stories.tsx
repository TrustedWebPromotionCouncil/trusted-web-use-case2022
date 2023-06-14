import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { Menu } from "./Menu";

export default {
  title: "yellow-lemon/Components/Menu",
  component: Menu,
} as Meta;

const Template: Story<ComponentProps<typeof Menu>> = (args) => (
  <Menu {...args} />
);

export const Menu1 = Template.bind({});
Menu1.args = { label: "メニュー１" };
