import {
    AlleoWidget,
    AnalyticsHelper,
    ColorPalette,
    ColorPickerHelper,
    DefaultColors,
    FontPickerHelper,
    ResizeHelper,
    SettingsDialogHelper,
    SharedVariable,
    Size,
    TextAlignHelper,
    TextAlignment,
    WidgetSettings,
} from '@withalleo/alleo-widget'

/**
 * This is a simple Hello World widget that demonstrates the basic functionality of the Alleo Widget SDK.
 * This widget displays a customizable text message, which can be adjusted through a settings dialog.
 * It supports changing the font, color, and size, and showcases some features of the SDK.
 */
class HelloWorldWidget extends AlleoWidget<typeof HelloWorldWidget.defaultSharedVariables> {
    /**
     * The WidgetSettings interface allows you to access the settings defined in the manifest.json file, or in organization or deployment-based settings.
     *
     * This is useful when you want to use settings that are defined after build, but are specific to deployment or organization.
     */
    private static defaultText: string = WidgetSettings.settings.DefaultHelloWorldLabel || 'Hello World!'

    /**
     * Minimum resize constraints for the widget.
     *
     * The default initial size is defined in `manifest.json`.
     */
    private static minSize: Size = { width: 150, height: 40 }

    /**
     * the default shared variables for the widget
     * "Shared variables" are a way to synchronize (and save) data between multiple instances of the same widget
     * Note: The structure of this also provides type safety for this.shared
     */
    private static readonly defaultSharedVariables = {
        /* the text content of the label */
        text: <string>HelloWorldWidget.defaultText,
        /* the color of the text */
        color: <string>DefaultColors.text,
    }

    /**
     * Sets up observers and UI helpers for settings, font, color, and resizing.
     *
     * It is called when the widget is loaded.
     */
    constructor() {
        super(HelloWorldWidget.defaultSharedVariables)

        // Initialize the widget with the default text.
        this.updateText(this.shared.text)

        // Set up an observer to update the text whenever the shared variable `text` changes.
        new SharedVariable.observer(['text'], () => this.updateText(this.shared.text))

        /*
            Add a Settings dialog.

            Note: This helper will add the button for you as well.

            The dialog is based on the Angular Formly format.
         */
        const settingsDialogHelper = new SettingsDialogHelper(
            {
                fields: [
                    {
                        key: 'text',
                        type: 'input',
                        defaultValue: this.shared.text,
                        props: {
                            label: 'Text to display',
                            description: 'The text that will be displayed in the widget.',
                        },
                    },
                ],
            },
            {
                createSettingsButtonOnInit: true,
            },
        )

        // If we just created the widget, let's open the settings dialog.
        if (haptic.creation) settingsDialogHelper.openSettingsDialog()

        /*
             Initialize font picker helper without specific configurations.

             Note: Settings like these will be automatically synchronized between instances of the widget.
             ie. if you change the font, it will instantly change for everyone else.
         */
        new FontPickerHelper()

        // Initialize color picker helper for text color customization.
        new ColorPickerHelper(
            // the handle is a shared variable, where the color will be stored.
            'color',
            // the CSS variable that will be updated with the selected color.
            '--widget-color',
            // the default color
            this.shared.color,
            {
                label: 'Text color',
                // Add a custom icon to the color picker. Usually this is a font-awesome 5 solid icon.
                icon: { icon: 'text', set: 'fas' },
                // The color palette to use for the color picker, these are customized by the user
                palette: ColorPalette.Text,
                // Whether to include the transparent color in the color picker.
                includeTransparent: false,
            },
        )

        // Initialize text alignment helper for text alignment customization.
        new TextAlignHelper(this.dom, {
            defaultAlign: WidgetSettings.settings.DefaultTextAlign || TextAlignment.Left,
            supportedAlignments: [TextAlignment.Left, TextAlignment.Center, TextAlignment.Right],
        })

        // Allow users to resize the widget while enforcing minimum dimensions.
        new ResizeHelper(HelloWorldWidget.minSize)
    }

    /**
     * Runs when the widget is unloaded.
     *
     * Most SDK-managed resources are cleaned up automatically. Add manual cleanup
     * here for any custom timers or event listeners.
     *
     * (This code is optional... if you don't have anything to destroy, there is no need to override this.)
     */
    public override destroy(): void | Promise<void> {
        return super.destroy()
    }

    /**
     * Updates the widget's text content and adjusts its size if necessary.
     * @param text The new text to display in the widget.
     */
    public updateText(text: string): void {
        AnalyticsHelper.debug('updateText', { text })
        this.dom.textContent = text
    }
}

// That's all folks: Let's initialize the widget
new HelloWorldWidget()
