import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class View<T> extends Component<T> {
    constructor(protected readonly events: IEvents, container: HTMLElement) {
        super(container)
    }
}