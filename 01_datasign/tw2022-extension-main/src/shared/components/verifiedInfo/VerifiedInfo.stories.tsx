import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { VerifiedInfo } from "./VerifiedInfo";

export default {
  title: "yellow-lemon/Components/VerifiedInfo",
  component: VerifiedInfo,
} as Meta;

const Template: Story<ComponentProps<typeof VerifiedInfo>> = (args) => (
  <VerifiedInfo {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = { verified: true };

export const SecondStory = Template.bind({});
SecondStory.args = { verified: false };

export const ThirdStory = Template.bind({});
ThirdStory.args = { verified: true, infoName: "組織" };

export const ForthStory = Template.bind({});
ForthStory.args = {
  verified: true,
  okStatement: "この組織は認証を受けています",
};

export const FifthStory = Template.bind({});
FifthStory.args = {
  verified: true,
  noStatement: true,
};
