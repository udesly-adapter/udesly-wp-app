document.addEventListener('DOMContentLoaded', init);

function init() {
    document.addEventListener('click', e => {

        e.preventDefault();

        e.stopPropagation();

        console.log('blocked click on', e);

    })

    window.addEventListener("message", (event) => {
       if (event.origin !== window.location.origin) {
          return;
       }
       const data = event.data;
       switch (data.event) {
           case "modified-values":
               onModifiedValues(data.data);
               break;
       }
    }, false);
}

function onModifiedValues(modifiedValues) {
    console.log(modifiedValues);
}