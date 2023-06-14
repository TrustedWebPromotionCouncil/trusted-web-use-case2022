import * as NextImage from "next/image";
import { addDecorator } from "@storybook/react";
import { AppWrapper } from "../src/components/utils/AppWrapper";
import { RouterContext } from "next/dist/shared/lib/router-context";

addDecorator((story) => <AppWrapper>{story()}</AppWrapper>);

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};
