import {HtmlFieldPlugin} from "react-tinacms-editor";
import {useForm, usePlugin} from 'tinacms';


const PageForm = ({config}) =>  {

    const [modifiedValues, form] = useForm(config, { fields: config.fields })

    usePlugin(form)
    usePlugin(HtmlFieldPlugin);

    return "";
}

export default PageForm;