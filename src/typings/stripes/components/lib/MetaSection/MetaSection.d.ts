import { FunctionComponent, ReactNode } from 'react';
import { User } from '../../../../../types/types';

export interface MetaSectionProps {
  /** HTML id attribute assigned to accordion's content	 */
  contentId?: string;
  /** Name/record of the user who created the record. */
  createdBy?: ReactNode | User;
  /** Date/time a record was created. */
  createdDate?: string;
  /** Sets the heading level of the heading inside the accordion header. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Allows for the concealment of the createdBy and updatedBy information on the display */
  hideSource?: boolean;
  /** HTML id attribute assigned to accordion's root. */
  id?: string;
  /** Name/record of the last user who modified the record. */
  lastUpdatedBy?: ReactNode | User;
  /** Latest date/time a record was modified. */
  lastUpdatedDate?: string;
  /** Should the user name link to the user record? Pass in permissions */
  showUserLink?: boolean;
}

/**
 * Component for displaying record metadata such as the last date/time a record was modified.
 * @example
 * <MetaSection
 *   contentId='userInfoRecordMetaContent'
 *   createdDate={user.createdDate}
 *   headingLevel={4} // Optional
 *   id='userInfoRecordMeta'
 *   lastUpdatedDate={user.updatedDate}
 * />
 */
export const MetaSection: FunctionComponent<MetaSectionProps>;
export default MetaSection;
