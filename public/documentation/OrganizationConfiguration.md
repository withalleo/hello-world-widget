# Hello World - Organization configuration guide

The Hello World widget shows a single line of text on the board. Admins can set the default text and the default text alignment of new widgets, and the default colors through the shared color settings.

See the [widget reference](README.md) for the full settings list and the [user help](help.md) for how the widget works for board owners.

## Configuration settings

### `DefaultHelloWorldLabel`

**Default.** The text a new widget shows when it is added to the board. The default is `Hello Alleo!`. Any text is valid. Board owners can change the text in the settings dialog. When the setting is empty, the widget shows `Hello World!`.

### `DefaultTextAlign`

**Default.** The text alignment of a new widget. The default is `left`. Valid values are `left`, `center`, and `right`. Board owners can change the alignment from the widget bar.

## Example organization overrides

Start every new widget with a custom greeting:

```json
{
    "widgets": {
        "com.withalleo": {
            "hello-world": {
                "data": {
                    "DefaultHelloWorldLabel": "Welcome to our board!"
                }
            }
        }
    }
}
```

Center the text of new widgets by default:

```json
{
    "widgets": {
        "com.withalleo": {
            "hello-world": {
                "data": {
                    "DefaultTextAlign": "center"
                }
            }
        }
    }
}
```

Set the default text color for all Alleo widgets that use the default colors, including this one:

```json
{
    "scopes": {
        "com.withalleo": {
            "default-colors": {
                "data": {
                    "DefaultColors": {
                        "text": "#1a1a1a"
                    }
                }
            }
        }
    }
}
```
