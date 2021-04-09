let dataChanger;
let cache;

const el = document.getElementById('udesly-frontend-editor');
let focusedElement;

function findReact(dom) {
    const key = Object.keys(dom).find(key=>key.startsWith("__reactProps$"));
    return dom[key];
}

el.addEventListener('click', e => {

    if (e.target.matches('[data-tooltip="Heading"]')) {
        const r = findReact(e.target);
        if (r && typeof r.onClick == "function") {

            r.onClick(e);

        }
        return;
    }
    if (e.target.closest('[data-tooltip="Heading"]')){
        const r = findReact(e.target.closest('[data-tooltip="Heading"]'));
        if (r && typeof r.onClick == "function") {
            r.onClick(e);
        }
        return;
    }

    const p = e.target.closest('[class^=FieldWrapper]');
    if (focusedElement) {
        focusedElement.classList.remove('fe-focused');
        focusedElement.__scrolled = false;
    }
    if (p) {
        const label = p.querySelector('label');
        if (!label || !label.htmlFor) {
            return;
        }
        const els = cache.get(label.htmlFor);
        if (els[0]) {
            els[0].classList.add('fe-focused');
            focusedElement = els[0];
            if (!els[0].__scrolled) {
                els[0].scrollIntoView({ behavior: 'smooth'});
                els[0].__scrolled = true;
            }
        }
    }
})

export function onIframeLoad(iframe) {
    const doc = iframe.contentDocument;
    const style = doc.createElement('style');
    style.textContent = `.fe-focused { box-shadow: 0 0 0 2px #2296fe; border-radius: 5px; }  ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent;border-style:solid;border-width:0}::-webkit-scrollbar-thumb{border-radius:100px;background:#2296fe}`
    doc.head.append(style);

    const config = JSON.parse(doc.getElementById('udesly-fe-data').textContent);

    dataChanger = new DataChanger(iframe);
    cache = new WeakCache(iframe.contentDocument);

    const pageConfig = parseConfig(config.page);

    const globalConfig = parseConfig(config.global, "Symbols")

    document.dispatchEvent(new CustomEvent('udesly-fe.init', {
        detail: {
            pageConfig,
            globalConfig,
            iframe
        }
    }))

}

function parseConfig(config, label = 'Edit Page') {
    const formConfig = {
        id: "random-" + Math.random(),
        label,
        fields: [],
        initialValues: {
            img: {},
            link: {},
            text: {},
            textarea: {},
            richtext: {}
        },
        onSubmit: async (formData) => {
            // save the new form data
        },
    }

    const fieldGroups = {};

    for (let key in config.img) {

    }
    for (let key in config.link) {

    }
    for (let key in config.text) {
        if (!fieldGroups.text) {
            fieldGroups.text = {
                name: "text",
                component: "group",
                label: "Texts",
                fields: []
            }
        }
        fieldGroups.text.fields.push({
            name: key,
            component: config.text[key].length > 35 ? 'textarea':'text',
            parse: (value, name) => {
                dataChanger.changeInnerHTML(name, value);
                return value;
            },
        });
        formConfig.initialValues.text[key] = config.text[key];
    }
    for (let key in config.textarea) {
        if (!fieldGroups.textarea) {
            fieldGroups.textarea = {
                name: "textarea",
                component: "group",
                label: "Text Areas",
                fields: []
            }
        }
        fieldGroups.textarea.fields.push({
            name: key,
            component: 'html',
            parse: (value, name) => {
                dataChanger.changeInnerHTML(name, value);
                return value;
            },
        });
        formConfig.initialValues.textarea[key] = config.textarea[key];
    }
    for (let key in config.richtext) {
        if (!fieldGroups.richtext) {
            fieldGroups.richtext = {
                name: "richtext",
                component: "group",
                label: "Rich Texts",
                fields: []
            }
        }
        fieldGroups.richtext.fields.push({
            name: key,
            component: 'html',
            imageProps: {
                parse: (media) => media.previewSrc,
                directory: () => "",
              previewSrc: (media) => {
                  return media;
              }
            },
            parse: (value, name) => {
                dataChanger.changeInnerHTML(name, value);
                return value;
            },
        });
        formConfig.initialValues.richtext[key] = config.richtext[key];
    }

    formConfig.fields.push(...Object.values(fieldGroups))

    return formConfig;
}

class WeakCache {
    cache = {}

    constructor(iframe) {
        this.doc = iframe;
    }


    get(key) {
        const [type, name] = key.split('.');
        if (!this.cache[key]) {
            this.cache[key] = this.doc.querySelectorAll(`[data-${type}="${name}"]`);
        }
        return this.cache[key];
    }
}

class DataChanger {

    constructor(iframe) {
        this.document = iframe.contentDocument;
    }

    changeInnerHTML(name, value) {
        const el = cache.get(name);
        el.forEach(el => {
            el.innerHTML = value;
        })
    }

}