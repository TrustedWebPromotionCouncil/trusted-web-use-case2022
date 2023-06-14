import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { EmailOfferRequestView } from "./EmailOfferRequest.view";

export default {
  title: "yellow-lemon/Views/EmailOfferRequest",
  component: EmailOfferRequestView,
} as Meta;

const Template: Story<ComponentProps<typeof EmailOfferRequestView>> = (
  args
) => <EmailOfferRequestView {...args} />;

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const SecondStory = Template.bind({});
SecondStory.args = { error: "ブンシンメールアドレスの取得上限に達しています" };
