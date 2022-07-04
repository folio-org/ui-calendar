/* eslint-disable import/no-duplicates */

// allow TypeScript to permit importing CSS files
declare module "*.css" {
  const styles: { [className: string]: string };
  export = styles;
}

declare module "@folio/stripes-core" {
  import { Context, ReactNode } from "react";

  export type CalloutContextType = {
    sendCallout: (args: {
      type?: "success" | "error" | "warning" | "info";
      timeout?: number;
      message: ReactNode;
    }) => void;
  };

  export const CalloutContext: Context<CalloutContextType>;
}

declare module "@folio/stripes-connect" {
  import { Optional } from "@folio/stripes-components/types/utils";
  import { FunctionComponent } from "react";
  import { RouteComponentProps } from "react-router-dom";

  interface LocalResourceManifest {
    type?: "local";
  }
  type FunctionalPathOrParam<Props> = (
    queryParams: Record<string, string>,
    pathParams: Record<string, string>,
    resources: ConnectedComponentProps<Props>["resources"],
    logger: { log: typeof console.log },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: Props & RouteComponentProps
  ) => string | null;
  interface RestResourceConfiguration<Props> {
    /** the base URL of the service that persists the data */
    root: string;
    /** Relative resource path, below the root */
    path: string | FunctionalPathOrParam<Props>;
    /** Query parameters to always add to the URL */
    params?: Record<string, string | FunctionalPathOrParam<Props>>;
    /** A parameter to control the number of items to request at a time */
    limitParam?: string;
    /** A parameter to control the number of items to skip */
    offsetParam?: string;
    /** Custom headers to send with each request */
    headers?: Record<string, string | FunctionalPathOrParam<Props>>;
    /**
     * The key within the returned object that contains the actual data
     * @example
     * With payload
     * ```
     * { "records": [ ... ], "totalRecords": 17, "somethingElse": ... }
     * ```
     * the key would be `records` as it contains the actual data
     */
    records?: string;
    /**
     * The maximum number of records to fetch; if one request does not yield enough (and more records remain),
     * subsequent requests will be made until this count is reached
     */
    recordsRequired?: number;
    /** The number of records to request at a time (via {@link limitParam}) */
    perRequest?: number;
    /** The key in each record referring to a primary key (defaults to `id`) */
    pk?: string;
    /** If the private key should be generated on the client */
    clientGeneratePk?: boolean;
    /**
     * If fetching is necessary (for example, a component that only creates resources can set this to false).
     * This also accepts a function that will be passed the component's props to determine if fetching is needed.
     */
    fetch?: boolean | ((props: Props) => boolean);
    /** Adds a `GET` property to the response */
    accumulate?: boolean;
    /** Allows requests to be aborted */
    abortable?: boolean;
    /** Aborts requests when the given component is unmounted */
    abortOnUnmount?: boolean;
    /** Permissions required to fetch this resource */
    permissionsRequired?: string[];
    /** What offset into the results should be fetched */
    resultOffset?: number | `${number}` | (() => number);
    /**
     * If errors should cause alert modals displaying the error messages -- if this is disabled, failures
     * must be manually caught via promises or `failedMutations`, otherwise they will not be reported
     */
    throwErrors?: boolean;
  }
  interface RestResourceManifest<Props>
    extends RestResourceConfiguration<Props> {
    type: "rest";
    GET?: Partial<RestResourceConfiguration<Props>>;
    POST?: Partial<RestResourceConfiguration<Props>>;
    PUT?: Partial<RestResourceConfiguration<Props>>;
    DELETE?: Partial<RestResourceConfiguration<Props>>;
    PATCH?: Partial<RestResourceConfiguration<Props>>;
  }
  interface OkapiResourceManifest<Props>
    extends Omit<Optional<RestResourceManifest<Props>, "root">, "type"> {
    type: "okapi";
  }

  export interface ResourceTypeSpec {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    local?: Record<string, unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rest?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    okapi?: Record<string, any>;
  }

  export interface ConnectedComponent<
    Props extends ConnectedComponentProps<Resources>,
    Resources extends ResourceTypeSpec
  > extends FunctionComponent<Props> {
    manifest: {
      [resource in keyof Resources["local"]]: LocalResourceManifest;
    } & {
      [resource in keyof Resources["rest"]]: RestResourceManifest<Props>;
    } & {
      [resource in keyof Resources["okapi"]]: OkapiResourceManifest<Props>;
    };
  }

  interface MutatorMeta<ResourceName> {
    /** The `dataKey` used when this component was connected, if any */
    dataKey?: string;
    /** The resource being mutated */
    resource: ResourceName;
    /** The requesting module, as registered with stripes.connect */
    module?: string;
  }

  export type LocalResourceMutationType =
    | "@@stripes-connect/LOCAL_UPDATE"
    | "@@stripes-connect/LOCAL_REPLACE";

  interface MutatorResponse<
    ResourceName,
    PayloadType,
    OperationType extends LocalResourceMutationType
  > {
    meta: MutatorMeta<ResourceName>;
    payload: PayloadType;
    type: OperationType;
  }

  export interface ConnectedComponentProps<Resources extends ResourceTypeSpec> {
    resources: {
      [resource in keyof Resources["local"]]: Resources["local"][resource];
    } & {
      [resource in keyof (Resources["okapi"] & Resources["rest"])]: {
        /** The `dataKey` used when this component was connected, if any */
        dataKey?: string;
        /** If the last request failed */
        failed: boolean;
        /** Mutations which have failed */
        failedMutations?: {
          /** The `dataKey` used when this component was connected, if any */
          dataKey: string;
          /** The error message */
          message: string;
          /** The requesting module, as registered with stripes.connect */
          module: string;
          /** If error messages are thrown and alerted directly */
          throwErrors: boolean;
          /** The name of the resource */
          resource: resource;
          /** The type of mutation */
          type: "DELETE" | "POST" | "PUT";
        }[];
        /** If the initial records have loaded */
        hasLoaded: boolean;
        /** Headers from the last request */
        headers?: Headers;
        /** The last request's HTTP status */
        httpStatus?: number;
        /** If requests are currently loading */
        isPending: boolean;
        /** When the records finished loading */
        loadedAt?: Date;
        /** The requesting module, as registered with stripes.connect */
        module?: string;
        /** Other properties returned by the API */
        other?: Record<string, unknown>;
        /** Seems to be an empty array */
        pendingMutations: never[];
        /** The fetched records */
        records: (Resources["okapi"] & Resources["rest"])[resource][];
        /** The name of the resource */
        resource?: resource;
        /** Completed mutations */
        successfulMutations: {
          /** The type of mutation */
          type: "DELETE" | "POST" | "PUT";
          /** The record the mutation applied to */
          record: Partial<(Resources["okapi"] & Resources["rest"])[resource]>;
        }[];
        /** If error messages are thrown and alerted directly */
        throwErrors?: boolean;
        /** The URL of the last request */
        url?: string;
      };
    };
    mutator: {
      [resource in keyof Resources["local"]]: {
        /** Merge the provided object into the current resource, Object.assign style */
        update: (
          newData: Partial<Resources["local"][resource]>
        ) => MutatorResponse<
          resource,
          Resources["local"][resource],
          "@@stripes-connect/LOCAL_UPDATE"
        >;
        /** Replace the current resource with the provided resource */
        replace: (
          newData: Resources["local"][resource]
        ) => MutatorResponse<
          resource,
          Resources["local"][resource],
          "@@stripes-connect/LOCAL_REPLACE"
        >;
      };
    } & {
      [resource in keyof (Resources["rest"] & Resources["okapi"])]: {
        /** Attempt to cancel the requests; requires `abortable` be enabled */
        cancel: () => void;
        /** Reset the internal cache, only available if `accumulate` is enabled */
        reset?: () => void;
        /**
         * Send a GET request, only available if `accumulate` is enabled.  Returns the requested items.
         * It may be wise to call `reset` after this if you do not want the newly-gotten items to pollute
         * the existing `resources`.
         */
        GET?: (args?: {
          params?: RestResourceConfiguration<never>["params"];
        }) => Promise<(Resources["rest"] & Resources["okapi"])[resource][]>;
        /** Sends a POST request */
        POST: (
          data: (Resources["rest"] & Resources["okapi"])[resource],
          options?: { silent?: boolean }
        ) => Promise<(Resources["rest"] & Resources["okapi"])[resource]>;
        /** Sends a PUT request */
        PUT: (
          data: (Resources["rest"] & Resources["okapi"])[resource],
          options?: { silent?: boolean }
        ) => Promise<(Resources["rest"] & Resources["okapi"])[resource]>;
        /** Sends a DELETE request */
        DELETE: (
          data: Partial<(Resources["rest"] & Resources["okapi"])[resource]>,
          options?: { silent?: boolean }
        ) => Promise<void>;
      };
    };
  }
}

declare module "@folio/stripes-smart-components" {
  import { PaneProps } from "@folio/stripes-components/types/lib/Pane/Pane";
  import {
    ConnectedComponent,
    ConnectedComponentProps,
    ResourceTypeSpec,
  } from "@folio/stripes-connect";
  import { Location } from "history";
  import { Component, ComponentType, ReactNode, RefObject } from "react";
  import { Subtract } from "utility-types";

  export interface StripesType {
    connect: <
      Props extends ConnectedComponentProps<Resources>,
      Resources extends ResourceTypeSpec
    >(
      component: ConnectedComponent<Props, Resources>,
      moduleName?: string | { dataKey: string }
    ) => ComponentType<Subtract<Props, ConnectedComponentProps<Resources>>>;
  }

  export interface SettingsProps {
    additionalRoutes?: ReactNode[];
    navPaneWidth?: PaneProps["defaultWidth"];
    pages: {
      route: string;
      label: ReactNode;
      component: ComponentType<Record<string, never>>;
      perm?: string[];
    }[];
    paneTitle?: ReactNode;
    paneTitleRef?: RefObject<HTMLDivElement>;
    location: Location;
    showSettings?: boolean;
    stripes: StripesType;
    forceRender: number;
  }

  export class Settings extends Component<SettingsProps> {}
}
