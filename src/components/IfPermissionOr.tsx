import { IfPermission } from "@folio/stripes-core";
import React, { FunctionComponent, ReactNode, useCallback } from "react";

export interface IfPermissionOrProps {
  children: ReactNode;
  perms: [string, ...string[]];
}

const IfPermissionOr: FunctionComponent<IfPermissionOrProps> = (
  props: IfPermissionOrProps
) => {
  const hasPermissionCallback = useCallback(
    (hasPermission: boolean, nextI: number): ReactNode => {
      if (hasPermission) {
        return props.children;
      }

      if (nextI >= props.perms.length) {
        return null;
      }

      if (nextI === props.perms.length - 1) {
        return (
          <IfPermission perm={props.perms[nextI]}>
            {props.children}
          </IfPermission>
        );
      }

      return (
        <IfPermission perm={props.perms[nextI]}>
          {({ hasPermission: hasNextPermission }) =>
            hasPermissionCallback(hasNextPermission, nextI + 1)
          }
        </IfPermission>
      );
    },
    [props]
  );

  return (
    <IfPermission perm={props.perms[0]}>
      {({ hasPermission }) => hasPermissionCallback(hasPermission, 1)}
    </IfPermission>
  );
};

export default IfPermissionOr;
