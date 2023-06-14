import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { MasterDIDView } from "./MasterDID.view";

export default {
  title: "yellow-lemon/Views/MasterDID",
  component: MasterDIDView,
} as Meta;

const Template: Story<ComponentProps<typeof MasterDIDView>> = (args) => (
    <MasterDIDView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
