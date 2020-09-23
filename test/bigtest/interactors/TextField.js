import {
  interactor,
  clickable,
  focusable,
  blurrable,
  value,
  fillable,
} from '@bigtest/interactor';

export default @interactor class TextFieldInteractor {
  val = value();
  fill = fillable();

  fillAndBlur(val) {
    return this.fill(val)
      .blur();
  }

  clickInput = clickable();
  blurInput = blurrable();
  focusInput = focusable();
}
