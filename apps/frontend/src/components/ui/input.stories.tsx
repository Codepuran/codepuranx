import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  args: { placeholder: 'you@example.com' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: 'admin@codepuranx.dev' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Unavailable' } };
export const ValidationError: Story = {
  args: { 'aria-invalid': true, className: 'border-destructive focus:border-destructive focus:ring-destructive/30' },
};
