import type {RematchStore} from "@rematch/core";
import type {WooCommerceRootModel} from "../store/wc-models";
import type {RootModel} from "../store/models";

export default class Udesly<T = WooCommerceRootModel | RootModel> {
    private eventTarget: EventTarget;

    constructor(description: string = "", public store: RematchStore<T>) {
        this.eventTarget = document.appendChild(document.createComment(description));
    }

    on(type: string, listener: (data: any) => void) {
        this._listen(type, listener);
    }

    getState() {
        return this.store.getState();
    }

    dispatch(type: string, payload?: any) {
       return this.store.dispatch({type, payload});
    }

    private _listen(type: string, listener: (data: any) => void, options?: {}) {
        this.eventTarget.addEventListener<CustomEvent>(type, (evt: CustomEvent) => {
            listener(evt.detail)
        }, options);
    }

    once(type: string, listener: (data: any) => void) {
       this._listen(type, listener, {once: true});
    }

    off(type: string, listener: (data:any) => void) {
        this.eventTarget.removeEventListener(type, listener);
    }

    emit(type: string, payload: any) {
        setTimeout(() => {
            this.eventTarget.dispatchEvent(new CustomEvent(type, { detail: payload }));
        }, 1);
    }
}