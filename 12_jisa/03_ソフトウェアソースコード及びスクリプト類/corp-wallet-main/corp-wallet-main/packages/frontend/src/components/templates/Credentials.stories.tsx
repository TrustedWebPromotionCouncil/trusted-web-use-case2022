import { Meta, Story } from "@storybook/react/types-6-0";

import { HomeTemplate as Component } from "./Home";

export default {
  title: "Templates/Credentials",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const Credentials = Template.bind({});
Credentials.args = {};
