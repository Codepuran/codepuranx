import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    a11y: { test: 'error' },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0c1224' },
        { name: 'light', value: '#fafafd' },
      ],
    },
  },
};

export default preview;
