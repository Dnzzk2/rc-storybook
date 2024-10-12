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
      control: "text",
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
  },
} satisfies Meta<typeof Space>;

export default meta;

type Story = StoryObj<typeof meta>;

export const direction: Story = {
  name: "基本使用",
  args: {
    direction: "horizontal",
    size: "small",
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
