import classNames from "classnames";
import React, { useMemo } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import "./index.scss";
import { ConfigContext } from "./ConfigProvider";

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

const sizeMap = {
  small: 8,
  middle: 16,
  large: 24,
};

const getNumberSize = (size: SizeType) => {
  return typeof size === "string" ? sizeMap[size] : size || 0;
};

/**
 *
 * type SizeType = "small" | "middle" | "large" | number | undefined;
 */
const Space: React.FC<SpaceProps> = (props) => {
  const { space } = React.useContext(ConfigContext);

  const {
    className,
    style,
    direction = "horizontal",
    size = space?.size || "small",
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
      <>
        <div className="space-item" key={key}>
          {node}
        </div>
        {i < childNodes.length - 1 && split && (
          <span className={`space-item-split`}>{split}</span>
        )}
      </>
    );
  });

  const otherStyles: React.CSSProperties = {};

  const [horizontalSize, verticalSize] = useMemo(
    () =>
      ((Array.isArray(size) ? size : [size, size]) as [SizeType, SizeType]).map(
        (item) => getNumberSize(item)
      ),
    [size]
  );

  otherStyles.rowGap = horizontalSize;
  otherStyles.columnGap = verticalSize;

  if (wrap) {
    otherStyles.flexWrap = "wrap";
  }

  return (
    <div className={cn} style={{ ...otherStyles, ...style }} {...otherProps}>
      {nodes}
    </div>
  );
};

export default Space;
