import { Meta, Story } from "@storybook/react/types-6-0";

import { LoginTemplate as Component } from "./Login";

export default {
  title: "Templates/Login",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const Login = Template.bind({});
Login.args = {};
