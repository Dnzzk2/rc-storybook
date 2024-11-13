// 导入必要的React hooks和类型
import { useEffect, useRef, useState } from "react";
import { WatermarkProps } from ".";
import { merge } from "lodash-es";

// 定义水印选项类型,排除一些不需要的属性
export type WatermarkOptions = Omit<
  WatermarkProps,
  "className" | "style" | "children"
>;

// 判断一个值是否为数字类型
export function isNumber(obj: any): obj is number {
  return (
    Object.prototype.toString.call(obj) === "[object Number]" && obj === obj
  );
}

// 将值转换为数字,如果转换失败则返回默认值
const toNumber = (value?: string | number, defaultValue?: number) => {
  if (!value) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};

// 默认的水印配置选项
const defaultOptions = {
  rotate: -20, // 旋转角度
  zIndex: 1, // 层级
  width: 100, // 宽度
  gap: [100, 100], // 水印之间的间距
  fontStyle: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.15)",
    fontFamily: "sans-serif",
    fontWeight: "normal",
  },
  getContainer: () => document.body, // 默认容器为body
};

// 合并用户配置和默认配置
const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(
      options.width,
      options.image ? defaultOptions.width : undefined
    ),
    height: toNumber(options.height, undefined)!,
    getContainer: options.getContainer!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>;

  // 处理偏移量
  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(
    mergedOptions.offset?.[1] || mergedOptions.offset?.[0],
    0
  )!;
  mergedOptions.offset = [mergedOffsetX, mergedOffsetY];

  return mergedOptions;
};

// 获取Canvas绘制的水印数据
const getCanvasData = async (
  options: Required<WatermarkOptions>
): Promise<{ width: number; height: number; base64Url: string }> => {
  const { rotate, image, content, fontStyle, gap } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // 获取设备像素比
  const ratio = window.devicePixelRatio;

  // 配置canvas大小和变换
  const configCanvas = (size: { width: number; height: number }) => {
    // 计算单个水印单元的总宽高（水印内容 + 四周间距）
    const canvasWidth = gap[0] + size.width; // 总宽度 = 水平间距 + 内容宽度
    const canvasHeight = gap[1] + size.height; // 总高度 = 垂直间距 + 内容高度

    // 设置canvas的实际大小（考虑设备像素比）
    canvas.setAttribute("width", `${canvasWidth * ratio}px`);
    canvas.setAttribute("height", `${canvasHeight * ratio}px`);
    // 设置canvas的显示大小
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // 将坐标原点移到canvas中心，这样水印就会在间距中居中
    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    // 处理设备像素比，确保清晰度
    ctx.scale(ratio, ratio);

    // 设置旋转角度（将角度转换为弧度）
    const RotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(RotateAngle);
  };

  /**
   * 计算水印文字的尺寸
   * @param ctx Canvas 上下文
   * @param content 水印文字内容数组（支持多行）
   * @param rotate 旋转角度
   */
  const measureTextSize = (
    ctx: CanvasRenderingContext2D,
    content: string[],
    rotate: number
  ) => {
    // 记录最大宽度
    let width = 0;
    // 记录总高度
    let height = 0;
    // 存储每行文字的尺寸信息
    const lineSize: Array<{ width: number; height: number }> = [];

    // 遍历每行文字计算尺寸
    content.forEach((item) => {
      // measureText 获取文字度量信息
      const {
        width: textWidth, // 文字宽度
        fontBoundingBoxAscent, // 文字基线以上的高度
        fontBoundingBoxDescent, // 文字基线以下的高度
      } = ctx.measureText(item);

      // 计算单行文字总高度
      const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

      // 更新最大宽度
      if (textWidth > width) {
        width = textWidth;
      }

      // 累加总高度
      height += textHeight;
      // 保存每行的尺寸信息，供后续绘制使用
      lineSize.push({ height: textHeight, width: textWidth });
    });

    // 将旋转角度转换为弧度
    const angle = (rotate * Math.PI) / 180;

    return {
      originWidth: width, // 原始宽度（未旋转）
      originHeight: height, // 原始高度（未旋转）
      // 计算旋转后的宽度：|sin(θ) * height| + |cos(θ) * width|
      width: Math.ceil(
        Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)
      ),
      // 计算旋转后的高度：|sin(θ) * width| + |cos(θ) * height|
      height: Math.ceil(
        Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))
      ),
      lineSize, // 每行文字的尺寸信息
    };
  };

  // 绘制文本水印
  const drawText = () => {
    const { fontSize, color, fontWeight, fontFamily } = fontStyle;
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

    // 设置字体样式并计算文字尺寸
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    const measureSize = measureTextSize(ctx, [...content], rotate);

    // 确定最终的水印尺寸（使用指定尺寸或计算尺寸）
    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    // 配置canvas（这会将坐标原点移到中心）
    configCanvas({ width, height });

    // 设置文字样式
    ctx.fillStyle = color!;
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    ctx.textBaseline = "top";

    // 绘制每行文字
    [...content].forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } =
        measureSize.lineSize[index];

      // 计算文字起始位置
      // 水平居中：从中心点向左偏移半个文字宽度
      const xStartPoint = -lineWidth / 2;
      // 垂直位置：从中心点向上偏移半个总高度，然后加上当前行的累计高度
      const yStartPoint =
        -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      // 绘制文字
      ctx.fillText(
        item,
        xStartPoint,
        yStartPoint,
        options.width || measureSize.originWidth
      );
    });
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  // 绘制图片水印
  function drawImage() {
    return new Promise<{ width: number; height: number; base64Url: string }>(
      (resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";

        img.src = image;
        img.onload = () => {
          let { width, height } = options;
          if (!width || !height) {
            if (width) {
              height = (img.height / img.width) * +width;
            } else {
              width = (img.width / img.height) * +height;
            }
          }
          configCanvas({ width, height });

          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          return resolve({ base64Url: canvas.toDataURL(), width, height });
        };
        img.onerror = () => {
          return drawText();
        };
      }
    );
  }

  return image ? drawImage() : drawText();
};

// 水印Hook
export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);
  const watermarkDiv = useRef<HTMLDivElement>();
  const mutationObserver = useRef<MutationObserver>();

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  // 绘制水印
  function drawWatermark() {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
      const offsetLeft = mergedOptions.offset[0] + "px";
      const offsetTop = mergedOptions.offset[1] + "px";
      // 水印div的样式
      const wmStyle = `
      width:calc(100% - ${offsetLeft});
      height:calc(100% - ${offsetTop});
      position:absolute;
      top:${offsetTop};
      left:${offsetLeft};
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`;

      // 创建水印div
      if (!watermarkDiv.current) {
        const div = document.createElement("div");
        watermarkDiv.current = div;
        container.append(div);
        container.style.position = "relative";
      }

      watermarkDiv.current?.setAttribute("style", wmStyle.trim());

      // 监听DOM变化,防止水印被篡改
      if (container) {
        mutationObserver.current?.disconnect();

        mutationObserver.current = new MutationObserver((mutations) => {
          const isChanged = mutations.some((mutation) => {
            let flag = false;
            if (mutation.removedNodes.length) {
              flag = Array.from(mutation.removedNodes).some(
                (node) => node === watermarkDiv.current
              );
            }
            if (
              mutation.type === "attributes" &&
              mutation.target === watermarkDiv.current
            ) {
              flag = true;
            }
            return flag;
          });
          if (isChanged) {
            watermarkDiv.current = undefined;
            drawWatermark();
          }
        });

        mutationObserver.current.observe(container, {
          attributes: true,
          subtree: true,
          childList: true,
        });
      }
    });
  }

  // 监听options变化重新绘制水印
  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    // 更新水印配置
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {}, // 销毁水印
  };
}
