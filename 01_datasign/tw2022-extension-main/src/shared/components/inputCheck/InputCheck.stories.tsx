import React, { ChangeEvent, ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { InputCheck } from "./InputCheck";

export default {
  title: "yellow-lemon/Components/InputCheck",
  component: InputCheck,
} as Meta;

const Template: Story<ComponentProps<typeof InputCheck>[]> = (args) => (
  <>
    <InputCheck {...args[0]} />
    <InputCheck {...args[1]} />
  </>
);

export const radioStory = Template.bind({});
radioStory.args = [
  {
    name: "radio",
    type: "radio",
    value: "radio1",
    label: "radio1",
    checked: true,
  },
  {
    name: "radio",
    type: "radio",
    value: "radio2",
    label: "radio2",
  },
];

export const checkBoxStory = Template.bind({});
checkBoxStory.args = [
  {
    name: "checkbox",
    type: "checkbox",
    value: "check1",
    label: "check1",
    checked: true,
  },
  {
    name: "checkbox",
    type: "checkbox",
    value: "check2",
    label: "check2",
  },
];
