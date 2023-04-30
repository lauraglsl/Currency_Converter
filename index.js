const _apiKey = '#'
let storage = JSON.parse(localStorage.getItem('storage') ?? '[]')

const to_currency = document.querySelector('#to_currency');
const from_currency = document.querySelector('#from_currency');
const rate = document.getElementById('rate_value');
const convert_btn = document.querySelector('#convert_btn');
const base_rate = document.querySelector('#rate_base');
const showRates_btn = document.querySelector('#showRates_btn');

const api_search = async function (url) {
    try {
        const response = await fetch(url)
        const result = await response.text()
        return result
    } catch (error) {
        console.log('error', error)
    }
    return {}
}

const get_codes = async function () {
    const output = await api_search(`https://v6.exchangerate-api.com/v6/${_apiKey}/codes`)
    const JSON_output = JSON.parse(output)

    if (JSON_output['result'] == 'success') {
        const codes = JSON_output['supported_codes']
        codes.forEach(value => {
            var option_to = document.createElement('option');
            option_to.setAttribute('value', value[0]);
            option_to.textContent = `${value[0]}`;
            to_currency.appendChild(option_to);

            var option_from = document.createElement('option');
            option_from.setAttribute('value', value[0]);
            option_from.textContent = `${value[0]}`;
            from_currency.appendChild(option_from);

            var option_base_rate = document.createElement('option');
            option_base_rate.setAttribute('value', value[0]);
            option_base_rate.textContent = `${value[0]}`;
            base_rate.appendChild(option_base_rate);

        });
    }
}



var arr = new Array();

function addData(from_d, to_d, amount_d, total_d) {
    getData();
    arr.push({
        from_data: from_d,
        to_data: to_d,
        amount_data: amount_d,
        total_data: total_d

    });
    localStorage.setItem("localData", JSON.stringify(arr));
    showData(true);
}
function showData(value) {
    console.log(localStorage.getItem('localdata'));

    getData();
    if (value) {
        const body_t = document.getElementById('body_table')
        var row = document.createElement('tr');
        var col1 = document.createElement('td');
        var col2 = document.createElement('td');
        var col3 = document.createElement('td');
        var col4 = document.createElement('td');

        col1.textContent = arr[[arr.length - 1]].amount_data;
        col2.textContent = arr[[arr.length - 1]].from_data;
        col3.textContent = arr[[arr.length - 1]].to_data;
        col4.textContent = arr[[arr.length - 1]].total_data;

        col2.setAttribute('class', 'center px-6 py-4 font-semibold');
        col3.setAttribute('class', 'center px-6 py-4 font-semibold');
        col1.setAttribute('class', 'center px-6 py-4 font-semibold');
        col4.setAttribute('class', 'center px-6 py-4 font-semibold');

        body_t.appendChild(row);
        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        row.appendChild(col4);
    } else {
        for (let index = 0; index < arr.length; index++) {
            const body_t = document.getElementById('body_table')
            var row = document.createElement('tr');
            var col1 = document.createElement('td');
            var col2 = document.createElement('td');
            var col3 = document.createElement('td');
            var col4 = document.createElement('td');

            col1.textContent = arr[index].amount_data;
            col2.textContent = arr[index].from_data;
            col3.textContent = arr[index].to_data;
            col4.textContent = arr[index].total_data;

            col2.setAttribute('class', 'center px-6 py-4 font-semibold');
            col3.setAttribute('class', 'center px-6 py-4 font-semibold');
            col1.setAttribute('class', 'center px-6 py-4 font-semibold');
            col4.setAttribute('class', 'center px-6 py-4 font-semibold');

            body_t.appendChild(row);
            row.appendChild(col1);
            row.appendChild(col2);
            row.appendChild(col3);
            row.appendChild(col4);
        }


    }

}

function getData() {
    var str = localStorage.getItem("localData");
    if (str != null) {
        arr = JSON.parse(str);
    }
}

function deleteData() {
    localStorage.removeItem('localdata');
}

function displayConvertedData(date, total, conversion_rate, amount) {
    const amount_show = document.getElementById('amount_value')
    const from_show = document.getElementById('from')
    const result_show = document.getElementById('result')
    const to_show = document.getElementById('to')
    const display = document.getElementById('result_info')
    const rate_show = document.getElementById('rate_value')


    amount_show.textContent = amount;
    from_show.textContent = from_currency.value;
    to_show.textContent = to_currency.value;
    result_show.textContent = total;
    rate_show.textContent = conversion_rate
    display.classList.remove("opacity-0");

    addData(from_currency.value, to_currency.value, amount, total);
}

const getConvertedAmount = async function (from, to, amount) {
    const convert_request = `https://v6.exchangerate-api.com/v6/${_apiKey}/pair/${from}/${to}/${amount}`;
    const result = await fetch(convert_request);
    const data = await result.json();
    console.log(data.conversion_result);
    const convert_result = Number(data.conversion_result);
    const conversion_rate = data.conversion_rate;
    const last_update = data.time_last_update_utc;
    if (data['result'] == 'success') {
        displayConvertedData(last_update, convert_result, conversion_rate, amount);
    }

}

convert_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    const from_amount = document.getElementById('amount');
    if (from_amount.value <= '0') {
        alert("You must select a correct amount ");
    } else if (from_currency.value == '1') {
        alert("You must choose currency source ");
    } else if (to_currency.value == '1') {

        alert("You must select currency destination to convert");
    } else {
        let fromCurrency = from_currency.value;
        let toCurrency = to_currency.value;
        let fromAmount = Number(from_amount.value);
        getConvertedAmount(fromCurrency, toCurrency, fromAmount);

    }
})

showRates_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    if (base_rate.value == '1') {
        alert("You must select a currency type");
    } else {

        let fromCurrency = base_rate.value;
        getRates(fromCurrency);

    }
});

const deleteAll_btn = document.getElementById('delete_all')




const getRates = async function (currency) {
    const body_t = document.getElementById('table_rate')
    while (body_t.firstChild) {
        body_t.removeChild(body_t.firstChild);
      }
    const convert_request = `https://v6.exchangerate-api.com/v6/${_apiKey}/latest/${currency}`
    const result = await fetch(convert_request);
    const data = await result.json();
    conversionRates = data.conversion_rates;
    console.log(conversionRates);
    for (var currency_r in conversionRates) {
        if (currency != currency_r) {
            console.log(currency_r + ": " + conversionRates[currency_r]);
            
            var row = document.createElement('tr');
            var col1 = document.createElement('td');
            var col2 = document.createElement('td');

            col1.textContent = currency_r;
            col2.textContent = conversionRates[currency_r];

            col1.setAttribute('class', 'text-black center px-6 py-4 font-semibold');
            col2.setAttribute('class', 'text-black center px-6 py-4 font-semibold');

            body_t.appendChild(row);
            row.appendChild(col1);
            row.appendChild(col2);
        }
    }
}

showData(false);

get_codes();