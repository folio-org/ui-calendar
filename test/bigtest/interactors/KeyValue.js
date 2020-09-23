import {
  interactor,
  scoped,
} from '@bigtest/interactor';

export default interactor(class KeyValue {
  label = scoped('[class^="kvRoot-"] div');
  value = scoped('[class^="kvRoot-"] div:nth-child(2)');

  editButton = scoped('[class^="kvRoot-"] div:nth-child(2) button');
});
