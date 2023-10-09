import type { StripesType } from '@folio/stripes/core';
import type { ReactNode } from 'react';

export default function ifPermissionOr(
  stripes: StripesType,
  perms: [string, ...string[]],
  children: ReactNode
): ReactNode {
  // ensure the user has at least one perm
  if (perms.some((p) => !!stripes.hasPerm(p))) {
    return children;
  }
  return null;
}
