import { act, render, screen } from '@testing-library/react';
import type { ComponentRef } from 'react';
import { createRef } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { mockConsoleError } from '@/tests/mock-console-error';
import { ErrorBoundary } from './error-boundary';

const TEXT_ERROR = `This is an error`;
const TEXT_NO_ERROR = `This is no error`;

beforeEach(() => {
  mockConsoleError();
});

describe('ErrorBoundary', () => {
  it('can catch errors in children', () => {
    const ErrorComponent = (): JSX.Element => {
      throw new Error(TEXT_ERROR);
    };

    render(
      <ErrorBoundary renderFallback={({ error }) => <div>{error.message}</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(`${TEXT_ERROR}`)).toBeInTheDocument();
  });

  it('can be reset by ref.current.reset', () => {
    let isError = true;
    const ref = createRef<ComponentRef<typeof ErrorBoundary>>();

    const ErrorComponent = () => {
      if (isError) {
        throw new Error(TEXT_ERROR);
      }

      return <>{TEXT_NO_ERROR}</>;
    };

    render(
      <ErrorBoundary ref={ref} renderFallback={({ error }) => <div>An error occurred: {error.message}</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    act(() => {
      isError = false;
      ref.current?.reset();
    });

    expect(screen.getByText(TEXT_NO_ERROR)).toBeInTheDocument();
  });
});
