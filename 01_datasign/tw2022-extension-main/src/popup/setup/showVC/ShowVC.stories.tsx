import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { ShowVCView } from "./ShowVC.view";

export default {
  title: "yellow-lemon/Views/ShowVC",
  component: ShowVCView,
} as Meta;

const Template: Story<ComponentProps<typeof ShowVCView>> = (args) => (
    <ShowVCView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
