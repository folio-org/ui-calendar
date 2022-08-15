/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import {
  ConnectedComponent,
  ConnectedComponentProps,
} from "@folio/stripes-connect";
import { StripesType } from "@folio/stripes-smart-components";
import React, { ComponentType, ReactNode } from "react";

jest.mock(
  "@folio/stripes/core",
  () => {
    const STRIPES = {
      actionNames: [] as any[],
      clone: () => ({ ...STRIPES }),
      connect: () => ({}),
      config: {},
      currency: "USD",
      hasInterface: () => true,
      hasPerm: jest.fn().mockReturnValue(true),
      locale: "en-US",
      logger: {
        log: () => ({}),
      },
      okapi: {
        tenant: "diku",
        url: "https://folio-testing-okapi.dev.folio.org",
      },
      plugins: {},
      setBindings: () => ({}),
      setCurrency: () => ({}),
      setLocale: () => ({}),
      setSinglePlugin: () => ({}),
      setTimezone: () => ({}),
      setToken: () => ({}),
      store: {
        getState: () => ({}),
        dispatch: () => ({}),
        subscribe: () => ({}),
        replaceReducer: () => ({}),
      },
      timezone: "UTC",
      user: {
        perms: {},
        user: {
          id: "b1add99d-530b-5912-94f3-4091b4d87e2c",
          username: "diku_admin",
        },
      },
      withOkapi: true,
    } as unknown as StripesType;

    return {
      ...jest.requireActual("@folio/stripes/core"),
      stripesConnect:
        (Component: ConnectedComponent<ConnectedComponentProps<any>, any>) =>
        ({
          mutator,
          resources,
          ...rest
        }: ConnectedComponentProps<any> & { stripes: StripesType }) => {
          const fakeMutator =
            mutator ||
            Object.keys(Component.manifest).reduce((acc, mutatorName) => {
              const returnValue = (Component.manifest[mutatorName] as any)
                .records
                ? []
                : {};

              acc[mutatorName] = {
                GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
                PUT: jest.fn().mockReturnValue(Promise.resolve()),
                POST: jest.fn().mockReturnValue(Promise.resolve()),
                DELETE: jest.fn().mockReturnValue(Promise.resolve()),
                reset: jest.fn(),
                cancel: jest.fn(),
              };

              return acc;
            }, {} as ConnectedComponentProps<{ rest: any }>["mutator"]);

          const fakeResources =
            resources ||
            Object.keys(Component.manifest).reduce((acc, resourceName) => {
              acc[resourceName] = {
                records: [],
                failed: false,
                hasLoaded: true,
                isPending: false,
                pendingMutations: [],
                successfulMutations: [],
              };

              return acc;
            }, {} as ConnectedComponentProps<{ rest: any }>["resources"]);

          return (
            <Component
              {...rest}
              mutator={fakeMutator as any}
              resources={fakeResources as any}
            />
          );
        },

      useOkapiKy: jest.fn(),

      useNamespace: jest.fn().mockReturnValue(["module-namespace"]),

      useStripes: () => STRIPES,

      withStripes:
        (Component: ComponentType<{ stripes: StripesType }>) =>
        ({ stripes, ...rest }: { stripes: StripesType }) => {
          const fakeStripes = stripes || STRIPES;

          return <Component {...rest} stripes={fakeStripes} />;
        },

      // eslint-disable-next-line react/prop-types
      Pluggable: jest.fn((props) => <>{props.children}</>),

      // eslint-disable-next-line react/prop-types, react/no-unused-prop-types
      IfPermission: (props: { perm: string; children: ReactNode }) => (
        <>{props.children}</>
      ),
    };
  },
  { virtual: true }
);
