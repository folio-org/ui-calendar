# ui-calendar

Copyright (C) 2017-2022 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This is a [Stripes](https://github.com/folio-org/stripes-core/) UI module
for institutional calendar functions.

## Prerequisites

To setup a Stripes development workspace (needed if you plan on editing multiple stripes packages at once), see
[this page](https://github.com/folio-org/stripes-core/blob/master/doc/new-development-setup.md). If you do not need to edit multiple packages, you may simply clone this repo and run `yarn install` within.

In order to view and log into the module, you must use an existing Okapi backend. You can set one up [using the `testing-backend` Vagrant box](https://app.vagrantup.com/folio/boxes/testing-backend) or use some other Okapi server.

## Run the module

Run the following from this directory to serve the module on your local machine (with a local Okapi installation):

```
stripes serve
```

_Note: you may need to replace `stripes` with `npx stripes` depending on your shell's path resolution._

To use a different tenant and/or Okapi instance, you can use the `--okapi` and `--tenant` parameters:

```
stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

## Run the tests

You can run the test suite with:

```
yarn test
```

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UICAL](https://issues.folio.org/browse/UICAL)
at the [FOLIO issue tracker](https://dev.folio.org/community/guide-issues).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
