# price-checker-api

![Maintenance](https://img.shields.io/maintenance/yes/2020?style=flat-square)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/octavian-regatun/price-checker-backend/blob/master/LICENSE.md)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/xojs/xo)

This is a API that will search products on all the specified <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/1200px-Flag_of_Romania.svg.png" width="16"> Romanian <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/1200px-Flag_of_Romania.svg.png" width="16"> shopping sites and returns an array with information about the products found.

## APIs for the following online stores
- [x] **[PcGarage](https://www.pcgarage.ro/)**
- [ ] **[eMAG](https://www.emag.ro/)**
- [ ] **[Altex](https://altex.ro/)**
- [ ] **[Media Galaxy](https://mediagalaxy.ro/)**
- [ ] **[evoMAG](https://evomag.ro/)**
- [ ] **[CEL](https://cel.ro/)**
- [ ] **[Flanco](https://flanco.ro/)**
- [ ] **[Domo](https://domo.ro/)**

## Main stuff used
- **[Cheerio](https://www.npmjs.com/package/cheerio)** (web scraping)

# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2020-07-1

### Changed

- rename request function from PcGarage API to requestFirstPage
- update PcGarage API acordingly to the site updates

## [0.2.3] - 2020-06-29

### Changed

- rewrite index.js

## [0.2.2] - 2020-06-28

### Changed

- README.md title

## [0.2.1] - 2020-06-28

### Added

- index.js as a entry point for the package

## [0.2.0] - 2020-06-28

### Added

- support for **[PcGarage](https://www.pcgarage.ro)** site 

## [0.1.2] - 2020-06-28

### Added

- initialize repository
