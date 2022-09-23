import type { FunctionComponent } from 'react';
import type { Optional } from '../../util/typeUtils';
import type { PaneProps } from '../Pane/Pane';

// The pane's children are replaced with a spinner so the prop should not be
// available.  Additionally, defaultWidth is specified by default (`fill`) so
// is no longer required
export type LoadingPaneProps = Optional<
  Omit<PaneProps, 'children'>,
  'defaultWidth'
>;

/**
 * Renders a pane containing a loading spinner with the given props; accepts
 * the properties of Pane (minus `children`)
 * @example
 * <LoadingPane defaultWidth="20%" paneTitle="Filters" />
 */
export const LoadingPane: FunctionComponent<LoadingPaneProps>;
export default LoadingPane;
