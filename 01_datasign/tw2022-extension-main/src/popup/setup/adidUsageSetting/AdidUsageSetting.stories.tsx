import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { AdidUsageSettingView } from "./AdidUsageSetting.view";

export default {
  title: "yellow-lemon/Views/AdidUsageSetting",
  component: AdidUsageSettingView,
} as Meta;

const Template: Story<ComponentProps<typeof AdidUsageSettingView>> = (args) => (
  <AdidUsageSettingView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = { adIdUsage: [] };
