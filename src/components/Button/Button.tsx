import React from "react";
import { IButtonProps } from "./Button.types";

export const Button = (props: IButtonProps) => {
  const { label } = props;
  return <div>{label}</div>;
};
