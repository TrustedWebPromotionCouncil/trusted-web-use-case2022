import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { SetupDoneView } from "./SetupDone.view";

export default {
  title: "yellow-lemon/Views/SetupDone",
  component: SetupDoneView,
} as Meta;

const Template: Story<ComponentProps<typeof SetupDoneView>> = (args) => (
    <SetupDoneView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
