// allow TypeScript to permit importing CSS files
declare module "*.css" {
  const styles: { [className: string]: string };
  export = styles;
}

declare module "@folio/stripes-components" {
  import * as H from "history";
  import {
    Component,
    CSSProperties,
    FunctionComponent,
    ReactNode,
  } from "react";
  import { FieldInputProps, FieldMetaState } from "react-final-form";

  // either children or innerText must be provided
  export const OptionSegment: FunctionComponent<
    {
      searchTerm?: string;
    } & ({ children: ReactNode } | { innerText: string })
  >;

  type IconName =
    | "allocate"
    | "archive"
    | "arrow-down"
    | "arrow-left"
    | "arrow-right"
    | "arrow-up"
    | "bookmark"
    | "calendar"
    | "cancel"
    | "caret-down"
    | "caret-left"
    | "caret-right"
    | "caret-up"
    | "cart"
    | "check-circle"
    | "check-in"
    | "check-out"
    | "chevron-double-left"
    | "chevron-double-right"
    | "chevron-left"
    | "chevron-right"
    | "clipboard"
    | "clock"
    | "combine"
    | "comment"
    | "default"
    | "deselect-all"
    | "diacritic"
    | "document"
    | "download"
    | "drag-drop"
    | "duplicate"
    | "edit"
    | "ellipsis"
    | "end-mark"
    | "envelope"
    | "exclamation-circle"
    | "external-link"
    | "eye-closed"
    | "eye-open"
    | "flag"
    | "gear"
    | "house"
    | "indexes"
    | "info"
    | "lightning"
    | "link"
    | "lock"
    | "play"
    | "plus-sign"
    | "preview"
    | "print"
    | "profile"
    | "question-mark"
    | "receive"
    | "refresh"
    | "replace"
    | "report"
    | "save"
    | "search"
    | "select-all"
    | "source"
    | "tag"
    | "times-circle-solid"
    | "times-circle"
    | "times"
    | "transfer"
    | "trash"
    | "triangle-down"
    | "triangle-up"
    | "unlink";

  class Headline extends Component<{
    block?: boolean;
    bold?: boolean;
    children: ReactNode;
    className?: string;
    faded?: boolean;
    flex?: boolean;
    margin:
      | "xx-small"
      | "x-small"
      | "small"
      | "medium"
      | "large"
      | "x-large"
      | "xx-large"
      | "none"
      | "";
    size?: "small" | "medium" | "large" | "x-large" | "xx-large";
    tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "legend";
    weight?: "regular" | "medium" | "bold" | "black";
  }> {}
  class IconButton extends Component<{
    "aria-expanded"?: boolean;
    "aria-haspopup"?: string | boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    autoFocus?: boolean;
    badgeColor?: string;
    badgeCount?: string | number;
    className?: string;
    href?: string;
    icon: IconName;
    iconClassName?: string;
    iconSize?: "small" | "medium";
    id?: string;
    innerClassName?: string;
    onClick?: Function;
    onMouseDown?: Function;
    size?: "small" | "medium";
    style?: CSSProperties;
    tabIndex?: string;
    to?: H.LocationDescriptor;
    type?: string;
  }> {}
  class Loading extends Component<{}> {}
  class Icon extends Component<{
    ariaLabel?: string;
    children?: ReactNode;
    icon: IconName;
    iconClassName?: string;
    iconPosition?: "start" | "end";
    iconRootClass?: string;
    iconStyle?: "action";
    id?: string;
    size?: "small" | "medium" | "large";
    status?: "error" | "warn" | "success";
    tabIndex?: string;
  }> {}
  class Pane extends Component<any> {}

  class MultiSelection<OptionType = { label: string }> extends Component<{
    input: FieldInputProps<OptionType[], HTMLElement>;
    meta: FieldMetaState<OptionType[]>;

    actions?: { onSelect: Function }[];
    ariaLabelledBy?: string;
    asyncFiltering?: boolean;
    autoFocus?: boolean;
    backspaceDeletes?: boolean;
    dataOptions?: OptionType[];
    dirty?: boolean;
    disabled?: boolean;
    emptyMessage?: string;
    error?: ReactNode;
    filter?: (
      filterText: string | undefined,
      list: OptionType[]
    ) => { renderedItems: OptionType[]; exactMatch?: boolean };
    formatter?: (
      option: OptionType,
      searchTerm: string | undefined
    ) => ReactNode;
    id?: string;
    isValid?: boolean;
    itemToString?: (option: OptionType) => string;
    label?: ReactNode;
    maxHeight?: number;
    modifiers?: object;
    onBlur?: Function;
    onChange?: Function;
    onRemove?: Function;
    placeholder?: string;
    renderToOverlay?: boolean;
    required?: boolean;
    validationEnabled?: boolean;
    value?: OptionType[];
    valueFormatter?: (option: OptionType) => ReactNode;
    warning?: ReactNode;
  }> {}
}
