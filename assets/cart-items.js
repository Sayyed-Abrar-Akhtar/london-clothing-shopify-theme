const colorMap = {
    'red': '255, 0, 0',
    'blue': '0, 0, 255',
    'navy': '0, 0, 128',
    'royal blue': '65, 105, 225',
    'sky blue': '135, 206, 235',
    'teal': '0, 128, 128',
    'turquoise': '64, 224, 208',
    'green': '0, 128, 0',
    'dark green': '0, 100, 0',
    'olive': '128, 128, 0',
    'forest green': '34, 139, 34',
    'emerald': '80, 200, 120',
    'mint': '152, 255, 152',
    'yellow': '255, 255, 0',
    'gold': '255, 215, 0',
    'mustard': '255, 219, 88',
    'orange': '255, 165, 0',
    'coral': '255, 127, 80',
    'peach': '255, 218, 185',
    'pink': '255, 192, 203',
    'hot pink': '255, 105, 180',
    'rose': '255, 228, 225',
    'magenta': '255, 0, 255',
    'purple': '128, 0, 128',
    'lavender': '230, 230, 250',
    'violet': '238, 130, 238',
    'burgundy': '128, 0, 32',
    'maroon': '128, 0, 0',
    'brown': '165, 42, 42',
    'dark brown': '101, 67, 33',
    'chocolate': '123, 63, 0',
    'coffee': '111, 78, 55',
    'espresso': '80, 50, 20',
    'cognac': '154, 73, 33',
    'caramel': '175, 110, 57',
    'tan': '210, 180, 140',
    'beige': '245, 245, 220',
    'khaki': '240, 230, 140',
    'camel': '193, 154, 107',
    'taupe': '72, 60, 50',
    'black': '0, 0, 0',
    'white': '255, 255, 255',
    'gray': '128, 128, 128',
    'light gray': '211, 211, 211',
    'charcoal': '54, 69, 79',
    'silver': '192, 192, 192',
    'platinum': '229, 228, 226',
    'denim': '21, 96, 189',
    'light denim': '156, 187, 219',
    'dark denim': '16, 62, 116',
    'indigo': '75, 0, 130',
    'cream': '255, 253, 208',
    'ivory': '255, 255, 240',
    'offwhite': '250, 249, 246',
    'off white': '250, 249, 246',
    'ecru': '194, 178, 128',
    'crimson': '220, 20, 60',
    'salmon': '250, 128, 114',
    'terra cotta': '226, 114, 91',
    'rust': '183, 65, 14',
    'champagne': '247, 231, 206',
    'blush': '222, 93, 131',
    'mauve': '224, 176, 255',
    'aubergine': '59, 31, 31',
    'eggplant': '97, 64, 81',
    'plum': '142, 69, 133',
    'lilac': '200, 162, 200',
    'orchid': '218, 112, 214',
    'stone': '101, 100, 95',
    'heather gray': '182, 177, 169',
    'lemon': '255, 247, 0',
    'lime': '0, 255, 0',
    'sage': '188, 184, 138',
    'moss': '138, 154, 91',
    'pistachio': '147, 197, 114',
    'seafoam': '159, 226, 191',
    'cobalt': '0, 71, 171',
    'cerulean': '0, 123, 167',
    'aqua': '0, 255, 255',
    'periwinkle': '204, 204, 255',
    'dusty rose': '201, 140, 136',
    'rose gold': '183, 110, 121',
    'copper': '184, 115, 51',
    'bronze': '205, 127, 50',
    'pewter': '169, 169, 169',
    'gunmetal': '42, 52, 57',
    'slate': '112, 128, 144',
    'sand': '194, 178, 128',
    'putty': '170, 154, 123',
    'mocha': '130, 85, 51',
    'hazelnut': '167, 123, 92',
    'almond': '239, 222, 205',
    'wine': '114, 47, 55',
    'bordeaux': '92, 30, 41',
    'raspberry': '227, 11, 93',
    'fuchsia': '255, 0, 128'
  };
function generateDynamicSwatches(link, colors) {
  //console.log({link, colors})
  if (!colors?.length) return '';

  const swatches = colors
    .map(c => {
      const rgb = colorMap[c.color.toLowerCase()];
      const isColorMulti = c.color.toLowerCase().includes('mul')
      if (!rgb && !isColorMulti) return '';
      
      return c.current 
        ? `<span class="color-swatches ${isColorMulti ? 'color-swatch-multicolor' : ''} current" style="background-color: rgba(${rgb},0.5);border-color:rgb(${rgb});" title="${c.color}" aria-label="Current: ${c.color}"><span class="sr-only">${c.color}</span></span>`
        : `<span data-color-swatch-type="link" data-color-swatch-link="${link.replace('variant=', `variant=${c.id}`)}" class="color-swatches cursor-pointer ${isColorMulti ? 'color-swatch-multicolor' : ''} ${c.hasImage!=='' ? ``: `swatch--hidden`}" style="background-color: rgba(${rgb},0.8);" title="${c.color.toUpperCase()}" aria-label="Select: ${c.color}" data-color-name="${c.color}" data-variant-id="${c.id}"><span class="sr-only">${c.color}</span></span>`;
    })
    .filter(Boolean)
    .join('');

  return swatches ? `<div class="color-swatches-container flex items-center gap-1 py-1">${swatches}</div>` : '';
}


function syncVariantStockQty(doc) {
  //const btns = document.querySelectorAll('[data-btn-type="reduce-quantity"]');

  const varaintsDetailEls = doc.querySelectorAll(
    '[data-for="variant-selector"]'
  );
  //console.log(varaintsDetailEls);
  if (varaintsDetailEls.length) {
    varaintsDetailEls.forEach((v) => {
      const key = v?.dataset?.key;
      const availableStock = v?.dataset?.availableStock;
      //console.log({ str: `[data-btn-variant-id="${key}"]` });

      const correspondingVariantBtn = document.querySelector(
        `[data-btn-variant-id="${key}"]`
      );

      const quantity = correspondingVariantBtn?.dataset?.quantity;
      const vKey = correspondingVariantBtn?.dataset?.key;

      //correspondingVariantBtn?.addEventListener("click", function () {
      //  addQuantity(vKey, quantity, availableStock, key);
      //});
      correspondingVariantBtn?.setAttribute(
        "onclick",
        `addQuantity('${vKey}', ${Number(quantity)}, ${Number(
          availableStock
        )}, ${key})`
      );
      //console.log({
      //  vKey,
      //  quantity,
      //  availableStock,
      //  key,
      // });
    });
  }
}

function reloadHeader() {
  const selector = '[data-elem-type="cart-items-variant-qty-detail"]';

  fetch(window.location.href, { credentials: "same-origin" })
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const updatedDoc = parser.parseFromString(html, "text/html");
      //console.log({ updatedDoc });
      //alert();
      const currentEl = document.querySelector(selector);
      const updatedEl = updatedDoc.querySelector(selector);

      syncVariantStockQty(updatedDoc);
      currentEl.innerHTML = updatedEl.innerHTML;
      //console.log("header reloaded");
      //alert("header reloaded");
    })
    .catch((err) => console.error("Failed to reload header:", err));
}

function loadRecommendedProducts(productID) {
  const cartRecommendedProductsContainer = document.getElementById(
    "cartRecommendedProducts"
  );
  fetch(
    `${window.Shopify.routes.root}recommendations/products.json?product_id=${productID}&limit=4&intent=related`
  )
    .then((response) => response.json())
    .then(({ products }) => {
      if (products?.length > 0) {
        const cardEl = products
          .map((prod) =>
            prepareRecommededProductCard(
              prod.url,
              prod.title,
              prod.featured_image,
              prod.price,
              prod.compare_at_price
            )
          )
          .join("");
        //console.log(products);
        cartRecommendedProductsContainer.innerHTML = cardEl;
      }
    });
}

function prepareRecommededProductCard(
  url,
  title,
  featured_image,
  price,
  compare_at_price
) {
  const presentmentCurrency = window.Shopify.currency.active;
  const formattedCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: presentmentCurrency,
  });
  return `
      <a href="${url.split("?")[0]}" class="flex flex-col items-center">
        <div style="width:150px;">
          <img style="object-fit: cover; height:200px;" class="w-full" src=${featured_image} alt=${title} />
        
          <div class="mt-2">
            <strong class="text-[11px]">${title}</strong>
          </div>
          <div class="flex gap-2 items-center text-[11px] mt-3"><span>${formattedCurrency.format(
            price / 100
          )}&nbsp;${window.currency.code}</span>${
    compare_at_price
      ? `<s>${formattedCurrency.format(compare_at_price / 100)}&nbsp;${window.currency.code}</s>`
      : ""
  }</div>
        </div>
      </a>
    `;
}

function addQuantity(key, quantity, availableQuantity, variantId) {
  if (quantity < availableQuantity) {
    event.target.parentElement.removeAttribute("disabled");
    const updatedQty = Number(quantity) + 1;
    updateQuantity(key, updatedQty);
    return updatedQty;
  } else {
    //console.log(quantity, availableQuantity);
    event.target.parentElement.setAttribute("disabled", "disabled");
  }
}

function reduceQuantity(key, quantity) {
  if (quantity > 1) {
    const updatedQty = Number(quantity) - 1;
    updateQuantity(key, updatedQty);
    return updatedQty;
  } else {
    removeItemFromCart(key);
  }
}

function toggleOtherEl(cartValue="open") {
   const prodCardSizeOpener = document.querySelectorAll('.product-card-size-toggle--sm'); 
   
   if(prodCardSizeOpener.length>0) {
    Array.from(prodCardSizeOpener).forEach(el=>{
      el.dataset.cartDrawerEl = cartValue;
    })
   }
}

function loadCart(cartContainerId, cartDrawerId, eventType) {
  const cartTotalPrice = document.querySelector(
    `[data-type="cart_total_price"]`
  );

  const emptyCartMessage = document.querySelector(
    `[data-text-type="empty-cart-message"]`
  );

  const cartRecommendedProductsContainer = document.getElementById(
    "cartRecommendedProducts"
  );

  toggleOtherEl();

  document
    .getElementById("mobile_menu_container")
    .classList.remove("menu--active");

  const cartItem = (item, currencySymbol, currencyISOCode) => {
    const cartAvailableStockElem = document.querySelector(
      `[data-key="${item.variant_id}"]`
    );

    const availableStock = cartAvailableStockElem?.dataset?.availableStock;

    //console.log({
    //res: item,
    //availableStock,
    //cartAvailableStockElem,
    //id: item.variant_id,
    //});

    return `
      <section 
      data-contains="cart-items" 
      class="flex space-x-2 items-start justify-between min-h-[120px]">
        <section class="w-[15%] min-h-[120px]">
          ${
            item.featured_image.url
              ? `<img src="${item.featured_image.url}&amp;width=54" alt="${item.featured_image.alt}" srcset="${item.featured_image.url}&amp;width=54 54w" width="54" height="80" loading="lazy">`
              : ""
          }
          
          </section>
          <section class="grid grid-rows-4 grid-cols-1 gap-0.5 content-between w-[55%] md:w-[60%] min-h-[120px] ml-5">
            <a href="${
              item.url
            }" class="text-[11px]" style="line-height: 120%;display: flex;gap: 5px;align-items: center;">
              <strong>
                ${item.title.split("-")[0]}
              </strong>
            </a>
            <p class="text-[11px]" style="line-height: 30%;display: flex;gap: 5px;align-items: center;">
              <strong class='inline-block pl-1'>Colour:</strong>
              ${item.variant_options[0]}
            </p>
            <p class="text-[11px]" style="line-height: 30%;display: flex;gap: 5px;align-items: center;">
              <strong class='inline-block pl-1'>Size:</strong>
              ${item.variant_options[1]}
            </p>
            <div 
            class="flex items-center justify-center border border-black w-max" 
            data-qty-container="${item.key}" style="height:25px;">
              <button data-btn-type="add-quantity" style="width:15px;" class="flex items-center cursor-pointer mx-1 md:mx-4" onclick="reduceQuantity('${
                item.key
              }',  ${item.quantity})">
                <svg id="Account--Streamline-Atlas" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50">
                  <!-- Generator: Adobe Illustrator 30.1.0, SVG Export Plug-In . SVG Version: 2.1.1 Build 136)  -->
                  <defs>
                    <style>
                      .st0 {
                        fill: none;
                        stroke: #000;
                        stroke-miterlimit: 10;
                        stroke-width: 1.5px;
                      }
                    </style>
                  </defs>
                  <line class="st0" x1="10.4" y1="25" x2="39.6" y2="25"/>
                </svg>
                
              </button>
              <span class='border-x border-black w-10 md:w-12 flex justify-center'>
              ${item.quantity}
              </span>
              <button 
              data-btn-type="reduce-quantity"
              data-btn-variant-id="${item.variant_id}"
              data-key="${item.key}"
              data-quantity="${item.quantity}"
              style="width:15px;"
              class="flex items-center h-3 cursor-pointer mx-1 md:mx-4 disabled:cursor-not-allowed disabled:slate-100" 
              ${
                Number(item.quantity) === Number(availableStock)
                  ? "disabled"
                  : null
              }
              onclick="addQuantity(
                '${item.key}', 
                ${item.quantity}, 
                ${availableStock},
                ${item.variant_id})">
                <svg id="Account--Streamline-Atlas" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50">
                  <!-- Generator: Adobe Illustrator 30.1.0, SVG Export Plug-In . SVG Version: 2.1.1 Build 136)  -->
                  <defs>
                    <style>
                      .st0 {
                        fill: none;
                        stroke: #000;
                        stroke-miterlimit: 10;
                        stroke-width: 1.5px;
                      }
                    </style>
                  </defs>
                  <line class="st0" x1="25" y1="10.4" x2="25" y2="39.6"/>
                  <line class="st0" x1="10.4" y1="25" x2="39.6" y2="25"/>
                </svg>
              </button>
            </div>
          </section>
          <section class="flex min-h-[120px] flex-col items-end md:items-center justify-between w-[25%]">
            <span 
            data-btn-type="remove"
            data-item-id="${item.id}" 
            style="width:25px;"
            class="h-5 cursor-pointer"
            onclick="removeItemFromCart('${item.key}')">
              <svg id="Account--Streamline-Atlas" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50" class="icon icon-remove fill-red-600 text-red-600 font-semibold">
                <!-- Generator: Adobe Illustrator 30.1.0, SVG Export Plug-In . SVG Version: 2.1.1 Build 136)  -->
                <defs>
                  <style>
                    .st0-trash {
                      fill: none;
                      stroke: #dc2626;
                      stroke-linejoin: round;
                      stroke-width: 1.5px;
                    }
                  </style>
                </defs>
                <path class="st0-trash" d="M39.5,19.2l-3.6,20.6c-.3,1.7-1.8,3-3.6,3h-14.7c-1.8,0-3.3-1.3-3.6-3l-3.6-20.6"/>
                <path class="st0-trash" d="M41.4,14.4h-10.2M8.6,14.4h10.2M18.9,14.4v-3.6c0-2,1.6-3.6,3.6-3.6h5c2,0,3.6,1.6,3.6,3.6v3.6M18.9,14.4h12.3"/>
                <line class="st0-trash" x1="18.9" y1="20.2" x2="21.2" y2="38.7"/>
                <line class="st0-trash" x1="31.1" y1="20.2" x2="28.8" y2="38.7"/>
              </svg>
            </span>
            <span>
              <strong>
               ${formatPriceCurrency(
                 currencySymbol,
                 currencyISOCode,
                 item.quantity * item.price
               )} 
              </strong>
            </span>
          </section>

        </section>
    `;
  };

  const htmlCartSkeletonElem = `
  <div  id="cart_container_item_skeleton" class='w-full my-2 flex mx-4 space-x-2'>
    <div class='w-[15%] h-[50px] animate-pulse flex justify-start'><span class='w-[90%] h-full inline-block rounded bg-slate-300'>&nbsp;</span></div>
    <div class='w-[60%] h-[50px] grid grid-rows-3 grid-cols-1 gap-1 animate-pulse justify-between'>
      <div class='w-full bg-slate-300 rounded'>&nbsp;</div>
      <div class='w-full bg-slate-300 rounded'>&nbsp;</div>
      <div class='w-full bg-slate-300 rounded'>&nbsp;</div>
    </div>
   <div class='w-[25%] h-[50px] animate-pulse flex justify-start'><span class='w-[90%] h-full inline-block rounded bg-slate-300'>&nbsp;</span></div>
  </div>
`;

  setTimeout(() => {
    //console.log('cartItem', cartItem);
    document.querySelector("body").classList.add("overflow-hidden");
    let cartDrawer = document.getElementById(cartDrawerId);

    cartDrawer?.classList.remove("drawer--inactive");
    cartDrawer?.classList.remove("hidden");
    cartDrawer?.classList.add("drawer--active");
  }, 500);
  setTimeout(() => {
    reloadHeader();
  }, 1000);

  const cartContainer = document.getElementById(cartContainerId);
  const cartItems = Array.prototype.slice.call(
    document.querySelectorAll('[data-contains="cart-items"]')
  );

  if (eventType === "ADD_TO_CART") {
    cartContainer.insertAdjacentHTML("afterbegin", htmlCartSkeletonElem);
  }

  fetch(window.Shopify.routes.root + "cart.js")
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      if (result.item_count > 1) {
        emptyCartMessage?.classList.add("hidden");
      } else {
        emptyCartMessage?.classList.remove("hidden");
      }
      //cartContainer.remove();

      cartItems.forEach((element) => {
        element.remove();
      });

      document.getElementById("cart_container_item_skeleton")?.remove();
      //console.log('get result', result);

      const cartItemInfoElement = document.querySelector(
        "[data-type='cart_items_info_element']"
      );

      const currencySymbol = window.currency.symbol;
      const currencyISOCode = window.currency.code;

      if (cartTotalPrice) {
        cartTotalPrice.innerHTML =
          result.items.length > 0
            ? `<strong>${formatPriceCurrency(
                currencySymbol,
                currencyISOCode,
                result.total_price
              )}</strong>`
            : `<strong>${currencySymbol}0.00 ${currencyISOCode}</strong>`;
        const formattedCartTotal = Number(result.total_price) / 100;
        cartTotalPrice.dataset.cartTotal = formattedCartTotal.toFixed(2);
        getCountryAndSetShipping();
      }
      //console.log(result);
      if (result.items.length) {
        emptyCartMessage?.classList.add("hidden");
        result.items.forEach((item) => {
          loadRecommendedProducts(item.product_id);
          /*fetchProductsRecommended(
            item.product_id,
            currencySymbol,
            currencyISOCode
          );*/
          cartContainer.insertAdjacentHTML(
            "beforeend",
            cartItem(item, currencySymbol, currencyISOCode)
          );
        });
      } else {
        emptyCartMessage?.classList.remove("hidden");
        //fetchProductsRecommended(null, currencySymbol, currencyISOCode);
      }
    })
    .catch((error) => {
      document.getElementById("cart_container_item_skeleton")?.remove();
      console.error("Error:", error);
      emptyCartMessage?.classList.remove("hidden");
    });
  reloadCartContent();
}

function addItemToCart(formData, cartID, cartDrawerId) {
  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((postResult) => {
      loadCart(cartID, cartDrawerId, "ADD_TO_CART");

      //console.log("postResult", postResult);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function removeItemFromCart(key) {
  loadCart("cart_drawer_container", "cart_drawer", "REMOVE_FROM_CART");
  updateQuantity(key, 0);
}

function updateQuantity(key, value = 0) {
  const update = {};
  update[key] = value;
  //console.log({ value, update });

  const qtyContainer = document.querySelector(`[data-qty-container="${key}"]`);

  qtyContainer?.setAttribute("disabled", "disabled");

  fetch(window.Shopify.routes.root + "cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updates: update }),
  })
    .then((response) => {
      return response.json();
    })
    .then((updateResult) => {
      loadCart("cart_drawer_container", "cart_drawer", "UPDATED_CART_ITEM");
      qtyContainer?.removeAttribute("disabled");

      //console.log("updateResult", updateResult);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function formatPriceCurrency(symbol, isocode, price) {
  return `${symbol}${(price / 100).toFixed(2)} ${isocode}`;
}

function fetchProductsRecommended(id, symbol, iso_code) {
  const defaultProductsEl = document.querySelector(
    '[data-display-products="default"]'
  );

  const productYouMayLikeContainer = document.querySelector(
    '[data-product-types="you-may-like"]'
  );
  const showBadge = Boolean(
    Number(productYouMayLikeContainer?.dataset.showDiscountBadge)
  );

  /*console.log(
    showBadge,
    typeof showBadge,
    productYouMayLikeContainer?.dataset.showDiscountBadge
  );*/

  //console.log("productYouMayLikeContainer", productYouMayLikeContainer);
  const skeletonsYouMayLike = Array.prototype.slice.call(
    document.querySelectorAll('[data-type="you-may-like-skeleton"]')
  );

  const errMsgContainer = document.getElementById("err-loading-products");
  fetch(
    window.Shopify.routes.root +
      `recommendations/products.json?product_id=${id}&limit=4&intent=related`
  )
    .then((response) => response.json())
    .then(({ products }) => {
      //console.log("response", products[0], "showBadge==>", showBadge);
      skeletonsYouMayLike.forEach((skeleton) =>
        productYouMayLikeContainer.contains(skeleton)
          ? productYouMayLikeContainer?.removeChild(skeleton)
          : null
      );
      if (products.length > 0) {
        if (errMsgContainer) errMsgContainer.innerHTML = "";
        productYouMayLikeContainer.innerHTML = "";
        //console.log("response", products[0], "showBadge==>", showBadge);
        products.forEach((product) => {
          productYouMayLikeContainer.insertAdjacentHTML(
            "beforeend",
            //'<p>test</p>'
            makeProductCard(product, symbol, iso_code, showBadge)
          );
        });
      } else {
        productYouMayLikeContainer.innerHTML =
          defaultProductsEl.innerHTML ||
          `<div id='err-loading-products' class='h-[400px] flex items-center justify-center flex-col'><p>${productYouMayLikeContainer?.dataset.errHeading}</p><a href='${productYouMayLikeContainer?.dataset.btnUrl}' class='my-5 lowercase font-semibold underline'>${productYouMayLikeContainer?.dataset.btnText}</a></div>`;
      }
    })
    .catch((error) => {
      //console.log("def prods", defaultProductsEl.innerHTML);
      skeletonsYouMayLike.forEach((skeleton) =>
        productYouMayLikeContainer.contains(skeleton)
          ? productYouMayLikeContainer?.removeChild(skeleton)
          : null
      );
      productYouMayLikeContainer.innerHTML =
        defaultProductsEl.innerHTML ||
        `<div id='err-loading-products' class='h-[400px] flex items-center justify-center flex-col'><p>${productYouMayLikeContainer?.dataset.errHeading}</p><a href='${productYouMayLikeContainer?.dataset.btnUrl}' class='my-5 lowercase font-semibold underline'>${productYouMayLikeContainer?.dataset.btnText}</a></div>`;
    });
}

function isTenDaysPassed(createdAt) {
  // Parse the ISO 8601 date string
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  
  // Calculate the difference in milliseconds
  const timeDifference = currentDate.getTime() - createdDate.getTime();
  
  // Convert milliseconds to days
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  //console.log({daysDifference})
  // Check if 10 or more days have passed
  return daysDifference >= 10;
}

function showProductBadge(product) {
  const tenDaysPassed = isTenDaysPassed(product.created_at);

  const badge = product.available
  ? product.compare_at_price > product.price
    ? "sale"
    : tenDaysPassed
      ? ""
      : "new in"
  : "sold out";
  
  return badge.length ? `
  <span
    id="product-badge-${product.id}"
    class="product-badge absolute top-[320px] left-0 text-xs bg-[rgba(255,255,255,0.75)] text-black px-[8px] py-[5px] uppercase rounded-r shadow-md"
    >${
      product.available
        ? product.compare_at_price > product.price
          ? "sale"
          : tenDaysPassed ?'': "new in"
        : "sold out"
    }
</span>`:''
}

function makeSizesBar(variants) {
  return variants.map(v=> `
    <form action="/cart/add" method="post" enctype="multipart/form-data" novalidate="novalidate">
    ${v.available ?
       `<input type="hidden" name="form_type" value="product">
        <input type="hidden" name="utf8" value="✓">
        <input type="hidden" name="id" value="${v.id}">
        <button
          type="button"
          name="add"
          onclick="addVariantToCart(event,this);"
          class="variant-sizes available variant-{{product_id}}"
          data-variant="${v.id}"
          data-variantid="${v.id}"
        >
          ${v.option2}
        </button>`
      : 
      `<p
          class="variant-sizes no-stock variant-{{product_id}}"
          data-variant="${v.id}-sold"
          data-variantid="${v.id}"
        >
          ${v.option2}
        </p>`
    }
    </form> 
  `).join('')
}
function makeProductCard(product, symbol, iso_code, showBadge = false) {
  
  const productSizes = product?.options?.find(p=>p?.name?.toLowerCase()?.includes('size')).values;
  const colorsArr = product?.options?.find(p=>p?.name?.toLowerCase()?.includes('color')).values;
  const activeColor = colorsArr[0];
  const activeVariants = product?.variants.filter(p=>p.option1 === activeColor);
  const imagesArr = product?.media?.filter(p_img=> p_img.media_type === 'image')
  const frontImageAlt = generateImageAltText(imagesArr[0],product);
  const backImageAlt = generateImageAltText(imagesArr[1] || imagesArr[0],product);
  // Process colors with variants and featured images
  const colors = colorsArr.map((clr) => ({
    color: clr,
    id: product.variants?.find(pv => pv.options[0] === clr)?.id,
    include: product.variants?.find(pv => pv.options[0] === clr)?.featured_image 
      ? `${product.variants.find(pv => pv.options[0] === clr)?.featured_image.id}` 
      : ''
  })).map((clr, idx) => idx === 0 ? { ...clr, current: true } : clr);
  
  console.log(product)

  const link = `/products/${product.handle}?variant=${product.variants[0].id}`

  return `
      <section
        class="product--card coll_item self-stretch w-full rounded-sm product {{extraclass}} min-h-max my-5"
        data-coll-type="{{data_coll_type}}"
      > 
        <a
          ${
            product.available
              ? `href="/products/${product.handle}?variant=${product.variants[0].id}"`
              : null
          }
          class="product-image border-red-300 border-1 block w-full overflow-hidden"
        >
        <div class="relative">
          ${product?.compProductsId?.includes(product?.id)?`<span class="absolute top-2 left-2 text-[11px] uppercase p-1 bg-white z-1">It's a match</span>`:``}
          <span
            class="absolute right-0 text-2xl md:hidden product-card-size-toggle--sm"
            style="bottom:7px;padding-inline:10px;padding-block:5px;transition:transform 0.7s ease-out;"
            onclick="showVariantSizes(event, this);"
            data-sizes="close"
            data-cart-drawer-el="close"
            >+</span
          >
          <div class="variant-available-sizes variant--hidden">
            <div class="variant-available-sizes-holder">
               ${makeSizesBar(activeVariants)} 
            </div>
          </div>
          <section
            class="featured-image rounded-sm overflow-hidden w-full h-[431px] mb-4"
          >
            <img
              src="${product.featured_image}&amp;width=300"
              alt="${frontImageAlt}"
              srcset="${product.featured_image}&amp;width=300 300w, ${product.featured_image}&amp;width=400 400w"
              width="300"
              height="444"
              loading="lazy"
            /> 
            ${showProductBadge(product)}
          </section>

          <section
            class="absolute second-image aspect-[291/431] rounded-sm overflow-hidden w-full h-[431px] mb-4"
          >
            ${product.images[1] 
              ? 
              `<img
                src="${product.images[1]}&amp;width=300"
                alt="${backImageAlt}"
                srcset="${product.images[1]}&amp;width=300 300w, ${product.images[1]}&amp;width=400 400w"
                width="300"
                height="444"
                loading="lazy"
              />${showProductBadge(product)}`
              : 
              `<img
                src="${product.featured_image}&amp;width=300"
                alt="${frontImageAlt}"
                srcset="${product.featured_image}&amp;width=300 300w, ${product.featured_image}&amp;width=400 400w"
                width="300"
                height="444"
                loading="lazy"
              />${showProductBadge(product)}`
            }
          </section>
          </div>    
          <article class="text-[11px] px-2 mt-2" itemscope itemtype="http://schema.org/Product">
            <p itemprop="name" class="uppercase font-semibold leading-[150%] tracking-wide space-x-2 mb-3 max-w-[280px]">
              ${product.title}
            </p>
            <p itemprop="vendor" class="uppercase mt-2">${product.vendor}</p>
            ${generateDynamicSwatches(link, colors)}
            <p class="mb-3">
              <span  class="font-semibold">
              ${window.currency.symbol}${(product.price / 100).toFixed(2)} ${window.currency.code}
              </span>
              ${
                product.compare_at_price !== "blank" &&
                product.compare_at_price > product.price
                  ? `<s class="ml-2 font-semibold">${window.currency.symbol}${(
                      product.compare_at_price / 100
                    ).toFixed(2)} ${window.currency.code}</s>`
                  : ""
              }
            </p>
          </article>
        </a>
      </section>
    `;
}

function getCountryAndSetShipping() {
  fetch(
    window.Shopify.routes.root +
      "browsing_context_suggestions.json" +
      "?country[enabled]=true" +
      `&country[exclude]=${window.Shopify.country}` +
      "&language[enabled]=true" +
      `&language[exclude]=${window.Shopify.language}`
  )
    .then((response) => response.json())
    .then((data) => {
      let freeShippingAmt;
      const cartTtlPrice = document.querySelector(
        '[data-type="cart_total_price"]'
      );
      const cartTotalEl = cartTtlPrice.dataset.cartTotal;
      const cartTotal = Number(Number(cartTotalEl).toFixed(2));

      const progressBarContainer = document.querySelector(
        ".cart-progress-bar-box"
      );
      //console.log({ cartTotal, ty: typeof cartTotal });
      if (cartTotal <= 0) {
        progressBarContainer.classList.add("hidden");
        return;
      } else {
        progressBarContainer.classList.remove("hidden");
      }
      const country_code = data.detected_values.country.handle;
      if (country_code === "CY") {
        freeShippingAmt = 20;
      } else {
        freeShippingAmt = 70;
      }
      const freeShippingEl = document.querySelector(".free__shipping__msg");
      const shippingTextEl = document.querySelector(".shipping__text");
      const progressBarStatus = document.querySelector(
        ".progress__bar__status"
      );

      const remainingAmt = (freeShippingAmt - Number(cartTotal)).toFixed(2);
      if (remainingAmt > 0) {
        freeShippingEl.classList.add("hidden");
        shippingTextEl.classList.remove("hidden");
        progressBarStatus.classList.remove("bg-green-500");
        progressBarStatus.classList.add("bg-black");
        const shippingThreshhold = document.querySelector(
          ".shipping__threshold"
        );
        shippingThreshhold.innerHTML = remainingAmt;
        progressBarStatus.style.transform = `translateX(-${
          100 - calculatePercentage(Number(cartTotal), freeShippingAmt)
        }%)`;
        //console.log({
        //  a: cartTotal,
        //  b: freeShippingAmt,
        //  percent: calculatePercentage(Number(cartTotal), freeShippingAmt),
        //});
      } else {
        freeShippingEl.classList.remove("hidden");
        shippingTextEl.classList.add("hidden");
        progressBarStatus.style.transform = "translateX(0)";
        progressBarStatus.classList.add("bg-green-500");
        progressBarStatus.classList.remove("bg-black");
      }
    })
    .catch((error) => {
      console.error("Error fetching browsing context suggestions:", error);
    });
}

async function reloadCartContent() {
  reloadHeader();
  if (!window.location.pathname.includes("cart")) {
    return;
  }

  try {
    // Fetch the updated cart data from Shopify AJAX API
    const response = await fetch("/cart?view=ajax"); // assumes a cart.liquid template with {% section 'cart-template' %} wrapped in 'ajax' view

    if (!response.ok) throw new Error("Network response was not ok");
    const html = await response.text();

    // Create a temporary element to extract HTML fragment
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Get the new cart section from the fetched HTML
    const newCartSection = tempDiv.querySelector(".s-cart-page-container"); // Replace with actual ID/class used for your cart container
    //console.log({ id: 1, newCartSection });
    if (!newCartSection)
      throw new Error("Cart container not found in response");

    // Replace existing cart section
    const existingCartSection = document.querySelector(
      ".s-cart-page-container"
    ); // Replace with actual container ID
    existingCartSection.innerHTML = newCartSection.innerHTML;
    bindCartPageEvents();
    renderRelatedProducts();
    // setTimeout(function () {
    //   const newCartDrawer = tempDiv.querySelector(".cart_drawer_box");
    //   const existingCartDrawer = document.querySelector(".cart_drawer_box");
    //   existingCartDrawer.innerHTML = newCartDrawer.innerHTML;
    // }, 3000);
    // console.log({
    //   id: 2,
    //   newCartSection,
    //   existingCartSection,
    //   existingCartDrawer,
    // });

    // console.log("Cart content reloaded");
    // console.log(newCartDrawer);
  } catch (error) {
    console.error("Failed to reload cart content:", error);
  }
}

function calculatePercentage(val, total) {
  if (typeof val !== "number" || typeof total !== "number" || total === 0) {
    return 0;
  }

  return Math.round((val / total) * 100);
}

function updateCartPageItemReq(key, value, successFn) {
  //alert();
  const update = {};
  update[key] = value;

  fetch(window.Shopify.routes.root + "cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updates: update }),
  })
    .then((response) => {
      return response.json();
    })
    .then((updateResult) => {
      successFn();

      //console.log("updateResult", updateResult);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function updateCartPageItem(key, qty) {
  loadCartItem(key, true);

  updateCartPageItemReq(key, qty, reloadCartContent);

  //loadCartItem(key, false);
}

function bindCartPageEvents() {
  const decreaseBtns = document.querySelectorAll(".s-cart-item-decrease");
  const increaseBtns = document.querySelectorAll(".s-cart-item-increase");
  const clearBtns = document.querySelectorAll(".s-cart-item-remove");
  Array.from(decreaseBtns).forEach((decreaseBtn) => {
    decreaseBtn?.addEventListener("click", function (e) {
      const key = e.currentTarget.dataset.key;
      const qty = e.currentTarget.dataset.quantity;
      const updatedQty = parseInt(qty) - 1 > 0 ? parseInt(qty) - 1 : 0;
      //console.log("decreasing", key, updatedQty);
      //addQuantity()
      updateCartPageItem(key, updatedQty);
    });
  });

  Array.from(increaseBtns).forEach((increaseBtn) => {
    increaseBtn?.addEventListener("click", function (e) {
      const key = e.currentTarget.dataset.key;
      const qty = e.currentTarget.dataset.quantity;
      const availQty = e.currentTarget.dataset.availableQuantity;
      const updatedQty =
        parseInt(qty) + 1 > parseInt(availQty)
          ? parseInt(availQty)
          : parseInt(qty) + 1;
      //reduceQuantity()
      //console.log("increasing", key, updatedQty);

      updateCartPageItem(key, updatedQty);
    });
  });
  Array.from(clearBtns).forEach((clearBtn) => {
    clearBtn?.addEventListener("click", function (e) {
      const key = e.currentTarget.dataset.key;
      const qty = 0;
      //console.log("removing", key, qty);
      //addQuantity()
      updateCartPageItem(key, qty);
    });
  });
}

function loadCartItem(key, load) {
  const cartItem = document.querySelector(`[data-cart-item-key="${key}"]`);
  const cartItemLoader = document.querySelector(`[data-loader-key="${key}"]`);
  if (load) {
    cartItem.classList.add("loading");
    cartItemLoader.classList.add("loading");
  } else {
    cartItem.classList.remove("loading");
    cartItemLoader.classList.remove("loading");
  }
}

function retrievePaymentIcon() {
  const paymentIconsEl = document.querySelector(
    '[data-elem="supported-payment-icons"]'
  );
  const placeholderEls = document.querySelectorAll(
    '[data-placeholder-value="supported-payment-icons"]'
  );
  if (paymentIconsEl) {
    placeholderEls.forEach((placeholder) => {
      placeholder.innerHTML = paymentIconsEl.innerHTML;
    });
  }
}

function relatedProductCard(product) {
  return `
    <div class="flex flex-col gap-3" style="width:110px;">
      <a href="/products/${product?.handle}?variant=${
    product?.variants?.[0]?.id
  }">
        <img src="${product.featured_image}&amp;width=110" alt="${
    product.title
  }" srcset="${product.featured_image}&amp;width=110 110w" width="110">
      </a> 
      <a href="/products/${product?.handle}?variant=${
    product?.variants?.[0]?.id
  }" class="cart-text font-bold">${product.title}</a>
      <span class="cart-text"><span class="money">${formatMoneyTemplate(
        product.price
      )}</span></span>
      <button data-elem-type="cart-related-product-size-selector" class="text-[9px] uppercase bg-black text-white w-full border-black border-[1px] px-1 py-2">
        Select Size
      </button>
      <!-- Variant selector -->
      <select name="id" class="cart-text border border-black px-1 py-2 hidden">
          ${product.variants
            .filter(
              (variant) => variant.option1 === product.options[0].values[0]
            )
            .map((v) => `<option value="${v.id}">${v.title}</option>`)}
      </select>
      <button data-btn-type="related-prod-cart-add" class="text-[9px] uppercase bg-black text-white w-full border-black border-[1px] px-1 py-2 hidden">
        Add
      </button>
    </div>
  `;
}

function renderRelatedProducts() {
  const productRecommendationsSection = document.querySelector(
    ".cart-page-product-recommendations"
  );
  const anyProdCard = document.querySelector(".product--card");

  if (productRecommendationsSection) {
    const id =
      productRecommendationsSection.dataset.productId ||
      anyProdCard.dataset.prodId;

    fetch(
      window.Shopify.routes.root +
        `recommendations/products.json?product_id=${id}&limit=4&intent=related`
    )
      .then((response) => response.json())
      .then(({ products }) => {
        if (products.length > 0) {
          //console.log({ products });
          const firstRecommendedProduct = products[0];
          const innerHtml = products.map((product) =>
            relatedProductCard(product)
          );
          productRecommendationsSection.innerHTML = innerHtml.join("");

          relatedProdSelectSizeToggler();

          const btns = document.querySelectorAll(
            '[data-btn-type="related-prod-cart-add"]'
          );
          //console.log(btns);
          if (btns?.length) {
            btns?.forEach((btn) => {
              btn.addEventListener("click", function (event) {
                event.currentTarget.innerText = "Adding";
                updateCartContent(
                  event.currentTarget?.previousElementSibling?.value,
                  reloadCartContent
                );
              });
            });
          }
          // alert(
          //   `The title of the first recommended product is: ${firstRecommendedProduct.title}`
          // );
        }
      });
  }
}

function relatedProdSelectSizeToggler() {
  const sizeSelectorBtns = document.querySelectorAll(
    '[data-elem-type="cart-related-product-size-selector"]'
  );
  //console.log(sizeSelectorBtns);
  if (sizeSelectorBtns.length) {
    sizeSelectorBtns.forEach((btn) => {
      btn.addEventListener("click", function (event) {
        //console.log({ ct: event.currentTarget.nextElementSibling.children });
        const firstNextSibling = event.currentTarget.nextElementSibling;
        const secondNextSibling = firstNextSibling.nextElementSibling;
        event.currentTarget.classList.add("hidden");
        firstNextSibling.classList.remove("hidden");
        secondNextSibling.classList.remove("hidden");
        //console.log({
        //  t: event.currentTarget,
        //  firstNextSibling,
        // secondNextSibling,
        //});
      });
    });
  }
}

function formatMoneyTemplate(amount) {
  // Extract inner content using regex
  const match = window.ShopCurrency.match(/>(.*?)</);
  const content = match ? match[1] : "";

  // Replace {{amount}} with the actual value
  const formatted = content.replace("{{amount}}", (amount / 100).toFixed(2));

  return formatted;
}

function updateCartContent(variantId, cb) {
  let updates = {
    [variantId]: 1,
  };

  fetch(window.Shopify.routes.root + "cart/update.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updates }),
  })
    .then((response) => {
      const res = response.json();
      //console.log(res);
      cb();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function generateImageAltText(image, product) {
  const alt = image.alt;
  const productTitle = product.title;
  const vendor = product.vendor;
  // Split by comma and trim whitespace
  const altParts = alt.split(',').map(part => part.trim());
  
  // Extract type and color (default to empty strings if not found)
  const frontImageType = altParts[0] || '';
  const frontImageColor = altParts[1] || '';
  
  // Build the descriptive text
  let description = '';
  
  if (frontImageType) {
    // Capitalize first letter
    const type = frontImageType.charAt(0).toUpperCase() + frontImageType.slice(1);
    
    if (type.toLowerCase().includes('model')) {
      description = `${type} wearing`;
    } else {
      description = `${type} of`;
    }
  }
  
  // Build the complete alt text
  let altText = '';
  
  if (description) {
    altText += `${description} `;
  }
  
  if (productTitle) {
    altText += `the ${productTitle}`;
  }
  
  if (frontImageColor) {
    altText += ` in ${frontImageColor.toLowerCase()}`;
  }
  
  if (vendor) {
    altText += `, by brand ${vendor}`;
  }
  
  // Clean up any double spaces and trim
  return altText.replace(/\s+/g, ' ').trim();
}



window.formatMoneyTemplate = formatMoneyTemplate;

window.addEventListener("load", (event) => {
  getCountryAndSetShipping();
  retrievePaymentIcon();
  if (window.location.pathname.includes("cart")) {
    renderRelatedProducts();
  }
});

window.countryInfo = getCountryAndSetShipping;
