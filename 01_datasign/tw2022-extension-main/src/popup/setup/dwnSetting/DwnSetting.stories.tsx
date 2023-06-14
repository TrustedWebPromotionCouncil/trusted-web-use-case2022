import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { DwnSettingView } from "./DwnSetting.view";

export default {
  title: "yellow-lemon/Views/DwnSetting",
  component: DwnSettingView,
} as Meta;

const Template: Story<ComponentProps<typeof DwnSettingView>> = (args) => (
  <DwnSettingView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const SecondStory = Template.bind({});
SecondStory.args = { dwnLocation: "data-sign" };

export const ThirdStory = Template.bind({});
ThirdStory.args = {
  dwnLocation: "custom",
  dwnLocationURL: "https://dwn.costom.com",
};
