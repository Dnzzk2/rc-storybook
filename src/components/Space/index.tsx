import classNames from "classnames";
import React from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import "./index.scss";

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
  const {
    className,
    style,
    direction = "horizontal",
    size = "small",
    align,
    split,
    wrap,
    ...otherProps
  } = props;

  // 子元素数组扁平化并过滤null和undefined
  const childNodes = React.Children.toArray(props.children);
  const mergedAlign =
    direction === "horizontal" && align === undefined ? "center" : align;

  const cn = classNames(
    "space",
    `space-${direction}`,
    {
      [`space-align-${mergedAlign}`]: mergedAlign,
    },
    className
  );

  const nodes = childNodes.map((node: any, i) => {
    const key = (node && node.key) || `space-item-${i}`;

    return (
      <div className="space-item" key={key}>
        {node}
      </div>
    );
  });

  return (
    <div className={cn} style={style} {...otherProps}>
      {nodes}
    </div>
  );
};

export default Space;
