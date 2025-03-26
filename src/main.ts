import {
    AlleoWidget,
    AnalyticsHelper,
    ColorPalette,
    ColorPickerHelper,
    DefaultColors,
    DeploymentSettingsHelper,
    FontPickerHelper,
    ResizeHelper,
    SettingsDialogHelper,
    SharedVariable,
    Size,
} from '@withalleo/alleo-widget'

/**
 * This is a simple Hello World widget that demonstrates the basic functionality of the Alleo Widget SDK.
 * This widget displays a customizable text message, which can be adjusted through a settings dialog.
 * It supports changing the font, color, and size, and showcases some features of the SDK.
 */
class HelloWorldWidget extends AlleoWidget<typeof HelloWorldWidget.defaultSharedVariables> {
    // The DeploymentSettingsHelper allows you to access the settings defined in the manifest.json file.
    // This is useful when you want to use settings that are defined after build, but are specific to deployment.
    private static defaultText: string = DeploymentSettingsHelper.settings.DefaultHelloWorldLabel || 'Hello World!'

    // The minimum size of the widget
    // Note: the default size is set in the manifest.json file.
    private static minSize: Size = { width: 150, height: 40 }

    // the default shared variables for the widget
    // "shared variable" are a way to synchronize (and save)
    // data between multiple instances of the same widget
    // * Note: The structure of this also provides type safety for this.shared
    private static readonly defaultSharedVariables = {
        // the text content
        text: <string>HelloWorldWidget.defaultText, // the color of the text
        color: <string>DefaultColors.text,
    }

    constructor() {
        super(HelloWorldWidget.defaultSharedVariables)

        // Initialize the widget with the default text.
        this.updateText(this.shared.text)

        // Subscribe to text field changes and update the widget text accordingly.
        new SharedVariable.observer('text', () => this.updateText(this.shared.text))

        // Initialize settings dialog with a text input field.
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

        // Initialize font picker helper without specific configurations.
        // * Note: Settings like these will be automatically synchronized between instances of the widget.
        // ie. if you change the font, it will instantly change for everyone else.
        new FontPickerHelper()

        // Initialize color picker helper for text color customization.
        new ColorPickerHelper( // the handle is a shared variable, where the color will be stored.
            'color', // the CSS variable that will be updated with the selected color.
            '--widget-color', // the default color
            this.shared.color,
            {
                label: 'Text color', // Add a custom icon to the color picker. Usually this is a font-awesome 5 solid icon.
                icon: { icon: 'text', set: 'fas' }, // The color palette to use for the color picker, these are customized by the user
                palette: ColorPalette.Text, // Whether to include the transparent color in the color picker.
                includeTransparent: false,
            },
        )

        // The ResizeHelper allows the user the resize the widget.
        new ResizeHelper(HelloWorldWidget.minSize)
    }

    /**
     * Updates the widget's text content and adjusts its size if necessary.
     * @param text The new text to display in the widget.
     */
    public updateText(text: string): void {
        AnalyticsHelper.debug('Text updated', text)
        this.dom.textContent = text
    }
}

// Let's initialize the widget
new HelloWorldWidget()
