import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { ReInputPasswordView } from "./ReInputPassword.view";

export default {
  title: "yellow-lemon/Views/ReInputPassword",
  component: ReInputPasswordView,
} as Meta;

const Template: Story<ComponentProps<typeof ReInputPasswordView>> = (args) => (
  <ReInputPasswordView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const SecondStory = Template.bind({});
SecondStory.args = { error: "パスワードが違います" };
