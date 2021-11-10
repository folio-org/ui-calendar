# Change history for ui-calendar

## IN PROGRESS

* Upgrade `@folio/react-intl-safe-html` for compatibility with `@folio/stripes` `v7`. Refs UICAL-173.
* Fix issue when after the transition from summer to winter time, the graphical interface displays Exception Period one day less. Refs UICAL-181.
* Improve grammar in pull request template. Refs UICAL-184.
* Remove `react-dnd` and `react-dnd-html5-backend` by security vulnerability reason. Refs UICAL-182.
* Fix spacing on exception modal service point picker. Refs UICAL-145.
* Use constant instead of hardcoded value for query limit. Refs UICAL-185.

## [7.0.1] (https://github.com/folio-org/ui-calendar/tree/v7.0.1) (2021-11-11)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v7.0.0...v7.0.1)

* Fix long exception periods display wrong days and subsequent exception periods display on the wrong days. Refs UICAL-175.

## [7.0.0] (https://github.com/folio-org/ui-calendar/tree/v7.0.0) (2021-09-30)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v6.1.2...v7.0.0)

* Fix import paths. Refs UICAL-139.
* Compile Translation Files into AST Format. Refs UICAL-138.
* Fix failed test. Refs UICAL-150.
* Fix calendar exceptions displaying on wrong day of week (offset by a day). Refs UICAL-152.
* Fix that last day of work library is carried over to the previous day. Refs UICAL-157.
* Fix the issue when time period is not displayed if the end date is current. Refs UICAL-127
* Fix failed build on `ui-calendar`. Refs UICAL-162.
* Increment `stripes` to `v7`, `react` to `v17`. Refs UICAL-154.
* Fix issue when viewing library hours causes browser crash after viewing other settings. Refs UICAL-134.

## [6.1.2] (https://github.com/folio-org/ui-calendar/tree/v6.1.2) (2021-08-04)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v6.1.1...v6.1.2)

* Fix failed test. Refs UICAL-150.

## [6.1.1] (https://github.com/folio-org/ui-calendar/tree/v6.1.1) (2021-08-04)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v6.1.0...v6.1.1)

* Use react-intl for date formatting. Refs UICAL-148.

## [6.1.0] (https://github.com/folio-org/ui-calendar/tree/v6.1.0) (2021-06-15)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v6.0.0...v6.1.0)

* Update the .gitignore file. Refs UICAL-135.
* Add pull request template. Refs UICAL-136.
* Fix failed test. Refs UICAL-144.

## [6.0.0](https://github.com/folio-org/ui-calendar/tree/v6.0.0) (2021-03-09)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v5.0.1...v6.0.0)

* Remove unused `react-bootstrap` dependency. Refs UICAL-123.
* Calendar `Datepicker` cut off in add exception screen. Refs UICAL-124.
* Update to stripes v6. Refs UICAL-128.
* Move moment from a regular to a peer and dev dependencies. Refs UICAL-122.
* Increment `@folio/stripes-cli` to `v2`. Refs UICAL-131.

## [5.0.1](https://github.com/folio-org/ui-calendar/tree/v5.0.1) (2021-02-26)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v5.0.0...v5.0.1)

* Calendar hours displaying on wrong day of week (offset by a day). Refs UICAL-132.

## [5.0.0](https://github.com/folio-org/ui-calendar/tree/v5.0.0) (2020-10-08)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v4.0.0...v5.0.0)

* Replace `bigtest/mirage` with `miragejs`.
* Update `@folio/stripes` to `v5`, `react-router` to `v5.2`, `react-intl` to `v5.7`.
* Update translation strings.

## [4.0.0](https://github.com/folio-org/ui-calendar/tree/v4.0.0) (2020-06-10)
[Full Changelog](https://github.com/folio-org/ui-calendar/compare/v3.0.0...v4.0.0)

* Fix failing test. Refs UICAL-105.
* Pin `moment` at `~2.24.0`. Refs STRIPES-678.
* Purge `intlShape` in prep for `react-intl` `v4` migration. Increment `stripes` to `v4.0`, `react-intl` to `v4.5`. Refs STRIPES-672.
* Use correct prop-type for `childen` in `ErrorBoundary`.
* Prefer `stripes.actsAs` to the deprecated `stripes.type` in `package.json`. Refs STCOR-148.
* Fix incorrect footer positioning. Refs UICAL-107.
* Localize permission names. Refs UICAL-118.

## [3.0.0](https://github.com/folio-org/ui-calendar/tree/v3.0.0) (2020-03-12)
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
