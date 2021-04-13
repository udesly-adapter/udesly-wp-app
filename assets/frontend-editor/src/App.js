import {TinaCMS, TinaProvider} from "tinacms";
import {useRef, useEffect} from "react";
import WordPressMediaStore from "./media/WordPressMediaStore";
import PageForm from "./components/PageForm";
import GlobalForm from "./components/GlobalForm";

const PageContent = ({iframe}) => {
    const ref = useRef();

    useEffect(() => {
        if(ref.current) {
            ref.current.append(iframe)
        }
    }, [ref])

    return  <div className="iframe-wrapper" ref={ref} />

}

function App({pageConfig, globalConfig, iframe}) {

  const cms = new TinaCMS(
      {
          media: new WordPressMediaStore(),
          enabled: true,
          toolbar: true,
          sidebar: {
           position: "displace",
          },
      }
  );

    cms.events.subscribe('cms:disable', event => {
        window.location = window.location.toString().replace(window.location.search,'')
    })

    useEffect(() => {
        setTimeout(() => {
            document.querySelector('[aria-label="toggles cms sidebar"]').click();
            document.body.classList.add('loaded');
            const exitButton = document.querySelector('button[class*=ExitButton]');

           if(exitButton) {
               const textNode = Array.from(exitButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
               if (textNode) {
                   textNode.textContent = "Close Frontend Editor"
               }
           }

        }, 20)

        document.addEventListener('udesly-fe.notice', e => {
            const notice = e.detail;
            if (notice && notice.message) {
                switch (notice.type) {
                    case 'error':
                        cms.alerts.error(notice.message);
                        break;
                    case 'success':
                        cms.alerts.success(notice.message);
                        break;
                    default: {
                        cms.alerts.info(notice.message)
                    }
                }
            }
        })
    }, [])


    return (
    <TinaProvider cms={cms}>
       <PageContent iframe={iframe}/>
        <PageForm config={pageConfig} />
        <GlobalForm config={globalConfig} />
    </TinaProvider>
  );
}

export default App;
