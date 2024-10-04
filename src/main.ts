import {
    AlleoWidget,
    BoardFabricObjectType,
    ColorPalette,
    ColorPickerHelper,
    DefaultColors,
    DeploymentSettingsHelper,
    FileSystemNodeClassifier,
    FontPickerHelper,
    FormlySelectOption,
    IBoardObject,
    ResizeHelper,
    SettingsDialogHelper,
    Size,
    waitUntilDomUpdates,
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
    private static minSize: Size = { width: 150, height: 40 }
    // the default shared variables for the widget
    // "shared variable" are a way to synchronize (and save)
    // data between multiple instances of the same widget
    // * Note: The structure of this also provides type safety for this.shared
    private static readonly defaultSharedVariables = {
        text: <string>HelloWorldWidget.defaultText,
        color: <string>DefaultColors.text,
        minWidth: <number>HelloWorldWidget.minSize.width,
    }

    constructor() {
        super(HelloWorldWidget.defaultSharedVariables)

        // Initialize the widget with the default text.
        this.updateText(this.shared.text)

        // Subscribe to text field changes and update the widget text accordingly.
        haptic.getFieldChanged$('text').subscribe((text: string) => this.updateText(text))
        haptic.getFieldChanged$('minWidth').subscribe(() => this.updateMinSize())

        const getExpression = (valueSet: boolean): FormlySelectOption[] => {
            return valueSet ? [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }] : []
        }

        const getExpressionAsync = async (valueSet: boolean): Promise<boolean> => {
            await haptic.utils.sleep(100)
            return valueSet
        }

        // Initialize settings dialog with a text input field.
        const settingsDialogHelper = new SettingsDialogHelper({
            fields: [{
                type: 'tabs', fieldGroup: [{
                    props: { label: 'Settings' }, fieldGroup: [{
                        template: '<h3>Content</h3>',
                    }, {
                        key: 'text', type: 'input', defaultValue: this.shared.text, props: {
                            label: 'Text to display', description: 'The text that will be displayed in the widget.',
                        },
                    }],
                }, {
                    props: { label: 'Form Element Demo' }, fieldGroup: [{
                        template: '<h3>Form element Demo</h3>' + '<p>These are just random form elements to showcase the different types of form elements available.</p>',
                    }, {
                        key: 'whatever', type: 'input', props: {
                            label: 'the next field will change if this input is empty or not',
                        }, // Method 2: this is a more advanced way to handle changes in the form field. However this supports async options better.
                        hooks: {
                            onChanges: async (field) => {
                                const form = field.formControl.parent
                                form.get('whatever').valueChanges.subscribe(async (value) => {
                                    const options = await getExpressionAsync(value)
                                    const whatever2Field = form.get('whatever2')
                                    if (!options) {
                                        whatever2Field.disable()
                                    } else {
                                        whatever2Field.enable()
                                    }
                                    whatever2Field.updateValueAndValidity()
                                })
                            },
                        },
                    }, {
                        key: 'whatever2', type: 'select', props: {
                            label: 'See... the content and values of these are changing.', options: [],
                        }, expressions: {
                            // Method 1: we can overwrite basically any property of the form field with expressions.

                            // let's change the options in the dropdown based on the value of the 'whatever' field
                            'props.options': (field) => getExpression(field.model.whatever),

                            // let's change the label of the field based on the value of the 'whatever' field
                            'props.label': (field) => {
                                if (!field.model.whatever) {
                                    return 'Whatever 2 (disabled)'
                                } else if (field.model.whatever === 'whatever') {
                                    return 'Whatever 2 (Hello)'
                                } else {
                                    return 'Whatever 2'
                                }
                            }, // alternatively you can hide the field based on the value of another field
                            // hide: (field) => !field.model.whatever
                        }, // this is recommended in combination with hide:
                        // resetOnHide: false,
                    }, {
                        type: 'checkbox', key: 'checkbox', defaultValue: true, props: {
                            label: 'Checkbox',
                        },
                    }, {
                        type: 'select', key: 'select', defaultValue: '1', props: {
                            label: 'Select', options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }],
                        },
                    }, {
                        type: 'input', key: 'input', defaultValue: 'Hello World', props: {
                            label: 'Input',
                        },
                    }, {
                        type: 'multicheckbox', defaultValue: ['1'], key: 'multiCheckbox', props: {
                            label: 'Multi Checkbox', options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }],
                        },
                    }, {
                        type: 'radio', key: 'radio', defaultValue: '1', props: {
                            label: 'Radio', options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }],
                        },
                    }, {
                        type: 'toggle', key: 'toggle', defaultValue: true, props: {
                            label: 'Toggle',
                        },
                    }, {
                        type: 'slider', key: 'slider', defaultValue: 50, props: {
                            label: 'Slider', min: 0, max: 100, step: 10, showTicks: true, thumbLabel: true,
                        },
                    }, {
                        type: 'chips', key: 'chips', defaultValue: ['Widget Dev'], props: {
                            label: 'Chips', items: ['Frontend', 'Backend', 'DevOps'],
                        },
                    }, {
                        type: 'input', key: 'color', defaultValue: this.shared.color, props: {
                            label: 'Color', type: 'color',
                        },
                    }, {
                        type: 'array', key: 'array', defaultValue: [{ name: 'Widget Dev', checkbox: true }], props: {
                            addText: 'Add', label: 'Array', minItems: 0, maxItems: 25,
                        }, fieldArray: {
                            fieldGroup: [{
                                key: 'name', type: 'input', props: {
                                    label: 'What?', maxLength: 30, minLength: 1, required: true,
                                },
                            }, {
                                key: 'checkbox', type: 'checkbox', defaultValue: true, props: {
                                    label: 'Yes?',
                                },
                            }],
                        },
                    },

                        {
                            template: '<h3>Advanced form elements</h3>',
                        } /*

                                    Object props:

                                    interface BoardObjectProps extends FormlyFieldProps {
                                       filterFn?: (obj: fabric.Object) =&gt; boolean;
                                       additionalOptions?: { value: any; label: string }[];
                                    }
                                 */, {
                            type: 'boardobject', key: 'obj', props: {
                                label: 'Board object', placeholder: 'test placeholder', labelFn: (obj: IBoardObject) => {
                                    return obj.type + ': ' + obj.humanTextId
                                }, filterFn: (obj: IBoardObject) => {
                                    return obj.type !== BoardFabricObjectType.Widget
                                }, additionalOptions: [{ value: '', label: 'No Object' }],
                            },
                        }, {
                            type: 'file', key: 'file', props: {
                                label: 'Image File', placeholder: 'test placeholder', showThumbnail: true, // Font awesome solid icon name
                                icon: 'wallpaper', fileTypes: [FileSystemNodeClassifier.Image],
                            },
                        }, {
                            type: 'file', key: 'file2', props: {
                                label: 'Non-image file', placeholder: 'test non-image placeholder',
                            },
                        },

                        {
                            type: 'array', key: 'array2', defaultValue: [], props: {
                                addText: 'Add', label: 'A list of slides', minItems: 0, maxItems: 25,
                            }, fieldArray: {
                                fieldGroup: [{
                                    type: 'file', props: {
                                        label: 'File', showThumbnail: false, // Font awesome solid icon name
                                        icon: 'image', fileTypes: [FileSystemNodeClassifier.SlideTemplate],
                                    },
                                }],
                            },
                        }],
                }],
            }],
        })

        // Initialize font picker helper without specific configurations.
        // * Note: Settings like these will be automatically synchronized between instances of the widget.
        // ie. if you change the font, it will instantly change for everyone else.
        new FontPickerHelper()

        // Initialize color picker helper for text color customization.
        new ColorPickerHelper(// the handle is a shared variable, where the color will be stored.
            'color', // the CSS variable that will be updated with the selected color.
            '--widget-color', // the default color
            this.shared.color, {
                label: 'Text color', // Add a custom icon to the color picker. Usually this is a font-awesome 5 solid icon.
                icon: { icon: 'text', set: 'fas' }, // The color palette to use for the color picker, these are customized by the user
                palette: ColorPalette.Text, // Whether to include the transparent color in the color picker.
                includeTransparent: false,
            })

        // Initialize resize helper which allows the user the resize the widget.
        new ResizeHelper({ height: HelloWorldWidget.minSize.height, width: this.shared.minWidth })
        // If we just created the widget, let's open the settings dialog.
        if (haptic.creation) settingsDialogHelper.openSettingsDialog()
    }

    /**
     * Updates the widget's text content and adjusts its size if necessary.
     * @param text The new text to display in the widget.
     */
    public updateText(text: string): void {
        this.debug('Text updated to:', text)
        this.dom.textContent = text
        // TODO: this might not be a good practice, since this is called at every initialization as well
        this.changeMinSize()
    }

    /**
     * This function is used to update the size of the widget based on the content size.
     */
    private async changeMinSize(): Promise<void> {
        // Check if the user has edit permissions before resizing the widget.
        if (!haptic.currentUser.canEdit) return

        // Wait for the DOM rendering to finish before checking the content size.
        await waitUntilDomUpdates()
        if (this.dom.scrollWidth > this.dom.clientWidth) {
            this.debug('resizing widget, since the content does not fit', this.dom.scrollWidth, this.dom.clientWidth)
            this.shared.minWidth = this.dom.scrollWidth + 10
        }
    }

    private updateMinSize(): void {
        ResizeHelper.setMinSize({ width: this.shared.minWidth, height: HelloWorldWidget.minSize.height })
    }

    /*
     * This function is used to log debug messages to the console. Note that these messages will only be visible in a dev deployment.
     * .info() is visible on prod as well, and it is also logged on the server.
     * .warn() and .error() are also available.
     * @param args The arguments to log to the console.
     */
    private debug(...args: any[]): void {
        haptic.logService.debug('Hello World', ...args)
    }
}

// Let's initialize the widget
new HelloWorldWidget()
