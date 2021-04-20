import type Udesly from "../utils/udesly";
import type {RootModel} from "../store/models";

const CURRENT_CLASSNAME = "w--current";

export const addCurrentClassToLinks = () => {
    const currentPath = window.location.toString();

    document.querySelectorAll(`a[href="${currentPath.slice(0,-1)}"],a[href="${currentPath}"]`).forEach( a => {
        a.classList.add(CURRENT_CLASSNAME);
    })
}

export default function wp(udesly: Udesly<RootModel>) {
    addCurrentClassToLinks();
}