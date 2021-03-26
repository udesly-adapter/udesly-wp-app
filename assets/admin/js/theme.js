var Notyf=function(){"use strict";var n,t,o=function(){return(o=Object.assign||function(t){for(var i,e=1,n=arguments.length;e<n;e++)for(var o in i=arguments[e])Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o]);return t}).apply(this,arguments)},s=(i.prototype.on=function(t,i){var e=this.listeners[t]||[];this.listeners[t]=e.concat([i])},i.prototype.triggerEvent=function(t,i){var e=this;(this.listeners[t]||[]).forEach(function(t){return t({target:e,event:i})})},i);function i(t){this.options=t,this.listeners={}}(t=n=n||{})[t.Add=0]="Add",t[t.Remove=1]="Remove";var v,e,a=(r.prototype.push=function(t){this.notifications.push(t),this.updateFn(t,n.Add,this.notifications)},r.prototype.splice=function(t,i){var e=this.notifications.splice(t,i)[0];return this.updateFn(e,n.Remove,this.notifications),e},r.prototype.indexOf=function(t){return this.notifications.indexOf(t)},r.prototype.onUpdate=function(t){this.updateFn=t},r);function r(){this.notifications=[]}(e=v=v||{}).Dismiss="dismiss";var c={types:[{type:"success",className:"notyf__toast--success",backgroundColor:"#3dc763",icon:{className:"notyf__icon--success",tagName:"i"}},{type:"error",className:"notyf__toast--error",backgroundColor:"#ed3d3d",icon:{className:"notyf__icon--error",tagName:"i"}}],duration:2e3,ripple:!0,position:{x:"right",y:"bottom"},dismissible:!(e.Click="click")},p=(d.prototype.on=function(t,i){var e;this.events=o(o({},this.events),((e={})[t]=i,e))},d.prototype.update=function(t,i){i===n.Add?this.addNotification(t):i===n.Remove&&this.removeNotification(t)},d.prototype.removeNotification=function(t){var i,e,n=this,o=this._popRenderedNotification(t);o&&((e=o.node).classList.add("notyf__toast--disappear"),e.addEventListener(this.animationEndEventName,i=function(t){t.target===e&&(e.removeEventListener(n.animationEndEventName,i),n.container.removeChild(e))}))},d.prototype.addNotification=function(t){var i=this._renderNotification(t);this.notifications.push({notification:t,node:i}),this._announce(t.options.message||"Notification")},d.prototype._renderNotification=function(t){var i,e=this._buildNotificationCard(t),n=t.options.className;return n&&(i=e.classList).add.apply(i,n.split(" ")),this.container.appendChild(e),e},d.prototype._popRenderedNotification=function(t){for(var i=-1,e=0;e<this.notifications.length&&i<0;e++)this.notifications[e].notification===t&&(i=e);if(-1!==i)return this.notifications.splice(i,1)[0]},d.prototype.getXPosition=function(t){var i;return(null===(i=null==t?void 0:t.position)||void 0===i?void 0:i.x)||"right"},d.prototype.getYPosition=function(t){var i;return(null===(i=null==t?void 0:t.position)||void 0===i?void 0:i.y)||"bottom"},d.prototype.adjustContainerAlignment=function(t){var i=this.X_POSITION_FLEX_MAP[this.getXPosition(t)],e=this.Y_POSITION_FLEX_MAP[this.getYPosition(t)],n=this.container.style;n.setProperty("justify-content",e),n.setProperty("align-items",i)},d.prototype._buildNotificationCard=function(n){var t,o=this,i=n.options,e=i.icon;this.adjustContainerAlignment(i);var s=this._createHTLMElement({tagName:"div",className:"notyf__toast"}),a=this._createHTLMElement({tagName:"div",className:"notyf__ripple"}),r=this._createHTLMElement({tagName:"div",className:"notyf__wrapper"}),c=this._createHTLMElement({tagName:"div",className:"notyf__message"});c.innerHTML=i.message||"";var p,d,l,u,f,h=i.background||i.backgroundColor;e&&"object"==typeof e&&(p=this._createHTLMElement({tagName:"div",className:"notyf__icon"}),d=this._createHTLMElement({tagName:e.tagName||"i",className:e.className,text:e.text}),(l=null!==(t=e.color)&&void 0!==t?t:h)&&(d.style.color=l),p.appendChild(d),r.appendChild(p)),r.appendChild(c),s.appendChild(r),h&&(i.ripple?(a.style.background=h,s.appendChild(a)):s.style.background=h),i.dismissible&&(u=this._createHTLMElement({tagName:"div",className:"notyf__dismiss"}),f=this._createHTLMElement({tagName:"button",className:"notyf__dismiss-btn"}),u.appendChild(f),r.appendChild(u),s.classList.add("notyf__toast--dismissible"),f.addEventListener("click",function(t){var i,e;null!==(e=(i=o.events)[v.Dismiss])&&void 0!==e&&e.call(i,{target:n,event:t}),t.stopPropagation()})),s.addEventListener("click",function(t){var i,e;return null===(e=(i=o.events)[v.Click])||void 0===e?void 0:e.call(i,{target:n,event:t})});var m="top"===this.getYPosition(i)?"upper":"lower";return s.classList.add("notyf__toast--"+m),s},d.prototype._createHTLMElement=function(t){var i=t.tagName,e=t.className,n=t.text,o=document.createElement(i);return e&&(o.className=e),o.textContent=n||null,o},d.prototype._createA11yContainer=function(){var t=this._createHTLMElement({tagName:"div",className:"notyf-announcer"});t.setAttribute("aria-atomic","true"),t.setAttribute("aria-live","polite"),t.style.border="0",t.style.clip="rect(0 0 0 0)",t.style.height="1px",t.style.margin="-1px",t.style.overflow="hidden",t.style.padding="0",t.style.position="absolute",t.style.width="1px",t.style.outline="0",document.body.appendChild(t),this.a11yContainer=t},d.prototype._announce=function(t){var i=this;this.a11yContainer.textContent="",setTimeout(function(){i.a11yContainer.textContent=t},100)},d.prototype._getAnimationEndEventName=function(){var t,i=document.createElement("_fake"),e={MozTransition:"animationend",OTransition:"oAnimationEnd",WebkitTransition:"webkitAnimationEnd",transition:"animationend"};for(t in e)if(void 0!==i.style[t])return e[t];return"animationend"},d);function d(){this.notifications=[],this.events={},this.X_POSITION_FLEX_MAP={left:"flex-start",center:"center",right:"flex-end"},this.Y_POSITION_FLEX_MAP={top:"flex-start",center:"center",bottom:"flex-end"};var t=document.createDocumentFragment(),i=this._createHTLMElement({tagName:"div",className:"notyf"});t.appendChild(i),document.body.appendChild(t),this.container=i,this.animationEndEventName=this._getAnimationEndEventName(),this._createA11yContainer()}function l(t){var n=this;this.dismiss=this._removeNotification,this.notifications=new a,this.view=new p;var i=this.registerTypes(t);this.options=o(o({},c),t),this.options.types=i,this.notifications.onUpdate(function(t,i){return n.view.update(t,i)}),this.view.on(v.Dismiss,function(t){var i=t.target,e=t.event;n._removeNotification(i),i.triggerEvent(v.Dismiss,e)}),this.view.on(v.Click,function(t){var i=t.target,e=t.event;return i.triggerEvent(v.Click,e)})}return l.prototype.error=function(t){var i=this.normalizeOptions("error",t);return this.open(i)},l.prototype.success=function(t){var i=this.normalizeOptions("success",t);return this.open(i)},l.prototype.open=function(i){var t=this.options.types.find(function(t){return t.type===i.type})||{},e=o(o({},t),i);this.assignProps(["ripple","position","dismissible"],e);var n=new s(e);return this._pushNotification(n),n},l.prototype.dismissAll=function(){for(;this.notifications.splice(0,1););},l.prototype.assignProps=function(t,i){var e=this;t.forEach(function(t){i[t]=null==i[t]?e.options[t]:i[t]})},l.prototype._pushNotification=function(t){var i=this;this.notifications.push(t);var e=void 0!==t.options.duration?t.options.duration:this.options.duration;e&&setTimeout(function(){return i._removeNotification(t)},e)},l.prototype._removeNotification=function(t){var i=this.notifications.indexOf(t);-1!==i&&this.notifications.splice(i,1)},l.prototype.normalizeOptions=function(t,i){var e={type:t};return"string"==typeof i?e.message=i:"object"==typeof i&&(e=o(o({},e),i)),e},l.prototype.registerTypes=function(t){var i=(t&&t.types||[]).slice();return c.types.map(function(e){var n=-1;i.forEach(function(t,i){t.type===e.type&&(n=i)});var t=-1!==n?i.splice(n,1)[0]:{};return o(o({},e),t)}).concat(i)},l}();

(function($) {


    const notyf = new Notyf({
        duration: 1000,
        position: {
            x: 'right',
            y: 'bottom',
        },
        types: [
            {
                type: 'info',
                background: '#2271b1',
                icon: false
            }
        ]
    });

    window.notyf = notyf;

    const style = document.createElement('style');
    style.textContent = "@-webkit-keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@-webkit-keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@-webkit-keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@-webkit-keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@-webkit-keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}@keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}.notyf{position:fixed;top:0;left:0;height:100%;width:100%;color:#fff;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;pointer-events:none;box-sizing:border-box;padding:20px}.notyf__icon--error,.notyf__icon--success{height:21px;width:21px;background:#fff;border-radius:50%;display:block;margin:0 auto;position:relative}.notyf__icon--error:after,.notyf__icon--error:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px;left:9px;height:12px;top:5px}.notyf__icon--error:after{transform:rotate(-45deg)}.notyf__icon--error:before{transform:rotate(45deg)}.notyf__icon--success:after,.notyf__icon--success:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px}.notyf__icon--success:after{height:6px;transform:rotate(-45deg);top:9px;left:6px}.notyf__icon--success:before{height:11px;transform:rotate(45deg);top:5px;left:10px}.notyf__toast{display:block;overflow:hidden;pointer-events:auto;-webkit-animation:notyf-fadeinup .3s ease-in forwards;animation:notyf-fadeinup .3s ease-in forwards;box-shadow:0 3px 7px 0 rgba(0,0,0,.25);position:relative;padding:0 15px;border-radius:2px;max-width:300px;transform:translateY(25%);box-sizing:border-box;flex-shrink:0}.notyf__toast--disappear{transform:translateY(0);-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s}.notyf__toast--disappear .notyf__icon,.notyf__toast--disappear .notyf__message{-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;opacity:1;transform:translateY(0)}.notyf__toast--disappear .notyf__dismiss{-webkit-animation:notyf-fadeoutright .3s forwards;animation:notyf-fadeoutright .3s forwards;opacity:1;transform:translateX(0)}.notyf__toast--disappear .notyf__message{-webkit-animation-delay:.05s;animation-delay:.05s}.notyf__toast--upper{margin-bottom:20px}.notyf__toast--lower{margin-top:20px}.notyf__toast--dismissible .notyf__wrapper{padding-right:30px}.notyf__ripple{height:400px;width:400px;position:absolute;transform-origin:bottom right;right:0;top:0;border-radius:50%;transform:scale(0) translateY(-51%) translateX(13%);z-index:5;-webkit-animation:ripple .4s ease-out forwards;animation:ripple .4s ease-out forwards}.notyf__wrapper{display:flex;align-items:center;padding-top:17px;padding-bottom:17px;padding-right:15px;border-radius:3px;position:relative;z-index:10}.notyf__icon{width:22px;text-align:center;font-size:1.3em;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.3s;animation-delay:.3s;margin-right:13px}.notyf__dismiss{position:absolute;top:0;right:0;height:100%;width:26px;margin-right:-15px;-webkit-animation:notyf-fadeinleft .3s forwards;animation:notyf-fadeinleft .3s forwards;-webkit-animation-delay:.35s;animation-delay:.35s;opacity:0}.notyf__dismiss-btn{background-color:rgba(0,0,0,.25);border:none;cursor:pointer;transition:opacity .2s ease,background-color .2s ease;outline:none;opacity:.35;height:100%;width:100%}.notyf__dismiss-btn:after,.notyf__dismiss-btn:before{content:\"\";background:#fff;height:12px;width:2px;border-radius:3px;position:absolute;left:calc(50% - 1px);top:calc(50% - 5px)}.notyf__dismiss-btn:after{transform:rotate(-45deg)}.notyf__dismiss-btn:before{transform:rotate(45deg)}.notyf__dismiss-btn:hover{opacity:.7;background-color:rgba(0,0,0,.15)}.notyf__dismiss-btn:active{opacity:.8}.notyf__message{vertical-align:middle;position:relative;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s;line-height:1.5em}@media only screen and (max-width:480px){.notyf{padding:0}.notyf__ripple{height:600px;width:600px;-webkit-animation-duration:.5s;animation-duration:.5s}.notyf__toast{max-width:none;border-radius:0;box-shadow:0 -2px 7px 0 rgba(0,0,0,.13);width:100%}.notyf__dismiss{width:56px}}";
    document.head.append(style);

    const udesly_theme_admin = window.udesly_theme_admin;
    if (!udesly_theme_admin) {
        return;
    }
    let notification = null;
    let importing = false;
    if (udesly_theme_admin.import_data) {
        fire_import();
    }

    var showedComplete = false;

    $( document ).on( 'heartbeat-send', function ( event, data ) {
        // Add additional data to Heartbeat data.
        data.udesly_check_data = 'true';
    });

    $( document ).on( 'heartbeat-tick', function ( event, data ) {
        // Check for our data, and use it.
        if ( ! data.udesly_import_data ) {
            return;
        }

        udesly_theme_admin.import_data = data.udesly_import_data;
        fire_import();
    });



    function fire_import() {

        if (!udesly_theme_admin.import_data.has_next) {
            if (notification) {
                notyf.dismiss(notification);
            }
            if (udesly_theme_admin.import_data.status === "complete" && !showedComplete) {
                notyf.success({
                    message: "Data imported successfully!",
                    dismissible: true,
                    duration: 10000
                })
                showedComplete = true;
                importing = false;
            }
            importing = false;
            return;
        }

        if (document.querySelector('.notyf__message')) {
            document.querySelector('.notyf__message').textContent = "Importing data: " + udesly_theme_admin.import_data.import_type + "...  (page: " + (Number(udesly_theme_admin.import_data.next_index) + 1) + ")";
        } else {
            var message = "Importing data: " + udesly_theme_admin.import_data.import_type
            if (udesly_theme_admin.import_data.import_type === "users" && udesly_theme_admin.import_data.next_index === 0) {
                message = "Data file changed, starting background import"
            }
            notification = notyf.open({
                type: "info",
                message: message,
                duration: 0
            })
        }

        const data = {
            action: udesly_theme_admin.action,
            import_type: udesly_theme_admin.import_data.import_type,
            nonce: udesly_theme_admin.nonce,
            next_index: udesly_theme_admin.import_data.next_index
        }
        importing = true;
        $.post(ajaxurl, data, function (response) {
            if(response.success) {
                udesly_theme_admin.import_data.has_next = response.data.has_next;
                udesly_theme_admin.import_data.next_index = response.data.next_index;
                udesly_theme_admin.import_data.import_type = response.data.import_type;
                udesly_theme_admin.import_data.status = response.data.status;
                fire_import();
            }
        })
    }

})(jQuery)
