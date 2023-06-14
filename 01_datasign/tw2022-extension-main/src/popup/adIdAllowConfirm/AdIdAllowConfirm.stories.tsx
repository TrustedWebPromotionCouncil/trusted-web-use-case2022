import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { AdIdAllowConfirmView } from "./AdIdAllowConfirm.view";
import { AdUsage } from "../../store/types";

export default {
  title: "yellow-lemon/Views/AdidAllowConfirm",
  component: AdIdAllowConfirmView,
} as Meta;

const Template: Story<ComponentProps<typeof AdIdAllowConfirmView>> = (args) => (
  <AdIdAllowConfirmView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
