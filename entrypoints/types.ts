export enum MessageType {
    clickExtIcon = "clickExtIcon",
    changeTheme = "changeTheme",
    changeLocale = "changeLocale",
    toggleSidePanel = "toggleSidePanel",
    closeSidePanel = "closeSidePanel",
    connect = "connect",
    disconnect = "disconnect",
    toggleTooltip = "toggleTooltip",
    toggleLocked = "toggleLocked",
    changeDirection = "changeDirection",
}

export enum MessageFrom {
    contentScript = "contentScript",
    background = "background",
    popUp = "popUp",
    sidePanel = "sidePanel",
}

class ExtMessage {
    content?: string;
    from?: MessageFrom;

    constructor(messageType: MessageType) {
        this.messageType = messageType;
    }

    messageType: MessageType;
}

export default ExtMessage;
