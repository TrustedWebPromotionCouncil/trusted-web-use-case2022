import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { Header } from "./Header";

export default {
  title: "yellow-lemon/Components/Header",
  component: Header,
} as Meta;

const Template: Story<ComponentProps<typeof Header>> = (args) => (
  <Header {...args} />
);

export const Header1 = Template.bind({});
Header1.args = { title: "タイトル" };
