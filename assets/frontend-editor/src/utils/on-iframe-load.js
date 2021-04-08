import PageForm from "../components/PageForm";

let dataChanger;
let cache;

const el = document.getElementById('udesly-frontend-editor');
let focusedElement;

el.addEventListener('click', e => {
    const p = e.target.closest('[class^=FieldWrapper]');
    let focused = 0;
    if (p) {
        const label = p.querySelector('label');
        if (!label || !label.htmlFor) {
            return;
        }
        const els = cache.get(label.htmlFor);
        if (els[0]) {
            els[0].classList.add('fe-focused');
            focusedElement = els[0];
            focused = 1;
            if (!els[0].__scrolled) {
                els[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                els[0].__scrolled = true;
            }
        }
    }

    if (focusedElement && !focused) {
        focusedElement.classList.remove('fe-focused');
        focusedElement.__scrolled = false;
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

    //const toggleButton = document.querySelector('[aria-label="toggles cms sidebar"]');
    //toggleButton.click();

    const pageConfig = parseConfig(config.page);

    document.dispatchEvent(new CustomEvent('udesly-fe.init', {
        detail: [
            <PageForm config={pageConfig} key={"page"}/>
        ]
    }))

}

function parseConfig(config) {
    const formConfig = {
        id: "random-" + Math.random(),
        label: 'Edit Post',
        fields: [],
        initialValues: {
            img: {},
            link: {},
            text: {},
            richtext: {}
        },
        onSubmit: async (formData) => {
            // save the new form data
        },
    }

    for (let key in config.img) {

    }
    for (let key in config.link) {

    }
    for (let key in config.text) {

    }
    for (let key in config.richtext) {
        formConfig.fields.push({
            name: `richtext.${key}`,
            component: 'html',
            imageProps: {
                parse: (media) => {
                    alert(media)
                    return "https://upload.wikimedia.org/wikipedia/commons/c/ce/Example_image.png"
                },
                uploadDir: () => ''
            },
            parse: (value, name) => {
                console.log(value);
                dataChanger.changeRichText(name, value);
                return value;
            },
            format: (value, name) => {
                console.log(value);
                return value;
            }
        });
        formConfig.fields.push({
            name: `richtext.${key}-2`,
            component: 'html'
        });
        formConfig.initialValues.richtext[key] = "<img src='https://upload.wikimedia.org/wikipedia/commons/c/ce/Example_image.png' />" + config.richtext[key] ;
    }


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

    changeRichText(name, value) {
        const el = cache.get(name);
        el.forEach(el => {
            el.innerHTML = value;
        })
    }

}