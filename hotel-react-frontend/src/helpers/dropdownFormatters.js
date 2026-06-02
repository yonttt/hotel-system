export const formatCountriesOptions = (countries) => {
  return [
    { value: '', label: '--Nationality--' },
    ...countries.map(country => ({
      value: country.name || country.nationality_name || country.nationality,
      label: country.name || country.nationality_name || country.nationality
    }))
  ];
};

export const formatCitiesOptions = (cities) => {
  return [
    { value: '', label: '--City--' },
    ...cities.map(city => ({
      value: city.city_name || city.name,
      label: city.city_name || city.name
    }))
  ];
};

export const formatPaymentMethodsOptions = (paymentMethods, defaultLabel = 'None selected') => {
  return [
    { value: '', label: defaultLabel },
    ...paymentMethods.map(pm => ({ value: pm.name, label: pm.name }))
  ];
};
