import * as React from 'react'
import { Children, ReactNode } from 'react'

export interface RSAlertProps {
    visible: boolean
    children: ReactNode
    level?: string
    width?: number
    iconName?: string
    iconSize?: string
    iconColor?: string,
    background?: string,
    className?: string,
    style?: any
    requestClose?: () => void,
}

declare class RSAlert extends React.Component<RSAlertProps, any> { }

export interface RSButtonProps {
    size?: string
    level?: string
    background?: string
    color?: string
    fullWidth?: boolean
    value?: string
    iconName?: string
    iconSize?: number
    iconColor?: string
    disabled?: boolean
    className?: string
    style?: any
    valueStyle?: any
}

declare class RSButton extends React.Component<React.HTMLProps<HTMLButtonElement> & RSButtonProps, any> { }

export interface RSCheckBoxProps {
    checked?: boolean
    value?: string | number
    label?: string
    background?: string
    color?: string
    disabled?: boolean
    className?: string
    style?: any
    onChange?: (value: string | number, checked: boolean, label: string) => void
}

declare class RSCheckbox extends React.Component<React.HTMLProps<HTMLInputElement> & RSCheckBoxProps, any> { }

export interface RSColorCardProps {
    label?: string
    color?: string
}

declare class RSColorCard extends React.Component<RSColorCardProps, any> { }

export interface RSFormLabelProps {
    id?: string
    className?: string
}

declare class RSFormLabel extends React.Component<React.HTMLProps<HTMLLabelElement> & RSFormLabelProps, any> { }

export interface RSIconProps {
    name: string
    size?: number
    color?: string
}

declare class RSIcon extends React.Component<RSIconProps, any> { }

export interface RSInputProps {
    id?: string
    label?: string
    level?: string
    text?: string
    textWithIcon?: string
    type?: string
    iconName?: string
    iconSize?: number
    iconOnRight?: boolean
    disabled?: boolean
    className?: string
    style?: any
    onChange?: (value: string) => void
}

declare class RSInput extends React.Component<React.HTMLProps<HTMLInputElement> & RSInputProps, any> { }

export interface RSLabelProps {
    text: string
    background?: string
    color?: string
    className?: string
    style?: any
}

declare class RSLabel extends React.Component<RSLabelProps, any> { }

export interface RSNotificationProps {
    value?: number
    background?: string
    color?: string
    rounded?: number
    className?: string
    style?: any
    children: ReactNode
}

declare class RSNotification extends React.Component<RSNotificationProps, any> { }

export interface RSProgressBarProps {
    fill?: number
    label?: string
    color?: string
    style?: any
}

declare class RSProgressBar extends React.Component<RSProgressBarProps, any> { }

export interface RSRadioProps {
    label?: string
    checked?: boolean
    background?: string
    color?: string
    disabled?: boolean
    className?: string
    value: string
}

declare class RSRadio extends React.Component<React.HTMLProps<HTMLInputElement> & RSRadioProps, any> { }

export interface RSRadioGroupProps {
    children: ReactNode
    selectedValue?: string
    onChange?: (value: string) => void
}

declare class RSRadioGroup extends React.Component<RSRadioGroupProps, any> { }

export interface RSSelectProps {
    className?: string
    // FOLLOWING PROPS ARE FROM REACT-SELECT MODULE
    'aria-describedby'?: string
    'aria-label'?: string
    'aria-labelledby'?: string
    arrowRenderer?: Function
    autoBlur?: boolean
    autoFocus?: boolean
    autofocus?: boolean
    autosize?: boolean
    backspaceRemoves?: boolean
    backspaceToRemoveMessage?: string
    clearAllText?: string | Node
    clearRenderer?: Function
    clearValueText?: string | Node
    clearable?: boolean
    closeOnSelect?: boolean
    deleteRemoves?: boolean
    delimiter?: string
    disabled?: boolean
    escapeClearsValue?: boolean
    filterOption?: Function
    filterOptions?: any
    id?: string
    ignoreAccents?: boolean
    ignoreCase?: boolean
    inputProps?: object
    inputRenderer?: Function
    instanceId?: string
    isLoading?: boolean
    joinValues?: boolean
    labelKey?: string
    matchPos?: string
    matchProp?: string
    menuBuffer?: number
    menuContainerStyle?: object
    menuRenderer?: Function
    menuStyle?: object
    multi?: boolean
    name?: string
    noResultsText?: string | Node
    onBlur?: Function
    onBlurResetsInput?: boolean
    onChange?: Function
    onClose?: Function
    onCloseResetsInput?: boolean
    onFocus?: Function
    onInputChange?: Function
    onInputKeyDown?: Function
    onMenuScrollToBottom?: Function
    onOpen?: Function
    onSelectResetsInput?: boolean
    onValueClick?: Function
    openOnClick?: boolean
    openOnFocus?: boolean
    optionClassName?: string
    optionComponent?: Function
    optionRenderer?: Function
    options?: Array<any>
    pageSize?: number
    placeholder?: string | Node
    removeSelected?: boolean
    required?: boolean
    resetValue?: any
    rtl?: boolean
    scrollMenuIntoView?: boolean
    searchable?: boolean
    simpleValue?: boolean
    style?: object
    tabIndex?: string | number
    tabSelectsValue?: boolean
    trimFilter?: boolean
    value?: any
    valueComponent?: Function
    valueKey?: string
    valueRenderer?: Function
    wrapperStyle?: object
}

declare class RSSelect extends React.Component<RSSelectProps, any> { }

export interface RSSelectOptionProps {
    label: string
    image?: string
    rounded?: number
    className?: string
    style?: any
}

declare class RSSelectOption extends React.Component<RSSelectOptionProps, any> { }

export interface RSSocialButtonProps {
    theme?: string
    iconName?: string
    iconSize?: number
    color?: string
    background?: string
    rounded?: number
    disabled?: boolean
    className?: string
    style?: any
}

declare class RSSocialButton extends React.Component<React.HTMLProps<HTMLLinkElement> & RSSocialButtonProps, any> { }

export interface RSSwitchProps {
    checked?: boolean
    value?: string | number
    label?: string
    background?: string
    rounded?: number
    disabled?: boolean
    className?: string
    style?: any
    onChange?: (label: string, checked: boolean) => void
}

declare class RSSwitch extends React.Component<RSSwitchProps, any> { }

export interface RSTabProps {
    label?: string,
    active?: boolean,
    background?: string,
    activeColor?: string,
    className?: string,
    style?: any
}

declare class RSTab extends React.Component<React.HTMLProps<HTMLLinkElement> & RSTabProps, any> { }

export interface RSTabGroupProps {
    selectedTab?: number
    background?: string
    activeColor?: string
    className?: string
    style?: any
    onChange?: (value: string) => void
    children: ReactNode
}

declare class RSTabGroup extends React.Component<RSTabGroupProps, any> { }

export interface RSTextareaProps {
    id?: string
    label?: string
    level?: string
    text?: string
    textWithIcon?: string
    disabled?: boolean
    className?: string
    style?: any
    onChange?: (value: string) => void
}

declare class RSTextarea extends React.Component<React.HTMLProps<HTMLTextAreaElement> & RSTextareaProps, any> { }
