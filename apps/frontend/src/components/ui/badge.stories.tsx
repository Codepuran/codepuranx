import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './badge';

const meta = { title: 'UI/Badge', component: Badge, args: { children: 'Status' }, tags: ['autodocs'] } satisfies Meta<
  typeof Badge
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Muted: Story = {};
export const Success: Story = { args: { variant: 'success', children: 'Active' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Attention' } };
export const Outline: Story = { args: { variant: 'outline' } };
