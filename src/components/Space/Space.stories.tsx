import type { Meta, StoryObj } from "@storybook/react";

import Space, { SpaceProps } from "./index";
import { Button } from "antd";

const meta = {
  title: "Antd Design/布局/Space 间距",
  component: Space,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["small", "middle", "large"],
      description: "间距大小",
      table: {
        type: {
          summary: `SizeType | [SizeType, SizeType] `,
        },
        defaultValue: { summary: "small" },
      },
    },
    direction: {
      description: "排序方向",
      table: {
        type: {
          summary: "horizontal | vertical",
        },
        defaultValue: { summary: "horizontal" },
      },
    },
    align: {
      control: "radio",
      options: ["start", "end", "center", "baseline"],
      description: "对齐方式",
      table: {
        type: {
          summary: "start | end | center | baseline",
        },
        defaultValue: { summary: "center" },
      },
    },
    split: {
      control: "text",
      description: "分隔符",
      table: {
        type: {
          summary: "ReactNode",
        },
        defaultValue: { summary: "undefined" },
      },
    },
    wrap: {
      control: "boolean",
      description: "是否换行，仅在 horizontal 时有效",
      table: {
        type: {
          summary: "boolean",
        },
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof Space>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "基本使用",
  render: (args: SpaceProps) => {
    return (
      <Space {...args}>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    );
  },
};

export const Direction: Story = {
  name: "垂直布局",
  args: {
    direction: "vertical",
  },
  render: (args: SpaceProps) => {
    return (
      <Space {...args}>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    );
  },
};

export const Size: Story = {
  name: "间距大小",
  args: {
    size: "large",
  },
  render: (args: SpaceProps) => {
    return (
      <Space {...args}>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    );
  },
};

export const Align: Story = {
  name: "对齐方式",
  args: {
    align: "center",
  },
  render: (args: SpaceProps) => {
    return (
      <Space {...args}>
        <div
          style={{
            height: 100,
            width: 100,
            backgroundColor: "aliceblue",
            textAlign: "center",
          }}
        >
          {args.align}
        </div>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    );
  },
};

export const Split: Story = {
  name: "分隔符",
  args: {
    split: <div>|</div>,
  },
  render: (args: SpaceProps) => {
    return (
      <Space {...args}>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    );
  },
};
export const Wrap: Story = {
  name: "换行",
  args: {
    wrap: true,
  },
  render: (args: SpaceProps) => {
    return (
      <Space {...args} style={{ width: 400, backgroundColor: "aliceblue" }}>
        {new Array(8).fill(null).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Button key={index}>Button</Button>
        ))}
      </Space>
    );
  },
};
