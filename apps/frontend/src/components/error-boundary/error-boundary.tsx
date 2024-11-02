
import { isDifferentArray } from '@/lib/utils';
import type {
  ComponentPropsWithoutRef,
  ErrorInfo,
  PropsWithChildren,
  PropsWithRef,
  ReactNode
} from 'react';
import { Component, forwardRef, useImperativeHandle, useRef } from 'react';

type RenderFallbackProps<ErrorType extends Error = Error> = {
  error: ErrorType;
  reset: () => void;
};

type RenderFallbackType = <ErrorType extends Error>(props: RenderFallbackProps<ErrorType>) => ReactNode;
type IgnoreErrorType = <ErrorType extends Error = Error>(error: ErrorType) => boolean;

type Props<ErrorType extends Error = Error> = {
  resetKeys?: unknown[];
  onReset?(): void;
  renderFallback: RenderFallbackType;
  onError?(error: ErrorType, info: ErrorInfo): void;
  ignoreError?: IgnoreErrorType;
};

interface State<ErrorType extends Error = Error> {
  error: ErrorType | null;
}

const initialState: State = {
  error: null,
};

class BaseErrorBoundary extends Component<PropsWithRef<PropsWithChildren<Props>>, State> {
  state = initialState;

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError, ignoreError } = this.props;

    if (ignoreError?.(error)) {
      throw error;
    }

    onError?.(error, info);
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState(initialState);
  };

  componentDidUpdate(prevProps: Props) {
    if (this.state.error == null) {
      return;
    }

    if (isDifferentArray(prevProps.resetKeys, this.props.resetKeys)) {
      this.resetErrorBoundary();
    }
  }

  render() {
    const { children, renderFallback } = this.props;
    const { error } = this.state;

    if (error != null) {
      return renderFallback({
        error,
        reset: this.resetErrorBoundary,
      });
    }

    return children;
  }
}

export const ErrorBoundary = forwardRef<{ reset(): void }, ComponentPropsWithoutRef<typeof BaseErrorBoundary>>(
  (props, resetRef) => {
    const ref = useRef<BaseErrorBoundary>(null);
    useImperativeHandle(resetRef, () => ({
      reset: () => ref.current?.resetErrorBoundary(),
    }));

    return <BaseErrorBoundary {...props} ref={ref} />;
  }
);

if (process.env.NODE_ENV !== 'production') {
  ErrorBoundary.displayName = 'ErrorBoundary';
}
