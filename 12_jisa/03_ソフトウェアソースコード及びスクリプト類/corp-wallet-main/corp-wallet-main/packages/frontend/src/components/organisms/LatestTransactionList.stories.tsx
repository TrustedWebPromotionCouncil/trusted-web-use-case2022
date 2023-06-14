import { Meta, Story } from "@storybook/react/types-6-0";

import { LatestTransactionList as Component } from "./LatestTransactionList";

export default {
  title: "Organisms/LatestTransactionList",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const LatestTransactionList = Template.bind({});
LatestTransactionList.args = {};
