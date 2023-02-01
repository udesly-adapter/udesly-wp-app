

export function triggerJQuery(event, data = null) {
    setTimeout(
        () => {
            jQuery(document.body).trigger(event, data)
        }, 1
    )
}

export function onJQueryEvent(event, callback, target: any = document.body) {
    jQuery(target).on(event, callback);
}

export function triggerWebflowInteractions() {
    const Webflow = window.Webflow;
    if (Webflow && Webflow.require('ix2')) {
        Webflow.require('ix2').destroy();
        Webflow.require('ix2').init();
        document.dispatchEvent(new Event('readystatechange'));
        window.dispatchEvent(new Event('scroll'));
    }
}