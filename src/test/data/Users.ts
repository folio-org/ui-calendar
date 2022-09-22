import { User } from '../../types/types';

// https://en.wikipedia.org/wiki/Petro_Prokopovych
export const PETRO_PROKOPOVYCH: User = {
  id: 'c7913bd5-f73d-50c9-ae52-63479e632615',
  username: 'petro_prokopovych',
  personal: {
    lastName: 'Prokopovych',
    firstName: 'Petro'
  }
};

export const MYSTERY_MAN: User = {
  id: 'c7913bd5-f73d-50c9-ae52-63479e632615',
  username: 'petro_prokopovych',
  personal: {
    lastName: 'Doe',
    firstName: undefined,
    middleName: undefined
  }
};

export const NO_NAME: User = {
  id: 'c7913bd5-f73d-50c9-ae52-63479e632615',
  username: 'petro_prokopovych',
  personal: {
    lastName: '',
    firstName: '',
    middleName: ''
  }
};

// https://en.wikipedia.org/wiki/Johann_Dzierzon
export const JOHANN_DZIERZON: User = {
  id: 'c951334c-03da-5778-ba45-7eae5b3afbe8',
  username: 'jdzierzon',
  personal: {
    lastName: 'Dzierzon',
    firstName: 'Johann',
    preferredFirstName: 'Jan'
  }
};

// https://en.wikipedia.org/wiki/L._L._Langstroth
export const L_L_LANGSTROTH: User = {
  id: '9440d11b-f0fa-5f53-aceb-6b1101a54abc',
  username: 'lllangstroth',
  personal: {
    lastName: 'Langstroth',
    firstName: 'Lorenzo',
    middleName: 'Lorraine'
  }
};

export const JOE: User = {
  id: '9440d11b-f0fa-5f53-aceb-6b1101a54abc',
  username: 'lllangstroth',
  personal: {
    lastName: '',
    preferredFirstName: 'joe'
  }
};

export const JOE2: User = {
  id: '9440d11b-f0fa-5f53-aceb-6b1101a54abc',
  username: 'lllangstroth',
  personal: {
    lastName: '',
    preferredFirstName: undefined,
    firstName: 'JOE!'
  }
};

export const MID: User = {
  id: '9440d11b-f0fa-5f53-aceb-6b1101a54abc',
  username: 'lllangstroth',
  personal: {
    lastName: '',
    middleName: 'Middle'
  }
};
