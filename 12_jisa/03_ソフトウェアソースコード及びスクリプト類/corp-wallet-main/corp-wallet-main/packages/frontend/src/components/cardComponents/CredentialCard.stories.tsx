import { Meta, Story } from "@storybook/react/types-6-0";

import { storedVC } from "../../fixtures";
import { Card as Component, CardProps as Props } from "./Card";

export default {
  title: "Molecules/CredentialCard",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const CredentialCard = Template.bind({});
CredentialCard.args = {
  storedVC,
};
