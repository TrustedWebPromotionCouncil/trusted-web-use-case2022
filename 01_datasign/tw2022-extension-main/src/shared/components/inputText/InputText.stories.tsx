import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { InputText } from "./InputText";

export default {
  title: "yellow-lemon/Components/InputText",
  component: InputText,
} as Meta;

const Template: Story<ComponentProps<typeof InputText>> = (args) => (
    <InputText {...args}/>
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const Second = Template.bind({});
Second.args = { placeholder: "テキストボックス" };

export const Third = Template.bind({});
Third.args = { placeholder: "テキストボックス", label: "ラベル" };

export const Error = Template.bind({});
Error.args = { error: "入力エラー" };

export const Password = Template.bind({});
Password.args = { type: "password" };
