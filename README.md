# ui-calendar
Copyright (C) 2017-2018 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction
This is a [Stripes](https://github.com/folio-org/stripes-core/) UI module
for institutional calendar functions.
## Additional information

Other [modules](http://dev.folio.org/source-code/#client-side).

See project [UICAL](https://issues.folio.org/browse/UICAL)
at the [FOLIO issue tracker](http://dev.folio.org/community/guide-issues).

Other FOLIO Developer documentation is at [dev.folio.org](http://dev.folio.org/)

## Set up development environment
Check out [Qulto's react-big-calendar fork](https://github.com/qultoltd/react-big-calendar). 
Run yarn install, yarn build in the module's directory. This is necessary because some files are used from the generated /lib directory (e.g. CSS files).

For setting up the UI, follow the instructions provided [on this page](https://github.com/folio-org/stripes-core/blob/master/doc/new-development-setup.md).

The react-big-calendar module has to be added in the .stripesclirc file. E.g. "@folio/react-big-calendar": "../react-big-calendar"

To use the calendar your user needs to have the permission for the calendar functions. You can add the permission (Calendar permissions [calendar.collection.all]) in the Users app.
