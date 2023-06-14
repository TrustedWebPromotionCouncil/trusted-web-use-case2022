import { Meta, Story } from "@storybook/react/types-6-0";

import { Credentials as Component } from "./Credentials";

export default {
  title: "Organisms/Credentials",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const Credentials = Template.bind({});
Credentials.args = {};
