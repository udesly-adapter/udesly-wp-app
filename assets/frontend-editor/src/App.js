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
          sidebar: {
           position: "displace",
          },
      }
  );

    useEffect(() => {
        setTimeout(() => {
            document.querySelector('[aria-label="toggles cms sidebar"]').click();
            document.body.classList.add('loaded');
        }, 20)
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
