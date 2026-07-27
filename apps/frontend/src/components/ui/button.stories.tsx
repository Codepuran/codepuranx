import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Continue' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Loading: Story = { args: { children: 'Saving…', disabled: true } };
export const Disabled: Story = { args: { disabled: true } };
