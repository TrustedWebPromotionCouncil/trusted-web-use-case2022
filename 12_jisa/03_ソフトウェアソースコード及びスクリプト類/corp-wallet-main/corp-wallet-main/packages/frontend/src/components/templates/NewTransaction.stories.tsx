import { Meta, Story } from "@storybook/react/types-6-0";

import { NewTransactionTemplate as Component } from "./NewTransaction";

export default {
  title: "Templates/NewTransaction",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const NewTransaction = Template.bind({});
NewTransaction.args = {};
