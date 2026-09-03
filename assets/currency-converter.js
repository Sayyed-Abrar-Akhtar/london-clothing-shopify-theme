function convertCurrency(locale, url) {
  const formData = new URLSearchParams();
  formData.append('_method', 'PUT');
  formData.append('source', 'geolocation_selector');
  formData.append('return_to', '/?_ab=0&_fd=0&_sc=1');
  formData.append('country_code', locale);

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })
    .then(function (response) {
      if (response.ok) {
        // Handle successful response
        //console.log(response);
        window.reload();
      } else {
        throw new Error('Currency update failed.');
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}
