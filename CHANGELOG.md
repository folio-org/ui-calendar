# Change history for ui-calendar

## [1.0.0]

* Create basic calendar application using react-big-calendar (UICAL-1)
* Create settings page for the module (UICAL-2)
* Update module with react-big-calendar changes (UICAL-5)
* Fix save error when adding multiple times within a day (UICAL-6)
* Filter events by date (UICAL-11)
* Show event details on click (UICAL-12)
* Lock react-bootstrap to v0.32.1 to avoid buggy babel-runtime 7.0.0-beta.42 dep. Refs FOLIO-1425.

## [1.0.1] (2018.08.02)
* Rethink calendar ui
* https://drive.google.com/open?id=10LT0QsVXKYRD1LRRaVAdlYk02-XUyZjX

## [2.0.0] (2018.09.19)

* Relocate language files - UICAL-19
* Fix ui-calendar build error - UICAL-28
* List available service points - UICAL-23
* Implement service point panel - UICAL-24
* Implement new Regular Library Hours Validity Period panel - UICAL-26
* Implement delete and modify Regular Library Hours Validity Period - UICAL-30
* Implement delete opening hour - UICAL-31
* Add validations to opening periods - UICAL-32
* Confirm dialog before delete opening period	- UICAL-38
* Confirm dialog before closing editing opening period - UICAL-39

## [2.0.1] (2018.09.19)

* Fix release version

## [2.0.2] (2018.09.19)

* Increase node version

## [2.0.3] (2018.09.19)

* Eliminate linter errors

## [2.0.4] (2018.09.20)

* Update reac-big-calendar dependency - UICAL-42

## [2.0.6] (2018.12.07)

* Replace stripes intl with react-intl - UICAL-50
* Update ui-calendar translations - UICAL-51

## [2.1.0](https://github.com/folio-org/ui-calendar/tree/v2.1.0) (2019-03-14)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.0.6...v2.1.0)

* Update translation strings
* Fix applying locale date format for whole module
* Change BE interface version
* Apply UTC time zone for date/time controls (UICAL-55)

## [2.1.1](https://github.com/folio-org/ui-calendar/tree/v2.1.1) (2019-03-15)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.1.0...v2.1.1)

* Remove moment js convertation for string dates

## [2.1.2](https://github.com/folio-org/ui-calendar/tree/v2.1.2) (2019-03-29)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.1.1...v2.1.2)

* Correct stripes dependency to `^2.0.0`

## [2.1.3](https://github.com/folio-org/ui-calendar/tree/v2.1.3) (2019-05-07)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.1.2...v2.1.3)

* Update ui-calendar translations
* Fix sending of incorrect model to BE (UICAL-60)
* Add BigTest setup

## 2.2.0 (IN PROGRESS)

* Prune deps to remove transitive dep on js-yaml v3.7.0 via css-loader > cssnano > postcss-svgo > svgo. Refs FOLIO-2083.
