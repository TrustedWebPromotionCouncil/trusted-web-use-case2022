import React, { ComponentProps } from "react";
import { Meta, Story } from "@storybook/react";

import { BlockingSettingView } from "./BlockingSetting.view";

export default {
  title: "yellow-lemon/Views/BlockingSettingView",
  component: BlockingSettingView,
} as Meta;

const Template: Story<ComponentProps<typeof BlockingSettingView>> = (args) => (
  <BlockingSettingView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  rules: [
    {
      id: 1,
      priority: 1,
      action: {
        type: "block" as chrome.declarativeNetRequest.RuleActionType.BLOCK,
      },
      condition: {
        urlFilter: "www.example.com",
        excludedTabIds: [1],
      },
    },
    {
      id: 2,
      priority: 1,
      action: {
        type: "allow" as chrome.declarativeNetRequest.RuleActionType.ALLOW,
      },
      condition: {
        urlFilter: "www.example.com",
        excludedTabIds: [1],
      },
    },
  ],
};
