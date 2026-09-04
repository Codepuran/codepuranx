import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders disabled buttons as inaccessible', () => {
    render(<Button disabled>Save changes</Button>);

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
  });
});
