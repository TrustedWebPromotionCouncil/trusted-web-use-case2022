import { Meta, Story } from "@storybook/react/types-6-0";

import { Login as Component } from "./Login";

export default {
  title: "Organisms/Login",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const Login = Template.bind({});
Login.args = {};
