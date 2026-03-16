import { render } from "@react-email/components";
import { createElement } from "react";

import { ResetPasswordEmail } from "./emails/reset-password";

type ResetPasswordProps = {
  resetLink: string;
  appName: string;
  appUrl: string;
};

export const renderResetPasswordEmail = (props: ResetPasswordProps) =>
  render(createElement(ResetPasswordEmail, props));
