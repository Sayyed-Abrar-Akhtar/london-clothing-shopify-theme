function testFn(local_code, order_limit, shipping_limit) {
  try {
    fetch('https://ipapi.co/json/')
      .then((resp) => resp.json())
      .then((data) => {
        const country_code = data.country_code || data.country;
        if (local_code === country_code) {
          //console.log('code matched');
          checkElementAndUpdateContent(
            country_code,
            local_code,
            order_limit,
            shipping_limit
          );
          return;
        }
       
        //console.log('code not matched');
      }) 
      .catch((error)=> {
        console.log(error);
      });
  } catch (error) {
    //console.log('unable to fetch location', error);
  }
}

function checkElementAndUpdateContent(
  country_code,
  local_code,
  order_limit,
  shipping_limit
) {
  const orderLimit = Array.prototype.slice.call(
    document.querySelectorAll('[data-type="order-limit"]')
  );
  const localStoreLocation = Array.prototype.slice.call(
    document.querySelectorAll('[data-type="local-stores-location"]')
  );
  const shippingCharge = Array.prototype.slice.call(
    document.querySelectorAll('[data-type="shipping_charge"]')
  );
  const worldwideText = Array.prototype.slice.call(
    document.querySelectorAll('[data-location="worldwide"]')
  );
  const localRedundantText =  Array.prototype.slice.call(
    document.querySelectorAll('[data-type="local-hidden"]')
  );
  const globalTexts =  Array.prototype.slice.call(
    document.querySelectorAll('[data-type="global-text"]')
  );
  const localTexts =  Array.prototype.slice.call(
    document.querySelectorAll('[data-type="local-text"]')
  );
  
  if(localRedundantText && country_code === local_code) {
    localRedundantText.forEach(el=>el.classList.add('hidden'));
  };

  if(country_code === local_code) {
    globalTexts.forEach(el=>el.classList.add('hidden'));
    localTexts.forEach(el=>el.classList.remove('hidden'));
  } else {
    globalTexts.forEach(el=>el.classList.remove('hidden'));
    localTexts.forEach(el=>el.classList.add('hidden'));
  };

  localStoreLocation.forEach((element) => {
    if (country_code === local_code) {
      element.classList.remove('hidden');
      return;
    }
    element.classList.add('hidden');
  });

  orderLimit.forEach((element) => {
    element.innerText = order_limit;
  });
  shippingCharge.forEach((element) => {
    element.innerText = shipping_limit;
  });

  worldwideText.forEach((element) => {
    if (country_code === local_code) {
      element.innerText = '';
      return;
    }
    element.innerText = ' within EU and UK ';
  });
}
