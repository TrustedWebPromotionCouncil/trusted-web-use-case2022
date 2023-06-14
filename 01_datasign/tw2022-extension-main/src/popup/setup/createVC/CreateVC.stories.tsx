import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { CreateVCView } from "./CreateVC.view";

export default {
  title: "yellow-lemon/Views/CreateVC",
  component: CreateVCView,
} as Meta;

const Template: Story<ComponentProps<typeof CreateVCView>> = (args) => (
    <CreateVCView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
