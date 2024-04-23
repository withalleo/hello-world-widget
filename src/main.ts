import {
    AlleoWidget,
    ColorPalette,
    ColorPickerHelper,
    DefaultColors,
    DeploymentSettingsHelper,
    SettingsDialogHelper,
    waitUntilDomUpdates,
} from '@withalleo/alleo-widget'

class HelloWorldWidget extends AlleoWidget<typeof HelloWorldWidget.DefaultSharedVariables> {
    public static readonly DefaultSharedVariables = {
        'text': <string>DeploymentSettingsHelper.settings.DefaultHelloWorldText || "Hello, World!",
        'color': <string>DefaultColors.text,
    }

    constructor() {
        super(HelloWorldWidget.DefaultSharedVariables)

        this.updateText()

        haptic.getFieldChanged$('text').subscribe(() => this.updateText())

        new SettingsDialogHelper({
            fields: [
                {
                    key: 'text',
                    type: 'input',
                    defaultValue: this.shared.text,
                    props: {
                        label: 'The text to display',
                    },
                }
            ],
        })

        new ColorPickerHelper(
            'color',
            '--widget-color',
            this.shared.color,
            {
                label: 'Text Color',
                icon: { icon: 'text', set: 'fas' },
                palette: ColorPalette.Text,
                includeTransparent: false,
        })
    }

    public updateText(): void {
        this.dom.innerHTML = this.shared.text
        waitUntilDomUpdates().then(() => haptic.setSize(this.dom.offsetWidth, 40))
    }
}

new HelloWorldWidget()
