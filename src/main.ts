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
    TextAlignHelper,
    TextAlignment,
    WidgetSettings,
} from 'alleoWidgetUtils' // OR you can use '@withalleo/alleo-widget'

/**
 * This is a simple Hello World widget that demonstrates the basic functionality of the Alleo Widget SDK.
 * This widget displays a customizable text message, which can be adjusted through a settings dialog.
 * It supports changing the font, color, and size, and showcases some features of the SDK.
 */
class HelloWorldWidget extends AlleoWidget<typeof HelloWorldWidget.defaultSharedVariables> {
    /**
     * the default shared variables for the widget
     * "Shared variables" are a way to synchronize (and save) data between multiple instances of the same widget
     * Note: The structure of this also provides type safety for `this.shared`
     */
    private static readonly defaultSharedVariables = {
        /**
         * the text content of the label
         *
         * The WidgetSettings interface allows you to access the settings defined in the manifest.json file, or in organization or deployment-based settings.
         */
        text: <string>WidgetSettings.settings.DefaultHelloWorldLabel || 'Hello World!',
        /** the color of the text. DefaultColors gets its values from the organization settings. */
        color: <string>DefaultColors.text,
    }

    private settingsDialogHelper: SettingsDialogHelper

    /**
     * Let's initialize our widget by setting up observers and UI helpers for settings, font, color, and resizing.
     *
     * It is called when the widget is loaded.
     */
    constructor() {
        super(HelloWorldWidget.defaultSharedVariables)

        /*
         * Initialize the widget with the default text.
         *
         * `this.shared.text` is a shared variable that is synchronized among multiple instances of the widget.
         *
         * If one user changes the text (`this.shared.text = "whatever"`) it will update for all other users as well.
         *
         * So this.shared.text will always contain the latest value of the text, even if it was changed by another user.
         */
        this.updateText(this.shared.text)

        /*
         * Let's set up an observer to update the text whenever the shared variable `text` changes.
         *
         * This will trigger if you or someone else updates the shared variable.
         */
        new SharedVariable.observer(['text'], () => this.updateText(this.shared.text))

        /*
         * Add a Settings dialog.
         *
         * Note: This helper will add the button for you as well.
         *
         * The dialog is based on the Angular Formly format.
         */
        this.settingsDialogHelper = new SettingsDialogHelper(
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

        /*
         * Initialize font picker helper without specific configurations.
         *
         * Note: Settings like these will be automatically synchronized between instances of the widget.
         * i.e. if you change the font, it will instantly change for everyone else as well.
         */
        new FontPickerHelper()

        // Initialize color picker helper for text color customization.
        new ColorPickerHelper(
            // the handle is a shared variable, where the color will be stored.
            'color',
            // the CSS variable that will be updated with the selected color.
            '--widget-color',
            // the default color when rendering
            this.shared.color,
            {
                label: 'Text color',
                // Add a custom icon to the color picker. Usually this is a font-awesome 5 solid icon.
                icon: { icon: 'text', set: 'fas' },
                // The color palette to use for the color picker. (The actual color palette can be customized by the organization.)
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
        new ResizeHelper({ width: 150, height: 40 })
    }

    public override justCreated() {
        /*
         * We do nothing here, but this is called when the widget is first created (on the client which created it).
         *
         * This should not contain some UI elements, like settings dialogs, as they should be opened in `justCreatedOptionalUI` instead.
         */
    }

    public override justCreatedOptionalUI() {
        /*
         * If we just created the widget, let's open the settings dialog.
         *
         * Note: the reason for separating UI content is that if a widget is added programmatically (e.g. by an AI agent), it may not be appropriate to open this.
         */
        void this.settingsDialogHelper.openSettingsDialog()
    }

    public override destroy(): void | Promise<void> {
        /*
         * Runs when the widget is unloaded.
         *
         * Most SDK-managed resources are cleaned up automatically. Add manual cleanup
         * here for any custom timers or event listeners.
         *
         * (This code is optional... if you don't have anything to destroy, there is no need to override this.)
         */
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
