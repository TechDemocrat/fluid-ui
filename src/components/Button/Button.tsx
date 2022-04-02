import React from "react";
import { IButtonProps } from "./Button.types";
import styles from "./Button.module.scss";

export const Button = (props: IButtonProps) => {
  const { label } = props;

  return <button className={styles.buttonWrapper}>{label}</button>;
};
