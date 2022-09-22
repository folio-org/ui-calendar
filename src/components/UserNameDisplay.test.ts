import UserNameDisplay from './UserNameDisplay';
import expectRender from '../test/util/expectRender';
import {
  JOHANN_DZIERZON,
  L_L_LANGSTROTH,
  MYSTERY_MAN
} from '../test/data/Users';

test('User Interface works as expected', () => {
  const johann = { user: JOHANN_DZIERZON };
  expectRender(UserNameDisplay(johann)).toBe('Dzierzon, Jan');

  const langstroth = { user: L_L_LANGSTROTH };
  expectRender(UserNameDisplay(langstroth)).toBe(
    'Langstroth, Lorenzo Lorraine'
  );

  const doe = { user: MYSTERY_MAN };
  expectRender(UserNameDisplay(doe)).toBe('Doe');
});
