import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { VerifyResultCurrentView } from "./VerifyResultCurrent.view";

export default {
  title: "yellow-lemon/Views/VerifyResultCurrentView",
  component: VerifyResultCurrentView,
} as Meta;

const Template: Story<ComponentProps<typeof VerifyResultCurrentView>> = (
  args
) => <VerifyResultCurrentView {...args} />;

export const FirstStory = Template.bind({});
FirstStory.args = {
  result: {
    id: "1",
    date: new Date().toISOString(),
    verified: "ok",
    url: "https://1st-party.com",
    did: "did:ion:123",
    thirdParties: [
      {
        id: "2",
        date: new Date().toISOString(),
        verified: "ok",
        did: "did:ion:123",
        originatorProfile: { iss: "", sub: "https://3rd-party1.com" },
      },
      {
        id: "3",
        date: new Date().toISOString(),
        verified: "ng",
        did: "did:ion:456",
        originatorProfile: { iss: "", sub: "https://3rd-party2.com" },
      },
    ],
    originatorProfile: { iss: "", sub: "" },
  },
};
export const SecondStory = Template.bind({});
SecondStory.args = {
  result: {
    id: "1",
    date: new Date().toISOString(),
    verified: "ok",
    url: "http://localhost:3000",
    did: "did:ion:123",
    thirdParties: [
      {
        id: "2",
        date: new Date().toISOString(),
        verified: "ok",
        did: "did:ion:123",
        originatorProfile: { iss: "", sub: "https://3rd-party1.com" },
      },
      {
        id: "3",
        date: new Date().toISOString(),
        verified: "ng",
        did: "did:ion:456",
        originatorProfile: { iss: "", sub: "https://3rd-party2.com" },
      },
      {
        id: "4",
        date: new Date().toISOString(),
        verified: "ok",
        did: "did:ion:123",
        originatorProfile: { iss: "", sub: "https://3rd-party1.com" },
      },
      {
        id: "5",
        date: new Date().toISOString(),
        verified: "ok",
        did: "did:ion:123",
        originatorProfile: { iss: "", sub: "https://3rd-party1.com" },
      },
      {
        id: "6",
        date: new Date().toISOString(),
        verified: "ok",
        did: "did:ion:123",
        originatorProfile: { iss: "", sub: "https://3rd-party1.com" },
      },
    ],
    originatorProfile: { iss: "", sub: "" },
  },
};
export const VerifiedNgStory = Template.bind({});
VerifiedNgStory.args = {
  result: {
    id: "1",
    date: new Date().toISOString(),
    verified: "ng",
    url: "https://1st-party.com",
    originatorProfile: { iss: "", sub: "" },
    thirdParties: [],
  },
};
export const NoOpDocStory = Template.bind({});
NoOpDocStory.args = {
  result: {
    id: "1",
    date: new Date().toISOString(),
    verified: "op_document_not_found",
    url: "https://1st-party.com",
    thirdParties: [],
  },
};

export const NoCurrentSite = Template.bind({});
NoCurrentSite.args = {};
