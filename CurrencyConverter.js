const axios = require("axios");

const getExchangeRate = async (fromCurrency, toCurrency) => {
  const response = await axios.get(
    "http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1"
  );

  const rate = response.data.rates;
  const currencyRate = 1 / rate[fromCurrency];
  const exchangeRate = currencyRate * rate[toCurrency];

  if (isNaN(exchangeRate)) {
    throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
  }
};

const getCountries = async toCurrency => {
  try {
    const response = await axios.get(
      `https://restcountries.eu/rest/v2/currency/${toCurrency}`
    );
    return response.data.map(country => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${toCurrency}`);
  }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const countries = await getCountries(toCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(4);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
  You can spend these in the following countries : ${countries}`;
};

convertCurrency("NPR", "INR", 100)
  .then(message => console.log(message))
  .catch(error => {
    console.log(error);
  });
