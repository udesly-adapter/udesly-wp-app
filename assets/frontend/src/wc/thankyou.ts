import Eta from '../utils/eta';

Eta.config.autoEscape = false;

export default class Thankyou {
    private itemsList: Element;
    private templateFunction: any;

    constructor(private wrapper: HTMLElement) {

        this.itemsList = this.wrapper.querySelector('.w-commerce-commercecheckoutorderitemslist');

        if(!this.itemsList) {
            return;
        }

        const template = wrapper.querySelector('script[type="text/x-wf-template"]').textContent;

        this.templateFunction = Eta.compile(template);

        const items = JSON.parse(wrapper.querySelector('script[type="application/json"]').textContent).map(item => {
            const options = {};
            item.product = {
                name: item.title
            }
            item.rowTotal = item.total;
            item.options.split(",").forEach(line => {
              const[label, value] =  line.split(":").map(e => e.trim());
              options[label + ": "] = value;
            });
            item.options = options;
            return item;
        })

        this.itemsList.innerHTML = items.reduce((prev, next) => prev+=Eta.render(this.templateFunction, next), "");
    }
}