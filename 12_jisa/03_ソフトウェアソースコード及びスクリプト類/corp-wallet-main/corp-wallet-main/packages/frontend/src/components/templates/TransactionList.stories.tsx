import { Meta, Story } from "@storybook/react/types-6-0";

import { TransactionListTemplate as Component } from "./TransactionList";

export default {
  title: "Templates/TransactionList",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const TransactionList = Template.bind({});
TransactionList.args = {};
