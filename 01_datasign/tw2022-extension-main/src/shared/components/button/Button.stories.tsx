import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { Button } from "./Button";

export default {
  title: "yellow-lemon/Components/Button",
  component: Button,
} as Meta;

const Template: Story<ComponentProps<typeof Button>> = (args) => (
    <Button {...args}>ボタン</Button>
);

export const Button1 = Template.bind({});
