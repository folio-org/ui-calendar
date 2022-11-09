import { ServicePointDTO } from '../../data/types';
import { ServicePoint } from '../../types/types';

const ADDITIONAL_DTO_PROPERTIES: Pick<
  ServicePointDTO,
  'code' | 'discoveryDisplayName' | 'staffSlips' | 'metadata'
> = {
  code: 'n/a',
  discoveryDisplayName: 'n/a',
  staffSlips: [],
  metadata: undefined
};

export const SERVICE_POINT_1: ServicePoint = {
  id: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
  name: 'Service point 1',
  inactive: false
};
export const SERVICE_POINT_1_DTO: ServicePointDTO = {
  ...ADDITIONAL_DTO_PROPERTIES,
  ...SERVICE_POINT_1
};

export const SERVICE_POINT_2: ServicePoint = {
  id: '3b071ddf-14ad-58a1-9fb5-b3737da888de',
  name: 'Service point 2',
  inactive: false
};
export const SERVICE_POINT_2_DTO: ServicePointDTO = {
  ...ADDITIONAL_DTO_PROPERTIES,
  ...SERVICE_POINT_2
};

export const SERVICE_POINT_3: ServicePoint = {
  id: 'c085c999-3600-5e06-a758-d052565f89fd',
  name: 'c085c999-3600-5e06-a758-d052565f89fd',
  inactive: false
};
export const SERVICE_POINT_3_DTO: ServicePointDTO = {
  ...ADDITIONAL_DTO_PROPERTIES,
  ...SERVICE_POINT_3
};

export const SERVICE_POINT_4: ServicePoint = {
  id: '7a5e720f-2dc2-523a-b77e-3c996578e241',
  name: '7a5e720f-2dc2-523a-b77e-3c996578e241',
  inactive: false
};
export const SERVICE_POINT_4_DTO: ServicePointDTO = {
  ...ADDITIONAL_DTO_PROPERTIES,
  ...SERVICE_POINT_4
};

export const ONLINE: ServicePoint = {
  id: '7c5abc9f-f3d7-4856-b8d7-6712462ca007',
  name: 'Online',
  inactive: false
};
export const ONLINE_DTO: ServicePointDTO = {
  ...ADDITIONAL_DTO_PROPERTIES,
  ...ONLINE
};

export const CYPRESS_TEST_SERVICE_POINT: ServicePointDTO = {
  id: 'ea414290-0e76-47dd-935d-d0fa6ed10ca9',
  name: 'Test service point',
  code: 'n/a',
  discoveryDisplayName: 'n/a',
  staffSlips: [],
  metadata: undefined
};

export default [
  SERVICE_POINT_1,
  SERVICE_POINT_2,
  SERVICE_POINT_3,
  SERVICE_POINT_4,
  ONLINE,
  CYPRESS_TEST_SERVICE_POINT
];
