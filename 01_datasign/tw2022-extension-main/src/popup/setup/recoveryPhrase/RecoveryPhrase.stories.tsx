import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { RecoveryPhraseView } from "./RecoveryPhrase.view";

export default {
  title: "yellow-lemon/Views/RecoveryPhrase",
  component: RecoveryPhraseView,
} as Meta;

const Template: Story<ComponentProps<typeof RecoveryPhraseView>> = (args) => (
    <RecoveryPhraseView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
