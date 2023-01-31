import '../css/styles.css';
import Notiflix from 'notiflix';
import Debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

window.onload = () => {
  if (input.value != '') {
    input.value = '';
  }
};

input.addEventListener(
  'input',
  Debounce(() => {
    let name = input.value.trim();
    claerCountries();
    fetchCountries(name)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        if (countries.length === 1) {
          renderCountryInfo(countries);
        }
        if (countries.length > 1) {
          renderCountryList(countries);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      });
  }, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
  const markupList = countries
    .map(country => {
      return `<li class="country-list__item">
          <img class="country-list__flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}">
          <p class="country-list__name">${country.name.official}</p>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markupList;
}

function renderCountryInfo(countries) {
  const markupInfo = countries
    .map(country => {
      return `
      <h2 class="country-info__heading">
          <img class="country-info__flag" 
          src="${country.flags.svg}" 
          alt="Flag of ${country.name.official}">
          <p class="country-info__name">${country.name.official}</p>
      </h2>
          <p class="country-info__detail"><b>Capital:</b> 
          ${country.capital}
          </p>
          <p class="country-info__detail"><b>Population:</b> 
          ${country.population}
          </p>
          <p class="country-info__detail"><b>Languages:</b>
          ${Object.values(country.languages)}
          </p>`;
    })
    .join('');
  countryInfo.innerHTML = markupInfo;
}

function claerCountries() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
