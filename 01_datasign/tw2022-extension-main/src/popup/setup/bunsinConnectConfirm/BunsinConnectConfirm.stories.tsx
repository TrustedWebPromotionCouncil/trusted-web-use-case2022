import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { BunsinConnectConfirmView } from "./BunsinConnectConfirm.view";

export default {
  title: "yellow-lemon/Views/BunsinConnectConfirm",
  component: BunsinConnectConfirmView,
} as Meta;

const Template: Story<ComponentProps<typeof BunsinConnectConfirmView>> = (args) => (
    <BunsinConnectConfirmView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
