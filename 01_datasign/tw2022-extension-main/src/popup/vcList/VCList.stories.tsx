import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";
import { v4 as uuidv4 } from "uuid";

import { VCListView } from "./VCList.view";

export default {
  title: "yellow-lemon/Views/VCListView",
  component: VCListView,
} as Meta;

const Template: Story<ComponentProps<typeof VCListView>> = (args) => (
  <VCListView {...args} />
);

const did =
  "did:ion:EiAv9mRQnvTzyF2239tU0WK6Aq5DxjUcrBAuBzRN-G1qjw:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJCUDNsY1p5ZjlDdWt5dFo2SVRBUGFkaDRIdC01dzYwamkwdjNIbmFYdnhVIiwieSI6Il9PX2dvT3RGeFFxOGc2dkhXMXl6OGFJaTJheV90X2ZyWl9PQjRESC15UVkifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iLCJrZXlBZ3JlZW1lbnQiXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn1dLCJzZXJ2aWNlcyI6W3siaWQiOiJkd24iLCJzZXJ2aWNlRW5kcG9pbnQiOnsibm9kZXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl19LCJ0eXBlIjoiRGVjZW50cmFsaXplZFdlYk5vZGUifV19fV0sInVwZGF0ZUNvbW1pdG1lbnQiOiJFaUFSNDNLMkVENWVjYW93eHJjUTRNU0RCN3BMUjJ5aFVzME1lemZpS0RNOWRRIn0sInN1ZmZpeERhdGEiOnsiZGVsdGFIYXNoIjoiRWlCNzFFa0ExVUpQR0kzcjF4dndiRmhVTWhaZjFyWHJueU5xODVRaE9FUXJZQSIsInJlY292ZXJ5Q29tbWl0bWVudCI6IkVpQmRPZXpRc3RYRTZxUWZVNjdPV3NBZVB4bjI4TGhzSGxUSGhhV3RkWXRnRUEifX0";
export const FirstStory = Template.bind({});
FirstStory.args = {
  vcType: "notBot",
  histories: [
    {
      vcType: "notBot",
      date: new Date().toISOString(),
      recipient: {
        did,
        url: "https://firstparty1.com",
        pairwiseAccount: {
          shortForm: "did:ion:456",
          longForm: did,
        },
      },
      vc: {
        type: "notBot",
        name: "re-captcha-test",
        agent: { name: "did:ion:456-suffix" },
        result: true,
      },
    },
    {
      vcType: "notBot",
      date: new Date().toISOString(),
      recipient: {
        did,
        url: "https://firstparty1.com",
        pairwiseAccount: {
          shortForm: "did:ion:456",
          longForm: did,
        },
      },
      vc: {
        type: "notBot",
        name: "re-captcha-test",
        agent: { name: "did:ion:456-suffix" },
        result: true,
      },
    },
  ],
};
export const SecondStory = Template.bind({});
SecondStory.args = {
  vcType: "ad",
  histories: [
    {
      vcType: "ad",
      date: new Date().toISOString(),
      recipient: {
        did: "did:ion:123",
        url: "https://3rd-party1.com",
        pairwiseAccount: {
          shortForm: "did:ion:456",
          longForm: "did:ion:456-suffix",
        },
      },
      vc: {
        type: "ad",
        id: uuidv4(),
        usage: ["advertiser", "analytics"],
      },
    },
  ],
};
export const ThirdStory = Template.bind({});
ThirdStory.args = {
  vcType: "mailAddress",
  histories: [
    {
      vcType: "mailAddress",
      date: new Date().toISOString(),
      recipient: {
        did: "did:ion:123",
        url: "https://3rd-party2.com",
        pairwiseAccount: {
          shortForm: "did:ion:456",
          longForm: "did:ion:456-suffix",
        },
      },
      vc: { type: "mailAddress", mailAddress: "xxx@sample.com" },
    },
  ],
};
