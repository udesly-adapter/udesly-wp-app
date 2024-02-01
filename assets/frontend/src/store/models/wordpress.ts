import { createModel } from '@rematch/core'
import { RootModel } from '../models'
import { triggerJQuery, triggerWebflowInteractions } from "../../utils/triggers";

async function getNonce() {
    const nonce = sessionStorage.getItem('___wp_nonce') || undefined
    const nonceSavedAt = Number(sessionStorage.getItem('___wp_nonce_saved')) || 0;
    const lifespan = udesly_frontend_options.wp.lifespan;
    if (!nonce || (Date.now() > (nonceSavedAt + lifespan))) {
        const data = new FormData();
        data.set('action', 'udesly_ajax_generate_nonce');
        const newNonce = await (await fetch(udesly_frontend_options.wp.ajax_url, { method: "POST", body: data })).text();
        sessionStorage.setItem('___wp_nonce', newNonce);
        sessionStorage.setItem('___wp_nonce_saved', Date.now().toString());
        return newNonce;
    }
    return nonce;
}

export const wordpress = createModel<RootModel>()({
    state: {
        time: Date.now(),
    },
    reducers: {
        formSentSuccessfully(state, payload) {
            return { ...state, time: Date.now() };
        },
        formError(state, payload) {
            if (payload.code && payload.code == 403) {
                sessionStorage.removeItem('___wp_nonce');
                sessionStorage.removeItem('___wp_nonce_saved');
            }
            return { ...state, time: Date.now() };
        },
        postsLoaded(state, payload) {
            triggerJQuery('post-load');
            triggerWebflowInteractions();
            return state;
        },
    },
    effects: (dispatch) => ({
        async sendForm(payload, state) {
            const { parent, data } = payload;
            data.set('security', await getNonce());
            if (Date.now() < (state.wordpress.time + 100)) {
                parent.onFormError && parent.onFormError("Anti Spam check failed!");
                return;
            }

            if (data.get('contact_me_by_fax_only')) {
                parent.onFormError && parent.onFormError("Anti Spam check failed!");
                return;
            }

            const dataToSend = Object.fromEntries(new URLSearchParams(data).entries())

            

            try {
                const res = await fetch(window.udesly_frontend_options.wp.ajax_url, {
                    method: "POST",
                    body: data,
                    redirect: "manual"
                });
                if (res.type == "opaqueredirect") {
                    sessionStorage.removeItem('___wp_nonce');
                    sessionStorage.removeItem('___wp_nonce_saved');
                    parent.onFormRedirect && parent.onFormRedirect();
                    return;
                }
                const jsonData = await res.json();
                if (jsonData.success) {
                    dispatch.wordpress.formSentSuccessfully(jsonData.data);
                    parent.onFormSuccess && parent.onFormSuccess();
                } else {
                    dispatch.wordpress.formError({ data: jsonData.data || "Failed to send form", code: res.status });
                    parent.onFormError && parent.onFormError(jsonData.data || "Failed to send form");
                    return;
                }
            } catch (e) {
                console.error(e);
                dispatch.wordpress.formError("Failed to send form");
                parent.onFormError && parent.onFormError("Failed to send form");
            }

        },
        async loadPosts(payload) {
            const data = new FormData();
            data.set('action', "udesly_ajax_query_pagination");
            data.set('query_name', payload.queryName);
            data.set('paged', payload.paged);
            data.set('security', await getNonce());
            const response = await fetch(window.udesly_frontend_options.wp.ajax_url, {
                method: "POST",
                body: data
            });
            const jsonData = await response.json();
            if (response.ok) {

                payload.list.outerHTML = jsonData.data;
                dispatch.wordpress.postsLoaded();
            }
        }
    }),
});