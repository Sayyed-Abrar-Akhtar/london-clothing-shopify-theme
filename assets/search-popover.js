function hideSearch(
  searchContainerID = "hamburgerMenuContainer",
  boxType = "hamburger",
  formInputID = "search-input-hamburger-menu"
) {
  if (searchContainerID === "") {
    document?.body?.addEventListener(
      "click",
      (e) => {
        if (e?.target?.id !== formInputID) {
          const openedSearchContainer = document.getElementById(
            `${boxType}SearchContainer`
          );
          if (openedSearchContainer) {
            openedSearchContainer.remove();
          }
        }
      },
      true
    );
    return;
  }
  const searchContainer = document.getElementById(searchContainerID);
  searchContainer?.addEventListener(
    "click",
    (e) => {
      if (e?.target?.id !== formInputID) {
        const openedSearchContainer = document.getElementById(
          `${boxType}SearchContainer`
        );
        if (openedSearchContainer) {
          openedSearchContainer.remove();
        }
      }
    },
    true
  );
}

/*function hideSearchResultBox(e) {
  if (e?.target?.id !== "search-input-hamburger-menu") {
    const openedSearchContainer = document.getElementById(
      "hamburgerSearchContainer"
    );
    if (openedSearchContainer) {
      openedSearchContainer.remove();
    }
  }
}*/
//const hamburgerBox = document.getElementById("hamburgerMenuContainer");
//hamburgerBox.addEventListener("click", (e) => hideSearchResultBox(e), true);

function renderSearchPopover(ID, type) {
  const searchedInput = document.getElementById(ID);
  searchedInput?.addEventListener("keyup", (e) => renderSearchBox(e, type));
  searchedInput?.addEventListener("click", (e) => {
    const el = document.getElementById(`${type}SearchContainer`);
    if (!el) {
      renderSearchBox(e, type);
    }
  });
}

renderSearchPopover("search-input-hamburger-menu", "hamburger");
renderSearchPopover("searchModalInput", "header");
renderSearchPopover("mainSearchInput", "mainSearchPage");

hideSearch(
  "hamburgerMenuContainer",
  "hamburger",
  "search-input-hamburger-menu"
);

hideSearch("searchModalContainer", "header", "searchFormContainer");
hideSearch("", "mainSearchPage", "mainSearchFormContainer");

// 1. On keydown look on localstorage for the search result and render search popover with data from localstorage.
// 2. If no record found start ajax call to fetch searched results.
// 3. Extract data from response and save to local storage

function renderSearchBox(e, boxType) {
  renderLoader();
  let boxID = "";

  //0. Check box type to generate renderSearchBoxId
  switch (boxType) {
    case "hamburger":
      boxID = "hamburgerSearchContainer";
      break;
    case "header":
      boxID = "headerSearchContainer";
      break;
    case "mainSearchPage":
      boxID = "mainSearchPageSearchContainer";
      break;
    default:
      boxID = "searchContainer";
      break;
  }

  //1. if already rendered and has no value hide else do not render
  const isSearchBoxRendered = document.getElementById(boxID);

  if (isSearchBoxRendered) {
    if (!e?.target?.value?.trim()?.length) {
      isSearchBoxRendered.remove();
      //console.log("search box removed");
      return;
    } else {
      //console.log("search box already rendered");

      ajaxRequest((allSuggestions) => {
        console.log(allSuggestions)
        const replaceableContainer = document.querySelector(`#${boxID} > div`);
        if (replaceableContainer) {
          replaceableContainer.innerHTML = renderSearchData(
            allSuggestions,
            e,
            boxID
          );
        }
      }, e);
      /*fetch(
        `${
          window.Shopify.routes.root
        }search/suggest.json?q=${e.target.value.trim()}}`
      )
        .then((response) => response.json())
        .then((suggestions) => {
          const allSuggestions = suggestions.resources.results;

          const replaceableContainer = document.querySelector(
            `#${boxID} > div`
          );
          replaceableContainer.innerHTML = renderSearchData(allSuggestions, e);
        });*/
      return;
    }
  }

  //2. if search query is empty return
  if (!e?.target?.value?.trim()?.length) return;

  //3. render on click event
  const element = `
        <div id="${boxID}" class="absolute" style="z-index:1006;${
    boxType === "header"
      ? "top:4.5rem;"
      : boxType === "mainSearchPage"
      ? "top:4rem;"
      : "top:2.5rem;"
  }box-shadow: 0 0 0 1px #272c300d,0 1px 5px 1px #272c3029;">
          <div
            id="${boxID}Element"
            class="rounded search-popup-modal-box"
            style="
              min-height: 70px;
              inset:0;
              font-size:11px;
              letter-spacing:0.5px;
              text-transform:uppercase;
              background:white;
            ">
          </div>
          <span class="loading-spinner">&nbsp;</span>
        </div>
      `;
  e?.target?.insertAdjacentHTML("afterend", element);
  //console.log("search box rendered success");

  //4. Fetch search data if get results render search data else render not found msg
  ajaxRequest((allSuggestions) => {
    document
      .querySelector(`#${boxID} > div`)
      .insertAdjacentHTML(
        "afterbegin",
        renderSearchData(allSuggestions, e, boxID)
      );
  }, e);
  /*fetch(
    `${
      window.Shopify.routes.root
    }search/suggest.json?q=${e.target.value.trim()}}&resources[type]=product,page,collection&resources[options][unavailable_products]=hide&resources[limit]=6&resources[limit_scope]=each`
  )
    .then((response) => response.json())
    .then((suggestions) => {
      const allSuggestions = suggestions.resources.results;

      console.log(allSuggestions);

      document
        .querySelector(`#${boxID} > div`)
        .insertAdjacentHTML("afterbegin", renderSearchData(allSuggestions, e));
    });*/
}

function renderSearchData(data, e, boxID) {
  //console.log({ data });
  // Example using fetch to make AJAX request

  fetch(`${window.location.origin}/search/?q=${e?.target?.value}`)
    .then((response) => response.text()) // Convert response to text
    .then((html) => {
      // Parse the HTML string into a DOM structure
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");

      // Example: Find an element by id
      var elementById = doc.getElementById("mainSearchResultCountValue");
      const searchCountEl = document.querySelector(
        '[data-type="searched-products-count"]'
      );

      // console.log(searchCountEl);
      if (searchCountEl && Number(elementById.dataset.searchResultCount) > 6) {
        searchCountEl.innerText = elementById.dataset.searchResultCount;
        searchCountEl.classList.remove("hidden");
      }

      /*const productsDetails = Array.prototype.slice
        .call(doc.querySelectorAll(".product--card"))
        .slice(0, 6)
        .map((el) => ({ ...el?.dataset }));
      if (!productsDetails.length) {
        renderErrorEl(boxID, e);
      }

      // Use the elements found
      if (productsDetails?.length) {
        const prodContainer = document.querySelector(".product-details-list");
        const productsList = productsDetails?.map( 
          (item) => `<li class="rounded">
                      <a href="" class="search-product-card rounded">
                        <div class="image-box rounded overflow-hidden">
                          <img
                            src="${item?.prodImg}"
                            alt="${item?.prodTitle}"
                            height="102"
                            width="72"
                          >
                        </div>
                        <div class="details-box">
                          <strong>${item?.prodTitle}</strong>
                          <p>${item?.prodColor}</p>
                          <h4>${item?.prodPrice}</h4>
                        </div>
                      </a>
                    </li>`
        );
        if (productsList) {
          prodContainer.innerHTML = productsList.join().replaceAll(",", "");
        }

        
      }*/
    })
    .catch((error) => {
      renderErrorEl(boxID, e);
    });
  removeLoader();
  if (!data.products.length) {
    return `<div class="relative rounded"><span class="absolute syd-icon--top"></span><p class="no-search-result">Sorry, nothing found for "<strong>${e.target.value}</strong>".</p></div>`;
  }
  return `
  <div class="relative rounded" style="background:#f8f8f8;">
    <span class="absolute syd-icon--top"></span>
    <div id="hiddenProductContainer" class="flex rounded">
      ${
        data?.collections?.length || data?.pages?.length
          ? `<div class="other-searched-container" style="width:224px;">
      ${
        data?.collections?.length
          ? `<div class="collection-detail-box">
          <h2 class="search-popover-headings">Collections</h2>
          <ul class="collection-details-list">
          ${data?.collections
            ?.slice(0, 3)
            ?.map(
              (coll) =>
                `<a href="${coll?.url}"><li class="rounded">${coll?.title}</li></a>`
            )
            .join()
            .replaceAll(",", "")}
            
          </ul>
        </div>`
          : ""
      }
       ${
         data?.pages?.length
           ? `<div class="pages-detail-box">
          <h2 class="search-popover-headings">Pages</h2>
          <ul class="pages-details-list">
          ${data?.pages
            ?.slice(0, 3)
            ?.map(
              (page) =>
                `<li class="rounded"><a href="${page?.url}">${page?.title}</a></li>`
            )
            .join()
            .replaceAll(",", "")}
            
          </ul>
        </div>`
           : ""
       }
       
      </div>`
          : ""
      }
      ${
        data?.products?.length
          ? `<div class="products-searched-container" style="background:white;">
        <div class="w-full">
          <div class="product-details-box">
            <h2 class="search-popover-headings">Products</h2>
            <ul class="product-details-list" style="${
              boxID === "mainSearchPageSearchContainer"
                ? "max-height:255px; overflow-y:scroll;"
                : ""
            }">
               ${data?.products
                 ?.map(
                   (prod) => `<li class="rounded">
                      <a href="${window.location.origin}/products/${
                     prod.handle
                   }" class="search-product-card rounded">
                        <div class="image-box rounded overflow-hidden">
                          <img
                            src="${prod?.featured_image?.url}"
                            alt="${prod?.title}"
                            height="102"
                            width="72"
                          >
                        </div>
                        <div class="details-box">
                          <strong>${prod?.title}</strong>
                          <p>${prod?.featured_image?.alt.split(',')[1]}</p>
                          <h4 class="flex gap-2" style="color: ${
                            prod?.compare_at_price_max > prod?.price
                              ? "#f30"
                              : "black"
                          }">${window.ShopCurrency.replace(
                     "{{amount}}",
                     prod?.price
                   )} ${
                     prod?.compare_at_price_max > prod?.price
                       ? `<s style="color:#2229;">${window.ShopCurrency.replace(
                           "{{amount}}",
                           prod?.compare_at_price_max
                         )}</s>`
                       : ""
                   }</h4>
                        </div>
                      </a>
                    </li>`
                 )
                 ?.join()
                 ?.replaceAll(",", "")}
            </ul>
            
          </div>
        </div>

        <a href="${window.Shopify.routes.root}search/?q=${
              e?.target?.value
            }" class="all-searched-products">
          <p>View all&nbsp;<span data-type="searched-products-count" class="hidden">${
            data?.products?.length
          }</span>&nbsp;products</p>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1657 7.43443L10.1657 3.43443C9.8529 3.12163 9.3473 3.12163 9.0345 3.43443C8.7217 3.74723 8.7217 4.25283 9.0345 4.56563L11.6689 7.20003H2.4001C1.9577 7.20003 1.6001 7.55843 1.6001 8.00003C1.6001 8.44163 1.9577 8.80003 2.4001 8.80003H11.6689L9.0345 11.4344C8.7217 11.7472 8.7217 12.2528 9.0345 12.5656C9.1905 12.7216 9.3953 12.8 9.6001 12.8C9.8049 12.8 10.0097 12.7216 10.1657 12.5656L14.1657 8.56563C14.4785 8.25283 14.4785 7.74723 14.1657 7.43443" fill="#5C5F62"></path>
          </svg>
        </a>
      </div>
      `
          : ""
      }
    </div>
  </div>
  `;
}

function ajaxRequest(cb, e) {
  fetch(
    `${
      window.Shopify.routes.root
    }search/suggest.json?q=${e.target.value.trim()}}&sort_by=price-descending&resources[type]=product,page,collection&resources[options][unavailable_products]=hide&resources[limit]=6&resources[limit_scope]=each`
  )
    .then((response) => response.json())
    .then((suggestions) => {
      const allSuggestions = suggestions.resources.results;
      
      
      let filteredSearchRes = {};

      fetch(`${window.Shopify.routes.root}search?q=${e.target.value.trim()}`)
        .then((response) => response.text())
        .then((html) => {
          // Create a DOM parser to extract elements
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Find all product elements
          if (doc) {
            const productElements = doc.querySelectorAll(
              '[data-type="product-searched-results-newin"]'
            );
            const productElementsOld = doc.querySelectorAll(
              '[data-type="product-searched-results-sale"]'
            );
            const newProducts = Array.from(productElements)
              .map((p) => JSON.parse(p.dataset.result))
              .filter((a) => Number(a.price) > Number(a.compare_at_price_max));
            const saleProducts = Array.from(productElements)
              .map((p) => JSON.parse(p.dataset.result))
              .filter((a) => Number(a.price) <= Number(a.compare_at_price_max));
            const oldProducts = Array.from(productElements).map((p) =>
              JSON.parse(p.dataset.result)
            );
            const newProductsAllSuggestion = allSuggestions.products.filter(
              (a) => Number(a.price) > Number(a.compare_at_price_max)
            );

            const saleProductsAllSuggestion = allSuggestions.products.filter(
              (a) => Number(a.price) <= Number(a.compare_at_price_max)
            );

            //console.log({ newProducts, saleProducts, oldProducts });
            filteredSearchRes = {
              ...allSuggestions,
              products: [
                ...newProducts,
                ...saleProducts,
                ...oldProducts,
                ...newProductsAllSuggestion,
                ...saleProductsAllSuggestion,
              ].slice(0, 6).filter((item, index, self) => index === self.findIndex((t) => t.title === item.title)),
            };
            cb(filteredSearchRes);
          }
        });
    });
}

function renderErrorEl(boxID, e) {
  const boxElement = document.getElementById(`${boxID}Element`);
  if (boxElement) {
    boxElement.innerHTML = `<div class="relative rounded"><span class="absolute syd-icon--top"></span><p class="no-search-result">Sorry, nothing found for "<strong>${e.target.value}</strong>".</p></div>`;
  }
}
function renderLoader() {
  const loaderElement = document.querySelector(`.loading-spinner`);
  if (loaderElement) {
    loaderElement.classList.remove("hidden");
  }
}
function removeLoader() {
  const loaderElement = document.querySelector(`.loading-spinner`);
  if (loaderElement) {
    loaderElement.classList.add("hidden");
  }
}
/*function showSearchResultBox(e) {
  if (!e.target.value.length) return;
  const lsData = localStorage.getItem(e.target.value);
  if (lsData) {
    render(lsData);
  } else {
    fetch(
      `${
        window.Shopify.routes.root
      }search/suggest.json?q=${e.target.value.trim()}}`
    )
      .then((response) => response.json())
      .then((suggestions) => {
        const allSuggestions = suggestions.resources.results;

        console.log(allSuggestions);
        e.target.insertAdjacentHTML("afterend", render(allSuggestions));
      });
  }
}*/



