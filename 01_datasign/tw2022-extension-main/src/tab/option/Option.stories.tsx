import React, { ComponentProps } from "react";
import { Meta, Story } from "@storybook/react";

import { OptionView } from "./Option.view";

export default {
  title: "yellow-lemon/Views/OptionView",
  component: OptionView,
} as Meta;

const Template: Story<ComponentProps<typeof OptionView>> = (args) => (
  <OptionView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  setting: {
    reCaptchaSiteHost: "https://site.re-chaptcha.com",
    reCaptchaApiHost: "https://api.re-chaptcha.com",
    accessLogTargetDid:
      "did:ion:EiAitvVc6ZZUQEA2B7gZHi0cSXXpjGiHuv00tCmrGH9dGQ",
  },
};
