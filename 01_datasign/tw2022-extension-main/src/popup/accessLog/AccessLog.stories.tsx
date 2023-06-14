import React, { ComponentProps } from "react";
import { Meta, Story } from "@storybook/react";

import { AccessLogView } from "./AccessLog.view";

export default {
  title: "yellow-lemon/Views/AccessLog",
  component: AccessLogView,
} as Meta;

const Template: Story<ComponentProps<typeof AccessLogView>> = (args) => (
  <AccessLogView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  accessLogs: [
    {
      owner: "",
      recordId: "",
      date: "2023/2/15 19:52:56",
      schema: "非ボット",
      accessor: "did:ion:123",
    },
  ],
};

export const SecondStory = Template.bind({});
SecondStory.args = {
  accessLogs: [
    {
      owner: "",
      recordId: "",
      date: "2023/2/15 19:52:56",
      schema: "非ボット",
      accessor: "did:ion:123",
    },
    {
      owner: "",
      recordId: "",
      date: "2023/2/14 19:52:56",
      schema: "メールアドレス",
      accessor:
        "did:ion:456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456",
    },
    {
      owner: "",
      recordId: "",
      date: "2023/2/13 19:52:56",
      schema: "メールアドレス",
      accessor:
        "did:ion:456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456",
    },
    {
      owner: "",
      recordId: "",
      date: "2023/2/12 19:52:56",
      schema: "メールアドレス",
      accessor:
        "did:ion:456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456",
    },
    {
      owner: "",
      recordId: "",
      date: "2023/2/11 19:52:56",
      schema: "メールアドレス",
      accessor:
        "did:ion:456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456",
    },
    {
      owner: "",
      recordId: "",
      date: "2023/2/10 19:52:56",
      schema: "メールアドレス",
      accessor:
        "did:ion:456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456456",
    },
  ],
};

export const NoAccessLog = Template.bind({});
NoAccessLog.args = {};
