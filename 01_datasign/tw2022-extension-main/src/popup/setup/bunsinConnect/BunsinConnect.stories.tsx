import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { BunsinConnectView } from "./BunsinConnect.view";

export default {
  title: "yellow-lemon/Views/BunsinConnect",
  component: BunsinConnectView,
} as Meta;

const Template: Story<ComponentProps<typeof BunsinConnectView>> = (args) => (
    <BunsinConnectView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
