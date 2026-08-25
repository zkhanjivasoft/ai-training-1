import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TodoFiltersProvider, useTodoFilters } from './TodoFiltersContext';

function Harness() {
  const { filters, setFilter, resetFilters } = useTodoFilters();
  return (
    <div>
      <p>status: {filters.status ?? 'none'}</p>
      <p>page: {filters.page}</p>
      <button type="button" onClick={() => setFilter('status', undefined)}>
        clear status
      </button>
      <button type="button" onClick={() => setFilter('page', 3)}>
        go to page 3
      </button>
      <button type="button" onClick={() => setFilter('priority', 'high')}>
        set priority
      </button>
      <button type="button" onClick={resetFilters}>
        reset
      </button>
    </div>
  );
}

describe('TodoFiltersContext', () => {
  it('defaults filters.status to open', () => {
    render(
      <TodoFiltersProvider>
        <Harness />
      </TodoFiltersProvider>,
    );
    expect(screen.getByText('status: open')).toBeInTheDocument();
  });

  it('resetFilters restores status to open after it was cleared', async () => {
    render(
      <TodoFiltersProvider>
        <Harness />
      </TodoFiltersProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'clear status' }));
    expect(screen.getByText('status: none')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'reset' }));
    expect(screen.getByText('status: open')).toBeInTheDocument();
  });

  it('setFilter for a non-status key still resets page to 1', async () => {
    render(
      <TodoFiltersProvider>
        <Harness />
      </TodoFiltersProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'go to page 3' }));
    expect(screen.getByText('page: 3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'set priority' }));
    expect(screen.getByText('page: 1')).toBeInTheDocument();
  });
});
