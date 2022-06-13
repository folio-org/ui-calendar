// allow TypeScript to permit importing CSS files
declare module "*.css" {
  const styles: { [className: string]: string };
  export = styles;
}
