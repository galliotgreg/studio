import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Star } from 'lucide-react';
import { StatsCard } from '@/components/app/StatsCard';

test('StatsCard renders correctly', () => {
  render(<StatsCard icon={Star} title="Test Title" value="123" />);

  // Check if the title is displayed
  expect(screen.getByText('Test Title')).toBeInTheDocument();

  // Check if the value is displayed
  expect(screen.getByText('123')).toBeInTheDocument();

  // Check if the icon is present
  const icon = document.querySelector('svg');
  expect(icon).toBeInTheDocument();
});
