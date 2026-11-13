# Setting up a widget

This is a demo template for an Alleo (or compatible) widget.

It includes a very simple "Hello World" widget, with all the necessary boilerplate and preferred development tools to get started.

## Installation

`npm install`

## Code

The widget code is in the `src` folder. The `src/main.ts` file is the entry point for the widget. The `src/style.scss` file contains the widget styles. The `index.html` file in the project root is the HTML template for the widget.

The `manifest.json` file contains the widget metadata. This is used by the Alleo platform to display the widget in the widget library.

The contents of the `public` folder are copied to the `dist` folder when building the widget.

The `public/assets` folder contains the icon (`icon.png`), the preview video (`preview.mp4`), the agentic interface (`interface.json`, see [Agentic interface](#agentic-interface)) and other library elements. It can also contain a `widgetAssets` folder, whose contents can be referenced with the `AssetHelper` utility. All of these are optional.

The `public/documentation` folder contains the widget documentation (see [Recommended documentation](#recommended-documentation)).

## Build

`npm run build-prod`

If the build is successful, the widget will be available in the `dist` folder.

To publish a widget, you will need to have a whitelisted domain to host the widget from (or include it with your on-prem installation). (HTTPS is required.)

Just upload the contents of the `dist` folder to your server, and when adding a widget, point to the uploaded `manifest.json` file.

## General Development Advice

- To get acquainted with Alleo widgets and capabilities, please see the [widget documentation](https://meet.withalleo.com/widget-docs/) as a reference.
- Have a look at the [Alleo Widget Utility Library](https://www.npmjs.com/package/@withalleo/alleo-widget)
    - Documentation on [GitHub](https://github.com/withalleo/alleo-widget-docs/blob/main/globals.md#classes)
- It might be required to bump the version number in the manifest file before publishing a new version of the widget. (Be mindful of caching issues!)
- When developing/testing in the browser: in the dev panel, go to network and turn off caching. Otherwise the browser will cache your widget, even if you hard-reload.

## Overcomplicating your widget

### Recommended documentation

The `public/documentation` folder contains the documentation of the widget.

- `README.md` - Widget reference: general information (icon, version, widget id, author, default size) and the full list of settings.
- `help.md` - User help for end users: what the widget does, how to use it, its settings and limitations. It is shown when the user clicks the help button, which can be added to the widget with `HelpButtonHelper`.
- `OrganizationConfiguration.md` - Configuration guide for organization admins: the organization-level settings of the widget (e.g. `DefaultHelloWorldLabel`, `DefaultTextAlign`), their defaults and valid values, and example organization overrides.

It is recommended to keep these files up to date whenever the widget's behavior, UI, or configuration settings change.

### Agentic interface

The `public/assets/interface.json` file is a machine-readable description of the widget for programmatic interactions.

(Depending on your organizations settings and policies) Alleo uses this file to understand how your widget works and expose an interface for AI agents to interact with your widget based on the guidelines you define here.
<details>
<summary>Interface format</summary>

> Additional content (e.g. from your manifest or help file) might also be given to agents, but the interface file is the main source of truth for programmatic interactions.

Top-level keys:

- `id`, `name` - The `widgetId` and `name` from `manifest.json`.
- `description` - What the widget does.
- `hasBoardObject`, `service`, `onePerBoard`, `resizeable` - Basic widget traits.
- `agentNotes` - Extra instructions for agents.
- `writeTogether` - (Optional) Groups of shared variables that must be written together.
- `settings` - One entry per shared variable.

Each setting has a `type` (`string`, `number`, `boolean`, `object`, `array`, or a semantic type: `color`, `url`, `fileId`, `objectId`) and a `description`. Optional keys narrow the accepted values, e.g. `enum`, `examples`, `pattern`, `integer`, `minimum`, `maximum`, `maxLength`, `maxItems`, `items`, `properties`, `nullAccepted`, `transparentAllowed` (for colors), `acceptedFileTypes` / `acceptedObjectTypes`, and `usedWhen` (the setting only has an effect when other settings have given values).

Access flags:

- `readonly` - Agents can not change the value. `canReset` might allow them to reset it to its default.
- `hidden` - Not shown to agents (Internal or legacy value).
- `runtime` - The value changes often while users interact with the widget.
- `viewerWritable` - Users without edit privileges may also change the value (from `dataModificationPermissions.Viewer` in the manifest).

Settings without `readonly` or `hidden` are editable. The Hello World widget exposes `text`, `color`, `font-selector-font`, and `_textAlign`, all editable.

Keep `interface.json` in sync with the widget's shared variables, settings dialog, and widget bar whenever they change.

> **Warning!** Not all AI based tools will respect this. E.g. Browser based AI agents might use the UI (to mimic a human user). Never rely on the interface file to enforce security or privacy!

</details>
