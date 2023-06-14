import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { Link } from "./Link";

export default {
  title: "yellow-lemon/Components/Link",
  component: Link,
} as Meta;

const Template: Story<ComponentProps<typeof Link>> = (args) => (
    <Link {...args}>リンク</Link>
);

export const Link1 = Template.bind({});
