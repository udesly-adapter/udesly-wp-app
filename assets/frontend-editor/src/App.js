import {TinaCMS, TinaProvider, useForm, useCMS, usePlugin} from "tinacms";
import {useRef, useEffect} from "react";
import WordPressMediaStore from "./media/WordPressMediaStore";
import {HtmlFieldPlugin} from 'react-tinacms-editor';



function cleanIframe(doc) {
    const style = doc.createElement('style');
    style.textContent = `::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent;border-style:solid;border-width:0}::-webkit-scrollbar-thumb{border-radius:100px;background:#2296fe}`
    doc.head.append(style);
    cleanTina();
}

function cleanTina() {
    //document.querySelector('button[class^=MoreActionsButton]').remove();
   // document.querySelector('label[for="Form Status"]').remove();
    document.body.classList.add('loaded');
}


const PageContent = () => {
    const ref = useRef();

    const formConfig = {
        id: "random",
        label: 'Edit Post',
        fields: [
            {
                name: 'images.bo1',
                label: 'Image',
                component: 'image',
            },
            {
                name: 'markdownContent',
                label: 'content',
                component: 'html',
            },
            {
                name: 'text',
                label: 'Text',
                component: 'text'
            }
        ],
        initialValues: {
            text: 'bobby <span>bobby2</span>',
            "images": {
                "bo1": {
                    id: "uknown",
                    type: 'file',
                    directory: '',
                    previewSrc: "http://localhost:10014/wp-content/themes/wordpress-next/assets/images/noiceland_logo.svg?v=1617697851",
                    filename: "noiceland_logo.svg"
                }
            },
            markdownContent: "content"
        },
        onSubmit: async (formData) => {
            // save the new form data
        },
    }
    const [modifiedValues, form] = useForm(formConfig)

    usePlugin(form)
    usePlugin(HtmlFieldPlugin);

    useEffect(() => {
        const iframe = document.getElementById("frontend-editor-frame");
        iframe.contentWindow.postMessage({event: 'modified-values', data: modifiedValues}, "*");

    }, [modifiedValues])

    useEffect(() => {
        if(ref.current) {
            const iframe = document.getElementById("frontend-editor-frame");
            if (  iframe.contentWindow.readyState  === 'complete' ) {
                //iframe.contentWindow.alert("Hello");
                cleanIframe(iframe.contentDocument);
            } else {
                iframe.onload = function(){
                    cleanIframe(iframe.contentDocument);
                };
            }
            ref.current.append(iframe)
        }
    }, [ref])

    return  <div className="iframe-wrapper" ref={ref} />

}

function App() {

  const cms = new TinaCMS(
      {
          media: new WordPressMediaStore(),
        enabled: true,
        sidebar: {
          position: "displace",
        },
      }
  );

  window.cms = cms;

    return (
    <TinaProvider cms={cms}>
       <PageContent/>
    </TinaProvider>
  );
}

export default App;
