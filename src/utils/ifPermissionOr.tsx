import type { StripesType } from '@folio/stripes/core';
import type { ReactNode } from 'react';

export default function ifPermissionOr(
  stripes: StripesType,
  perms: [string, ...string[]],
  children: ReactNode
): ReactNode {
  // ensure the user has at least one perm
  if (perms.map(stripes.hasPerm.bind(stripes)).filter((c) => c).length) {
    return children;
  }
  return null;
}
