import React from 'react';
import type { User } from '../types/types';

export interface UserNameDisplayProps {
  user: User;
}

// from ui-users components/util/util.js
export default function UserNameDisplay({ user }: UserNameDisplayProps) {
  let fullName = user?.personal?.lastName || '';
  let givenName =
    user?.personal?.preferredFirstName || user?.personal?.firstName || '';

  const middleName = user?.personal?.middleName || '';

  if (middleName) {
    givenName += `${givenName ? ' ' : ''}${middleName}`;
  }

  if (givenName) {
    fullName += `${fullName ? ', ' : ''}${givenName}`;
  }

  return <span>{fullName}</span>;
}
