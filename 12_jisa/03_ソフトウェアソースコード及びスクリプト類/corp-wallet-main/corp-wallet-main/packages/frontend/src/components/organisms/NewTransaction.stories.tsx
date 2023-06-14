import { Meta, Story } from "@storybook/react/types-6-0";

import { NewTransaction as Component } from "./NewTransaction";

export default {
  title: "Organisms/NewTransaction",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const NewTransaction = Template.bind({});
NewTransaction.args = {};
