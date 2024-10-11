import React from "react";
import type { CSSProperties, HTMLAttributes } from "react";

export type SizeType = "small" | "middle" | "large" | number | undefined;

// 继承原生div的属性
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: CSSProperties;
  direction?: "horizontal" | "vertical";
  size?: SizeType | [SizeType, SizeType];
  align?: "start" | "end" | "center" | "baseline";
  split?: React.ReactNode;
  wrap?: boolean;
}

const Space: React.FC<SpaceProps> = (props) => {
  const { className, style, ...otherProps } = props;

  return <div className={className} style={style} {...otherProps}></div>;
};

export default Space;
