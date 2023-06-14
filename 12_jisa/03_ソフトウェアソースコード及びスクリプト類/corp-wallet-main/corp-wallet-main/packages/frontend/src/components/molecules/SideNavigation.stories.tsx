import { Meta, Story } from "@storybook/react/types-6-0";

import { manifest } from "../../fixtures";
import { SideNavigation as Component } from "./SideNavigation";

export default {
  title: "Molecules/SideNavigation",
  component: Component,
} as Meta;

const Template: Story = (args) => <Component {...args} />;

export const SideNavigation = Template.bind({});
SideNavigation.args = {
  manifest,
};
