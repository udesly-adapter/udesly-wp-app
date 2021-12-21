import type Udesly from "../utils/udesly";
import type {RootModel} from "../store/models";

const CURRENT_CLASSNAME = "w--current";

export const addCurrentClassToLinks = () => {
    const currentPath = window.location.toString();

    document.querySelectorAll(`a[href="${currentPath.slice(0,-1)}"],a[href="${currentPath}"]`).forEach( a => {
        a.classList.add(CURRENT_CLASSNAME);
    })

    document.querySelectorAll<HTMLElement>('[data-tab]').forEach( el => {
        const tab = el.dataset.tab;
        if (tab) {
            el.addEventListener('click', e => {
                e.preventDefault();
                document.querySelectorAll<HTMLElement>(`[data-w-tab="${tab}"]`).forEach( t => t.click());
            })
        }
    });
}

export default function wp(udesly: Udesly<RootModel>) {
    addCurrentClassToLinks();
    handlePaginationElements(udesly);

    udesly.on('wordpress/postsLoaded', () => {
        handlePaginationElements(udesly);
    })

    document.querySelectorAll<HTMLFormElement>('form[data-ajax-action]').forEach( el => {

        const wrapper = el.parentElement;

        const done = wrapper.querySelector('.w-form-done');
        const error = wrapper.querySelector('.w-form-fail');

        const errorMessage = error.lastElementChild || error;

        const redirect = el.getAttribute('data-redirect');


        const submit = el.querySelector<HTMLInputElement>('input[type=submit]');
        if (submit) {
            submit.dataset['value'] = submit.value;
        }

        wrapper.onFormError = function(message) {
            errorMessage.innerHTML = (message || "Failed to send form").toString();
            error.style.display = "inherit";
            if (submit) {
                submit.value = submit.dataset['value'];
            }

        }

        wrapper.onFormRedirect = function() {
            if (redirect) {
                // @ts-ignore
                window.location = redirect;
            } else {
                window.location.href = "/"
            }
        }

        wrapper.onFormSuccess = function() {
            el.style.display = "none";
            done.style.display = "inherit";

            if (submit) {
                submit.value = submit.dataset['value'];
            }

            if (redirect) {
                // @ts-ignore
                window.location = redirect;
            }
        }

        el.addEventListener('submit', e => {

            done.style.display = "none";
            error.style.display = "none";

            if(submit) {
                submit.value = submit.dataset['wait'];
            }

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const data = new FormData(el);
            data.set('action', "udesly_ajax_" + el.dataset.ajaxAction);
            data.set('_referrer', window.location.toString());
            udesly.dispatch('wordpress/sendForm', {parent: el.parentElement, data});
        })
    });
}


function handlePaginationElements(udesly: Udesly<RootModel>) {
    document.querySelectorAll<HTMLElement>('.w-pagination-wrapper').forEach( el => {
        if (el.dataset['paginationInit']) {
            return;
        }

        el.dataset['paginationInit'] = "true";

        const queryName = el.dataset.query;
        const paged = Number(el.dataset.paged);
        const list = el.closest('.w-dyn-list');
        el.querySelectorAll('.w-pagination-previous').forEach( button => {

            button.addEventListener('click', () => {
                udesly.dispatch('wordpress/loadPosts', {
                    queryName,
                    paged: paged - 1,
                    list
                })
            }, true)

        })
        el.querySelectorAll('.w-pagination-next').forEach( button => {

            button.addEventListener('click', () => {

                udesly.dispatch('wordpress/loadPosts', {
                    queryName,
                    paged: paged + 1,
                    list
                })
            }, true)

        })
    })
}