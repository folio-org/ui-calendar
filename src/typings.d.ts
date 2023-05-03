// allow TypeScript to permit importing CSS files
declare module '*.css' {
  const styles: { [className: string]: string };
  export = styles;
}

declare module 'json-stringify-safe';

declare module '@folio/stripes/core' {
  export = STCOR;
}

declare module '@folio/stripes/smart-components' {
  export = STSMACOM;
}

declare module '@folio/stripes/components' {
  export = STCOM;
}

declare module '@folio/stripes/final-form' {
  export = STRIPESFF;
}
