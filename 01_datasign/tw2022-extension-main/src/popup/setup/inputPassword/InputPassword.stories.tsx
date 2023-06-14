import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { InputPasswordView } from "./InputPassword.view";

export default {
  title: "yellow-lemon/Views/InputPassword",
  component: InputPasswordView,
} as Meta;

const Template: Story<ComponentProps<typeof InputPasswordView>> = (args) => (
    <InputPasswordView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
