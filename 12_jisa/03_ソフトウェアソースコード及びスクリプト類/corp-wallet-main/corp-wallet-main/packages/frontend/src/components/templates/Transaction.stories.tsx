import { Meta, Story } from "@storybook/react/types-6-0";

import { TransactionTemplate as Component } from "./Transaction";

export default {
  title: "Templates/Transaction",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const Transaction = Template.bind({});
Transaction.args = {};
