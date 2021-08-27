import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './app.css';
import {onIframeLoad} from "./utils/on-iframe-load";

const iframe = document.getElementById("frontend-editor-frame");
const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
if (  iframeDoc.readyState  === 'complete' ) {
    //iframe.contentWindow.alert("Hello");
    onIframeLoad(iframe);
} else {
    let loadedInterval = setInterval(() => {
        console.log(iframeDoc.readyState);
        if (iframeDoc.readyState  === 'complete') {
            onIframeLoad(iframe);
            clearInterval(loadedInterval)
        }
    }, 150)
}

document.addEventListener('udesly-fe.init', e => {
    const {globalConfig, pageConfig, iframe} = e.detail;
    ReactDOM.render(
        <React.StrictMode>
            <App globalConfig={globalConfig} pageConfig={pageConfig} iframe={iframe}/>
        </React.StrictMode>,
        document.getElementById('udesly-frontend-editor')
    );
}, {once: true})

/**/
