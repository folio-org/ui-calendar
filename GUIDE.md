# Opening hours guide

Copyright (C) 2017-2018 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file _[LICENSE](LICENSE)_ for more information.

## Introduction

This is a UI module for maintaining service point opening hours.

## Terminology

* `Regular Library Hours Validity Period`: normal opening hours for a service point between two dates.
* `Regular Library Hours`: time frames defined for week days which defines the opening hours and closing times for a  a `Regular Library Hours Validity Period`.
* `Exception Period`: overrides `Regular Library Hours` for specific dates and service points.
* `All day opening`: the service point is open from 00:00 to 24:00.

## Usage

### Regular Library Hours Validity Period
#### _Add new_

1. From the settings menu navigate to Calendar -> Library hours.
2. Select the appropriate service point.
3. Click _New_ under the _Regular Library Hours_ label.
4. Specify the date range when the period will be valid. You can leave _Valid To_ field empty. In this case the validity affects for the future with no end.
5. Name your validity period (e.g.: Study Period).
6. Using your mouse specify the time ranges for every day of the week by dragging. When you leave a column empty that means the service point is closed on that day. If you would like to specify a non-stop opening simply click on the _All day opening_.
7. If you would like to remove an opening simply click on the _X_ (right upper corner of the blue box).
8. Click _Save_.

> Currently you have to define Regular Library Hours for all the service points separately.

#### _Modify_

1. From the settings menu navigate to Calendar -> Library hours.
2. Select the appropriate service point.
3. Click on the period you would like to modify.
4. Follow the steps above from step 4.

#### _Delete_

1. From the settings menu navigate to Calendar -> Library hours.
2. Select the appropriate service point.
3. Click on the period you would like to modify.
4. Click _Delete_ button.

### Exception Period
#### _Add new_

1. From the settings menu navigate to Calendar -> Library hours.
2. Select a service point.
3. Click _Open calendar
to add exceptions_.
4. Click _New Exception Period_ (right upper corner).
5. Specify the date range when the period will be valid.
6. Name the exception period (e.g.: 2018 Christmas).
7. Select the service points that will be effected by the exception.
8. Now you have two options:
 * defining an exception when the service point is closed instead of the regular opening. In this case click _Closed_. You can define closed period only for a whole day.
 * defining an exception when the service point is open, the exceptional opening hours overwrite the regular opening (and closing) hours. Specify the opening and closing time.
9. Click _Save_.

> As you can see exceptions can be defined for several service points at the same time.

#### _Modify_

1. From the settings menu navigate to Calendar -> Library hours.
2. Select a service point.
3. Click on the period in the calendar which you would like to modify.
4. Follow the steps above from step 5.

#### _Delete_

1. From the settings menu navigate to Calendar -> Library hours.
2. Select a service point.
3. Click on the period in the calendar which you would like to remove.
4. Click _Delete_ button.
