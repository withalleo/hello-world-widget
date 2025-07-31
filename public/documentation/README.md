# Hello World - _Alleo widget_

A simple Hello World widget

## Information

| []()         | []()                                     |
| ------------ | ---------------------------------------- |
| Icon         | ![Icon](.././assets/icon.png)            |
| Version      | `1.1.17`                                 |
| Widget id    | `hello-world`                            |
| Author       | [Benedek Toth](mailto:tothben@gmail.com) |
| Publisher id | `com.withalleo`                          |
| Default size | 150 x 40                                 |

## Settings

### `DefaultHelloWorldLabel`

Default in configuration: `Hello Alleo!`

## Scopes for shared settings

- `default-colors`
- `settings-dialog`
- `color-picker`

## Changelog

### 1.1.1

- change icon urls to relative path in ALL WIDGETS

### 1.1.2

- Init widget service

### 1.1.3

- Update vite and configuration

### 1.1.7

- update Hello World widget
- review widget terminology and setting menus

### 1.1.9

- minor hello world changes
- add demo form elements.
- add more demo setting types
- hello world: update board object selector sample
- hello world: add dependent form values sample
- update settings menus and widgets names

### 1.1.10

- simplify .gitignore files
- code cleanup

### 1.1.11

- force pointer events if widget is interactible.
- Revert "Merged PR 1727: force pointer events if widget is interactible.

### 1.1.13

- hello world: reorganize the settings dialog by using tabs

### 1.1.14

- update changelogs

### 1.1.17

- add widgetId and publisherId to all widget manifest.json files
- Use WidgetSettings in widgets to support deployment / organization settings
- add settingsScopes to the widget manifests, to allow using settings based on scopes defined in the admin.
- add settings-dialog to settingsScopes for widgets having a setting dialog
- add color-picker to settingsScopes for widgets having a color picker or color switcher
- update documentation
