# Change history for ui-calendar

## 4.0.0 (IN PROGRESS)

* Fix failing test. Refs UICAL-105.
* Pin `moment` at `~2.24.0`. Refs STRIPES-678.
* Purge `intlShape` in prep for `react-intl` `v4` migration. Refs STRIPES-672.
* Use correct prop-type for `childen` in `ErrorBoundary`.
* Increment `stripes` to `v4.0`, `react-intl` to `v4.5`. Refs STRIPES-672.
* Prefer `stripes.actsAs` to the deprecated `stripes.type` in `package.json`. Refs STCOR-148.

## 3.0.0 ((https://github.com/folio-org/ui-calendar/tree/v3.0.0)
(2020-03-12)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.7.2...v3.0.0)

* Fix bug with the error message is shown when the start and end dates were already entered. Refs UICAL-95.
* Fix bug with ability to create duplicated or overlapped events. Refs UICAL-82.
* Fix issue the "+ more" link is not working, when patron tries to view all the values for the exception day. Refs UICAL-99.
* Handle accessibility issues. Refs UICAL-85.
* Rearrange CHANGELOG to be consistent with other core apps
* Migrate to `stripes` `v3.0.0` and remove `react-intl` from dependencies (it was already a peer).
* Update translations strings.

## [2.7.2](https://github.com/folio-org/ui-calendar/tree/v2.7.2) (2019-12-23)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.7.1...v2.7.2)

* Display the Today, Back and Next buttons on the calendar exceptions screen in the calendar. Refs UICAL-98.

## [2.7.1](https://github.com/folio-org/ui-calendar/tree/v2.7.1) (2019-12-12)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.7.0...v2.7.1)

* Update translations strings.
* Update okapi interface version.

## [2.7.0](https://github.com/folio-org/ui-calendar/tree/v2.7.0) (2019-12-03)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.6.0...v2.7.0)

* Update translations strings
* Add handling of exceptional periods errors - UICAL-81
* Move Save/Cancel buttons to the footer, add a Cancel button to this fixed footer, on New record remove the Delete button - UICAL-92

## [2.6.0](https://github.com/folio-org/ui-calendar/tree/v2.6.0) (2019-10-25)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.5.0...v2.6.0)

* Update translations strings
* Remove non-functional buttons UICAL-79
* Update react-big-calendar version - UICAL-86
* Increase amount of visible service points - UICAL-88

## [2.5.0](https://github.com/folio-org/ui-calendar/tree/v2.5.0) (2019-09-11)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.4.0...v2.5.0)

* Update translations strings

## [2.4.0](https://github.com/folio-org/ui-calendar/tree/v2.4.0) (2019-08-01)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.3.0...v2.4.0)

* Correctly define `settings.calendar.enabled` permission (UICAL-75)
* Update translations strings

## [2.3.0](https://github.com/folio-org/ui-calendar/tree/v2.3.0) (2019-07-24)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.2.0...v2.3.0)

* Add edit button for new periods (UICAL-71)
* Add permission to display settings (UICAL-72)

## [2.2.0](https://github.com/folio-org/ui-calendar/tree/v2.1.3) (2019-06-12)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.1.3...v2.2.0)

* Prune deps to remove transitive dep on js-yaml v3.7.0 via css-loader > cssnano > postcss-svgo > svgo. Refs FOLIO-2083.
* Add timezone support for react-big-calendar
* Cover existing functionality with tests

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

## [2.1.0](https://github.com/folio-org/ui-calendar/tree/v2.1.0) (2019-03-14)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v2.0.6...v2.1.0)

* Update translation strings
* Fix applying locale date format for whole module
* Change BE interface version
* Apply UTC time zone for date/time controls (UICAL-55)

## [2.0.6] (2018.12.07)

* Replace stripes intl with react-intl - UICAL-50
* Update ui-calendar translations - UICAL-51

## [2.0.4] (2018.09.20)

* Update reac-big-calendar dependency - UICAL-42

## [2.0.3] (2018.09.19)

* Eliminate linter errors

## [2.0.2] (2018.09.19)

* Increase node version

## [2.0.1] (2018.09.19)

* Fix release version

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

## [1.0.1] (2018.08.02)
* Rethink calendar ui
* https://drive.google.com/open?id=10LT0QsVXKYRD1LRRaVAdlYk02-XUyZjX

## [1.0.0]

* Create basic calendar application using react-big-calendar (UICAL-1)
* Create settings page for the module (UICAL-2)
* Update module with react-big-calendar changes (UICAL-5)
* Fix save error when adding multiple times within a day (UICAL-6)
* Filter events by date (UICAL-11)
* Show event details on click (UICAL-12)
* Lock react-bootstrap to v0.32.1 to avoid buggy babel-runtime 7.0.0-beta.42 dep. Refs FOLIO-1425.
