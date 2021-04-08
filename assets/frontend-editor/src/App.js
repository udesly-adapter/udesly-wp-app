import {TinaCMS, TinaProvider} from "tinacms";
import {useRef, useEffect, useState, useCallback} from "react";
import WordPressMediaStore from "./media/WordPressMediaStore";
import {HtmlFieldPlugin} from 'react-tinacms-editor';
import {onIframeLoad} from "./utils/on-iframe-load";

const PageContent = () => {
    const ref = useRef();

    /*const formConfig = {
        id: "random",
        label: 'Edit Post',
        fields: [],
        initialValues: {
        },

        onSubmit: async (formData) => {
            // save the new form data
        },
    }
    const [modifiedValues, form] = useForm(formConfig, { fields: formConfig.fields })

    usePlugin(form)
    usePlugin(HtmlFieldPlugin);*/

    /*useEffect(() => {
        const iframe = document.getElementById("frontend-editor-frame");
        iframe.contentWindow.postMessage({event: 'modified-values', data: modifiedValues}, "*");

    }, [modifiedValues])*/

    useEffect(() => {
        if(ref.current) {
            const iframe = document.getElementById("frontend-editor-frame");
            if (  iframe.contentWindow.readyState  === 'complete' ) {
                //iframe.contentWindow.alert("Hello");
                onIframeLoad(iframe);
            } else {
                iframe.onload = function(){
                    onIframeLoad(iframe);
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
          enabled: false,
          sidebar: {
           position: "displace",
          },
      }
  );

    const [screens, setScreens] = useState([]);

    useEffect(() => {
        document.addEventListener('udesly-fe.init', (e) => {
            setScreens(e.detail)
        });
    }, [])

    useEffect(() => {
        if (screens.length) {
            setTimeout(() => {
                cms.disable();
                cms.enable();
                document.querySelector('[aria-label="toggles cms sidebar"]').click();
                document.body.classList.add('loaded');
            })

        }
    }, [screens])

    return (
    <TinaProvider cms={cms}>
       <PageContent/>
        {screens}
    </TinaProvider>
  );
}

export default App;
