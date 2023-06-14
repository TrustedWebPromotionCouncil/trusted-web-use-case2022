import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { AdidTypeSettingView } from "./AdidTypeSetting.view";

export default {
  title: "yellow-lemon/Views/AdidTypeSetting",
  component: AdidTypeSettingView,
} as Meta;

const Template: Story<ComponentProps<typeof AdidTypeSettingView>> = (args) => (
    <AdidTypeSettingView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
