(function () {

    if (!window.udesly_country_select) {
        return;
    }

    const countriesStates = JSON.parse(window.udesly_country_select.countries_states);

    const countriesOptions = JSON.parse(window.udesly_country_select.countries_options);

    const vatCountries = JSON.parse(window.udesly_country_select.vat_countries);

    const countryField = document.getElementById('billing_country_field');

    const stateField = document.getElementById('billing_state_field');

    const vatField = document.getElementById('vat_number_field');

    const initialCountry = window.udesly_country_select.billing_country;

    const initialState = window.udesly_country_select.billing_state;

    stateField.setAttribute('data-initial-value', initialState);

    stateField.removeAttribute('value');


    const codiceFiscaleField = document.getElementById('codice_fiscale_field');
    const codicePecField = document.getElementById('codice_pec_field');

    if (countryField) {
        const country = initialCountry;
        countryField.removeAttribute('value');

        for (let key in countriesOptions) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = countriesOptions[key];

            countryField.append(option)
        }

        countryField.value = country;

        countryField.addEventListener('change', alignStatesToCountry);

        countryField.dispatchEvent(new Event('change', {bubbles: true}));
    }


    function alignStatesToCountry() {
        if (countryField.value === "IT") {
            if (codiceFiscaleField) {
                codiceFiscaleField.style.display = "";
                codiceFiscaleField.required = true;
            }
            if (codicePecField) {
                codicePecField.style.display = "";
            }
        } else {
            if (codiceFiscaleField) {
                codiceFiscaleField.style.display = "none";
                codiceFiscaleField.required = false;
            }
            if (codicePecField) {
                codicePecField.style.display = "none";
            }
        }

        if (vatField) {
            if (vatCountries.includes(countryField.value)) {
                vatField.style.display = "";
            } else {
                vatField.style.display = "none";
            }
        }

        const states = countriesStates[countryField.value];
        if (states && Object.keys(states).length) {
            stateField.style.display = "";
            stateField.required = true;
            stateField.innerHTML = "";
            for (let key in states) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = states[key];

                stateField.append(option)
            }
            if (stateField.dataset.initialValue) {
                stateField.value = stateField.dataset.initialValue;
                delete stateField.dataset.initialValue;
            }
        } else {
            stateField.style.display = "none";
            stateField.required = false;
        }
    }
})();


