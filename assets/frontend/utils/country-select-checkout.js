(function () {
  if (!window.wc_country_select_params) {
    return;
  }

  const states_json = wc_country_select_params.countries.replace(
    /&quot;/g,
    '"'
  );
  const states = JSON.parse(states_json);

  const checkoutForm = document.querySelector('form[name="checkout"]');

  if (!checkoutForm) {
    return;
  }

  checkoutForm.addEventListener("change", (e) => {
    if (e.target && e.target.tagName == "SELECT") {
      if (["billing_country", "shipping_country"].includes(e.target.name)) {
        jQuery("body").trigger("country_to_state_changed", [
          e.target.value,
          $(e.target).closest("fieldset"),
        ]);
      }
    }
  });

  jQuery("body").on("country_to_state_changed", (event, country, $wrapper) => {
    const countries = states[country];
    const input = $wrapper.find('[name*="_state"]');

    let input_name = input.attr("name");
    let input_id = input.attr("id");
    let input_classes = input.attr("data-input-classes");
    let value = input.val();
    let placeholder =
      input.attr("placeholder") || input.attr("data-placeholder") || "";
    let $newstate;
    if (countries) {
       $newstate = jQuery( '<select></select>' )
						.prop( 'id', input_id )
						.prop( 'name', input_name )
						.data( 'placeholder', placeholder )
						.attr( 'data-input-classes', input_classes )
						.addClass( 'state_select ' + input_classes );

        const $defaultOption = jQuery( '<option value=""></option>' ).text( wc_country_select_params.i18n_select_state_text );
    
        $newstate.append($defaultOption);

        jQuery.each( countries, function( index ) {
            var $option = $( '<option></option>' )
                .prop( 'value', index )
                .text( countries[ index ] );
            $newstate.append( $option );
        } );
        document.querySelectorAll('label[for="' + input_id + '"]').forEach(label => {
            label.style.display = "";
        })
    } else {
        $newstate = jQuery('<input type="hidden" />')
        .prop("id", input_id)
        .prop("name", input_name)
        .prop("placeholder", placeholder)
        .attr("data-input-classes", input_classes)
        .addClass("hidden " + input_classes);
        document.querySelectorAll('label[for="' + input_id + '"]').forEach(label => {
            label.style.display = "none";
        })
    }
    input.replaceWith($newstate);
    input.val(value);
    $newstate.trigger('change');
  });
})();
