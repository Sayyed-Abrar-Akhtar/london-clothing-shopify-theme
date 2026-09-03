let abortController = new AbortController();
let pageAbortController = new AbortController();
const saFilterCloseBtn = document.getElementById("saIconCloseBtn");
const saFilterWindow = document.querySelector(".sa-filter-window");
const saAppliedFilterBox = document.getElementById("saAppliedFilterContainer");
const saProductListContainer = document.querySelector(
  '[data-element="product-list-container"]'
);
let saCurrentPage = saProductListContainer?.dataset?.currentPage;
let saTotalPages = saProductListContainer?.dataset?.pages;
let collectionHandle = saProductListContainer?.dataset?.collectionHandle;
let saCurrentFilteredUrl = window.location.href;

//console.log(saCurrentPage, saTotalPages, collectionHandle);

saFilterCloseBtn?.addEventListener("click", function () {
  //slideFilterHide();
  saFilterShow(false);
});

function saFilterShow(display = false) {
  const saHeadingBox = document.querySelector(".sa-heading-box");
  const saFilterContainer = document.querySelector(".sa-filter-container");
  saFilterWindow.classList.toggle("hidden", !display);
  $(saHeadingBox).animate(
    display
      ? { right: "14px", visibility: "visible" }
      : { right: "-400px", visibility: "hidden" }
  );
  $(saFilterContainer).animate(
    display
      ? { right: "0", visibility: "visible" }
      : { right: "-400px", visibility: "hidden" }
  );
  document.body.style.overflowY = display ? "hidden" : "scroll";
}

saFilterWindow.addEventListener(
  "click",
  function (e) {
    const targetWindow = document.querySelector(".sa-filter-container");
    //console.log(event.target);
    //slideFilterHide();
    //saFilterShow(false);
    if (!targetWindow.contains(event.target)) {
      saFilterShow(false);
    }
  },
  true
);

function applyFilter(event, filters) {
  const currentParams = new URLSearchParams(window.location.search);
  filters.forEach(({ filter_type, filter_value }) => {
    if (filter_type === "filter.v.price.gte") {
      const gteLabel = document.getElementById("sa-filter-label-gte");
      currentParams.set(filter_type, event.target.value);
      gteLabel.innerHTML = `${Number(event.target.value).toFixed(2)}`;
    } else if (filter_type === "filter.v.price.lte") {
      const lteLabel = document.getElementById("sa-filter-label-lte");
      currentParams.set(filter_type, event.target.value || 0);
      lteLabel.innerHTML = `${Number(event.target.value).toFixed(2)}`;
    } else {
      if (currentParams.has(filter_type, filter_value)) {
        currentParams.delete(filter_type, filter_value);
      } else {
        currentParams.append(filter_type, filter_value);
      }
    }
  });

  const filteredUrl = `${window.location.origin}${
    window.location.pathname
  }?${currentParams.toString()}`;
  resetLoadMore(filteredUrl);
  loadFilteredProducts(filteredUrl);
}

function loadFilteredProducts(filteredUrl) {
  abortController.abort();
  const prevFilterBox = document.querySelector(".sa-filters-box");
  //window.location.href = filteredUrl;
  abortController = new AbortController();
  const signal = abortController.signal;
  try {
    // Use fetch to retrieve the HTML page
    loader(true);
    fetch(filteredUrl, {
      method: "GET", // Method type, default is GET
      headers: {
        "Content-Type": "text/html", // Specify the content type
        // You can add other headers here if needed
      },
      signal,
    })
      .then((response) => response.text()) // Get the HTML content as text
      .then((html) => {
        const productsContainer = document.querySelector(
          '[data-element="product-list-container"]'
        );
        // Parse the HTML content into a DOM structure
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        // Query for all product cards

        const productCards = doc.querySelectorAll(
          ".collection-products-list > .product--card"
        );
        //console.log(productCards);
        const newFilterBox = doc.querySelector(".sa-filters-box");
        const newAppliedFilterEl = doc.getElementById(
          "saAppliedFilterContainer"
        );
        prevFilterBox.innerHTML = newFilterBox.innerHTML;
        saAppliedFilterBox.innerHTML = newAppliedFilterEl.innerHTML;

        // find products container and replace products

        // Alternative
        //productsContainer.innerHTML = "";
        //Array.from(productCards).forEach((product) => {
        //  productsContainer.insertAdjacentElement("beforeend", product);
        //});

        productsContainer.replaceChildren(...productCards);

        const saFilteredProductsContainer = doc.querySelector(
          '[data-element="product-list-container"]'
        );

        saCurrentPage = saFilteredProductsContainer?.dataset?.currentPage;
        saTotalPages = saFilteredProductsContainer?.dataset?.pages;
        history.pushState({}, "", filteredUrl);
        if (Number(saCurrentPage) < Number(saTotalPages)) {
          //console.log({ fn: "loadmore", saCurrentPage, saTotalPages });
          saCurrentPage = `${Number(saCurrentPage) + 1}`;
          document.addEventListener("scroll", saHandleScroll);
        } else {
          //console.log({ fn: "loadmore", saCurrentPage, saTotalPages });
          document.removeEventListener("scroll", saHandleScroll);
        }
        loader(false);
      })
      .catch((error) => {
        loader(false);
        console.error("Error fetching or parsing HTML:", error);
      });
  } catch (error) {
    loader(false);
    console.error("Error loading products:", error);
  }
}

function removeFilter(filteredUrl) {
  resetLoadMore(filteredUrl);
  loadFilteredProducts(filteredUrl);
}

function clearFilter(filteredUrl) {
  resetLoadMore(filteredUrl);
  loadFilteredProducts(filteredUrl);
}

window.addEventListener("popstate", function (event) {
  window.location.reload(); // Dynamically load page content
});

function loader(isLoading) {
  const loaderEl = document.querySelector(".sa-filter-loader");
  const loaderBgEl = document.querySelector(".sa-filter-loading--bg");
  if (isLoading) {
    loaderEl.classList.remove("hidden");
    loaderBgEl.classList.remove("hidden");
  }
  if (!isLoading) {
    loaderEl.classList.add("hidden");
    loaderBgEl.classList.add("hidden");
  }
}

function saHandleScroll() {
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight =
    document.body.offsetHeight > 1000
      ? document.body.offsetHeight - 1000
      : document.body.offsetHeight;
  if (scrollPosition < documentHeight) {
    //console.log('scrolling')
    return;
  }
  const loaderEl = document.getElementById(
    `${collectionHandle}moreProductsLoader`
  );
  loaderEl.classList.remove("hidden");

  //displayMoreProducts(loaderEl);
  //console.log({ saCurrentFilteredUrl });
  const url = new URL(saCurrentFilteredUrl);
  const params = new URLSearchParams(url.search);
  params.set("page", `${Number(saCurrentPage) + 1}`);
  const newPageUrl = `${url.origin}${url.pathname}?${params.toString()}`;

  document.removeEventListener("scroll", saHandleScroll);
  pageAbortController.abort();
  pageAbortController = new AbortController();
  const signal = abortController.signal;
  fetch(newPageUrl, {
    method: "GET", // Method type, default is GET
    headers: {
      "Content-Type": "text/html", // Specify the content type
      // You can add other headers here if needed
    },
    signal,
  })
    .then((response) => response.text()) // Get the HTML content as text
    .then((html) => {
      // Parse the HTML content into a DOM structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const prodCards = doc.querySelectorAll(
        ".collection-products-list > .product--card"
      );
      const productsContainer = document.querySelector(
        '[data-element="product-list-container"]'
      );
      Array.from(prodCards).forEach((product) =>
        productsContainer.insertAdjacentElement("beforeend", product)
      );
      //console.log(Array.from(prodCards).map((p) => p));
      if (Number(saCurrentPage) < Number(saTotalPages)) {
        //console.log({ fn: "handleScroll", saCurrentPage, saTotalPages });

        saCurrentPage = `${Number(saCurrentPage) + 1}`;
        document.addEventListener("scroll", saHandleScroll);
      }
      loaderEl.classList.add("hidden");
    })
    .catch((e) => {
      console.error(e);
    });
}

// Add event listener on scroll only if there are more than 1 Pages.
if (Number(saTotalPages) > 1 && Number(saCurrentPage) < Number(saTotalPages)) {
  document.addEventListener("scroll", saHandleScroll);
}

function resetLoadMore(filteredUrl) {
  saCurrentPage = "1";
  saCurrentFilteredUrl = filteredUrl.includes(window.location.origin)
    ? filteredUrl
    : `${window.location.origin}${filteredUrl}`;
}

/*
function slideFilterHide() {
  const saHeadingBox = document.querySelector(".sa-heading-box");
  const saFilterContainer = document.querySelector(".sa-filter-container");
  saFilterWindow.classList.add("hidden");
  $(saHeadingBox).animate({ right: "-400px", visibility: "hidden" });
  $(saFilterContainer).animate({ right: "-400px", visibility: "hidden" });
  document.body.style.overflowY = "scroll";
}

function slideFilterShow() {
  const saFilterContainer = document.querySelector(".sa-filter-container");
  const saHeadingBox = document.querySelector(".sa-heading-box");
  saFilterWindow.classList.remove("hidden");
  $(saHeadingBox).animate({ right: "0", visibility: "visible" });
  $(saFilterContainer).animate({ right: "0", visibility: "visible" });
  document.body.style.overflow = "hidden";
}
*/
