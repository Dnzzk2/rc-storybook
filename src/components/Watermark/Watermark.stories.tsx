import type { Meta, StoryObj } from "@storybook/react";
import Watermark from "./";

const meta = {
  title: "Antd Design/其他/Watermark 水印",
  component: Watermark,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "给页面的某个区域加上水印。",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    content: {
      description: "水印文字内容",
      table: {
        type: {
          summary: "string | string[]",
        },
      },
    },
    width: {
      description: "水印的宽度",
      table: {
        type: {
          summary: "number",
        },
      },
    },
    height: {
      description: "水印的高度",
      table: {
        type: {
          summary: "number",
        },
      },
    },
    rotate: {
      description: "水印旋转的角度",
      table: {
        type: {
          summary: "number",
        },
      },
    },
    zIndex: {
      description: "追加的水印元素的 z-index",
      table: {
        type: {
          summary: "number | string",
        },
      },
    },
    image: {
      description: "图片源，建议导出 2x 或 3x 图片",
      table: {
        type: {
          summary: "string",
        },
      },
    },
    gap: {
      description: "水印之间的间距",
      table: {
        type: {
          summary: "[number, number]",
        },
        defaultValue: { summary: "[10, 10]" },
      },
    },
    offset: {
      description: "水印距离容器左上角的偏移量",
      table: {
        type: {
          summary: "[number, number]",
        },
        defaultValue: { summary: "[0, 0]" },
      },
    },
  },
} satisfies Meta<typeof Watermark>;

export default meta;

type Story = StoryObj<typeof meta>;

// 基础用法
export const Basic: Story = {
  name: "基本使用",
  args: {
    content: "Watermark",
  },
  render: (args) => (
    <Watermark {...args}>
      <div style={{ height: 500, background: "#fff" }}>
        <p style={{ textAlign: "center" }}>
          ContentContentContentContentContentContentContentContentContentContentContentContent
        </p>
      </div>
    </Watermark>
  ),
};

// 多行文字水印
export const MultiLine: Story = {
  name: "多行文字水印",
  args: {
    content: ["Watermark", "Multi-line Text"],
    gap: [10, 10],
  },
  render: (args) => (
    <Watermark {...args}>
      <div style={{ background: "#fff" }}>
        <p style={{ textAlign: "center" }}>
          ContentContentContentContentContentContentContentContentContentContentContent
        </p>
        <p style={{ textAlign: "center" }}>
          ContentContentContentContentContentContentContentContentContentContentContent
        </p>
      </div>
    </Watermark>
  ),
};

// 图片水印
export const ImageWatermark: Story = {
  name: "图片水印",
  args: {
    image:
      "https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original",
    width: 130,
    height: 50,
  },
  render: (args) => (
    <Watermark {...args}>
      <div style={{ height: 500, background: "#fff" }}>
        <p style={{ textAlign: "center" }}>
          ContentContentContentContentContentContentContent
        </p>
      </div>
    </Watermark>
  ),
};
