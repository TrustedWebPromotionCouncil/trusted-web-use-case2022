import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { VerifyResultListView } from "./VerifyResultList.view";

export default {
  title: "yellow-lemon/Views/VerifyResultList",
  component: VerifyResultListView,
} as Meta;

const Template: Story<ComponentProps<typeof VerifyResultListView>> = (args) => (
  <VerifyResultListView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  results: [
    {
      id: "1",
      date: new Date().toISOString(),
      verified: "ok",
      url: "http://localhost:3000",
      did: "did:ion:123",
      thirdParties: [],
      originatorProfile: { iss: "", sub: "" },
    },
    {
      id: "2",
      date: new Date().toISOString(),
      verified: "ng",
      url: "http://localhost:3000",
      did: "did:ion:123",
      thirdParties: [],
      originatorProfile: { iss: "", sub: "" },
    },
  ],
};
