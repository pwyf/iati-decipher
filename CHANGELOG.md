# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.10] - 2018-10-06
### Added
 - Separate budgets by @status / @usg:type ([#40](https://github.com/pwyf/iati-org-viz/issues/40); [#3](https://github.com/pwyf/iati-org-viz/issues/3))

### Changed
 - Make counts on summary page include all `budget-line`s and `expense-line`s
 - Pluralise total budgets in nav
 - Remove org ID hover

## [0.0.9] - 2018-10-05
### Added
 - Add pagination to documents ([#47](https://github.com/pwyf/iati-org-viz/issues/47))
 - Add a fade on the loading animation
 - Add a summary to the summary page

### Changed
 - Use ISO 3166 lower case short names for countries

### Fixed
 - Work around XLSX export bug
 - Remove download button if there’s no chart data

## [0.0.8] - 2018-10-04
### Added
 - Add support for `budget-line`s / `expense-line`s that don’t use the `@ref` attribute ([#37](https://github.com/pwyf/iati-org-viz/issues/37))
 - Add spreadsheet download ([#12](https://github.com/pwyf/iati-org-viz/issues/12))

### Changed
 - Restyled document listings to look a bit smarter
 - Ignore document categories from category A (since these are activity categories)
 - Rename “Download XML” to “Source XML”
 - Remove moment.js; use native Date

### Fixed
 - Hide the graph when there’s no data to show ([#57](https://github.com/pwyf/iati-org-viz/issues/57))
 - Display unrecognised DocumentCategory codes nicely

## [0.0.7] - 2018-10-03
### Added
 - Add a summary page
 - Add a footer
 - Add an explanation for why menu items have a disabled state ([#54](https://github.com/pwyf/iati-org-viz/issues/54))
 - Added the requisite codelists as static json files
 - Add recipient country to document link listings ([#56](https://github.com/pwyf/iati-org-viz/issues/56))

### Changed
 - Prevent org ID badge from being orphaned
 - Add language, description and date to document listings
 - Hide second navbar by default
 - Use javascript promises for all HTTP requests ([#53](https://github.com/pwyf/iati-org-viz/issues/53))
 - Improve error handling throughout, including handling invalid org files ([#48](https://github.com/pwyf/iati-org-viz/issues/48))
 - Use IATI codelists as a reference for codelist codes used ([#38](https://github.com/pwyf/iati-org-viz/issues/38))

### Fixed

 - Prevent document search form from being submitted ([#49](https://github.com/pwyf/iati-org-viz/issues/49))
 - Disable autocomplete on document search

## [0.0.6] - 2018-10-01
### Changed
 - Get plugin working on dataset search page

## [0.0.5] - 2018-10-01
### Added
 - Add an MVP website

### Changed
 - Change how document counters work when filters are used

## [0.0.4] - 2018-09-30
### Added
 - Add support for filtering by country / region / organisation
 - Add support for filtering by `budget-line` / `expense-line` ([#36](https://github.com/pwyf/iati-org-viz/issues/36))
 - Show organisation identifier prominently ([#16](https://github.com/pwyf/iati-org-viz/issues/16))
 - Add category and country filters to document search ([#21](https://github.com/pwyf/iati-org-viz/issues/21))

### Fixed
 - Don’t incorrectly identify an activity file with zero activities as an organisation file ([#33](https://github.com/pwyf/iati-org-viz/issues/33))

## [0.0.3] - 2018-09-26
### Added
 - Root node check, to ensure an org file looks like an org file
 - Add support for IATI registry publisher pages, too ([#9](https://github.com/pwyf/iati-org-viz/issues/9))
 - Add a loading animation
 - Move budget graphs into a second level navigation bar ([#22](https://github.com/pwyf/iati-org-viz/issues/22))
 - Disable menu items if the relevant data is not present in the org file ([#13](https://github.com/pwyf/iati-org-viz/issues/13))
 - Add download XML button ([#14](https://github.com/pwyf/iati-org-viz/issues/14))
 - Add link to d-portal ([#18](https://github.com/pwyf/iati-org-viz/issues/18))

### Changed
 - Don’t download file before clicking on it; check metadata instead ([#7](https://github.com/pwyf/iati-org-viz/issues/7))
 - Namespace CSS instead of using `!important`
 - Change how the “back” button works; rename it “exit” ([#32](https://github.com/pwyf/iati-org-viz/issues/32))
 - Hide some menu items at narrow widths

## [0.0.2] - 2018-09-20
### Added
 - Basic support for `total-expenditure`
 - This changelog

## 0.0.1 - 2018-09-19
### Added
 - Basic support for `total-budget`s
 - Basic support for `document-link`s
