import UserNameDisplay from './UserNameDisplay';
import expectRender from '../test/util/expectRender';
import * as Users from '../test/data/Users';

test('User Interface works as expected', () => {
  const johann = { user: Users.JOHANN_DZIERZON };
  expectRender(UserNameDisplay(johann)).toBe('Dzierzon, Jan');

  const langstroth = { user: Users.L_L_LANGSTROTH };
  expectRender(UserNameDisplay(langstroth)).toBe(
    'Langstroth, Lorenzo Lorraine'
  );

  const doe = { user: Users.MYSTERY_MAN };
  expectRender(UserNameDisplay(doe)).toBe('Doe');

  const empty = { user: Users.NO_NAME };
  expectRender(UserNameDisplay(empty)).toBe('');

  const joe = { user: Users.JOE };
  expectRender(UserNameDisplay(joe)).toBe('joe');

  const joe2 = { user: Users.JOE2 };
  expectRender(UserNameDisplay(joe2)).toBe('JOE!');

  const mid = { user: Users.MID };
  expectRender(UserNameDisplay(mid)).toBe('Middle');

  const midLast = { user: Users.MID_LAST };
  expectRender(UserNameDisplay(midLast)).toBe('Last, Middle');

  const unnamed2 = { user: Users.EMPTY_2 };
  expectRender(UserNameDisplay(unnamed2)).toBe('');
});
