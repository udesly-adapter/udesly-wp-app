import {useForm, usePlugin, useFormScreenPlugin} from 'tinacms';


const GlobalForm = ({config}) =>  {

    const [modifiedValues, form] = useForm(config)

    useFormScreenPlugin(form, "", "fullscreen")

    return "";
}


export default GlobalForm;