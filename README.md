teszt
# ui-calendar

Copyright (C) 2017-2018 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This is a [Stripes](https://github.com/folio-org/stripes-core/) UI module
for institutional calendar functions.

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UICAL](https://issues.folio.org/browse/UICAL)
at the [FOLIO issue tracker](https://dev.folio.org/community/guide-issues).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)

## Set up development environment

For setting up the UI, follow the instructions provided [on this page](https://github.com/folio-org/stripes-core/blob/master/doc/new-development-setup.md).

If you want to work in the react-big-calendar module (which is the library responsible for rendering the calendar view), it has to be added in the .stripesclirc file, e.g. "@folio/react-big-calendar": "../react-big-calendar"

To use the calendar your user needs to have the permission for the calendar functions. You can add the permission (Calendar permissions [calendar.collection.all]) in the Users app.
