import { vi } from 'vitest';

export function mockConsoleError() {
  const consoleMock = vi.spyOn(console, 'error');
  consoleMock.mockImplementation(() => undefined);

  return consoleMock;
}
