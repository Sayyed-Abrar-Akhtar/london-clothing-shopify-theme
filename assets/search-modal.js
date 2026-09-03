function closeSearchModal() {
  const searchModal = document.querySelector(
    '[data-modal-name="search-modal"]'
  );

  // console.log({ searchModal });
  searchModal?.classList.add("search-modal--close");
  searchModal?.classList.remove("search-modal--open");
}

function openSearchModal() {
  setTimeout(() => {
    document.getElementById("searchModalInput").focus();
    // alert();
  }, 1);

  const searchModal = document.querySelector(
    '[data-modal-name="search-modal"]'
  );
  // console.log({ searchModal });
  searchModal?.classList.remove("search-modal--close");
  searchModal?.classList.add("search-modal--open");

  const searchModalContainer = document.getElementById("searchModalContainer");

  searchModalContainer.addEventListener(
    "click",
    function (e) {
     //console.log(e?.target?.dataset?.elementType)
      if (!e?.target?.dataset?.elementType) {
        closeSearchModal();
      }
    },
    true
  );
}

/*
function handleChangeSearchResult(event, isAsyncReq = true) {
  const searchResultContainer = document.querySelector(
    '[data-element-type="search-result-container"]'
  );
  console.log(event.key);

  // console.log({ searchResultContainer });

  if (event?.target?.value?.length > 2) {
    try {
      const xhr = new XMLHttpRequest();
      // console.log("UNSENT", xhr.readyState); // readyState will be 0

      xhr.open(
        "GET",
        `${location.origin}/search?q=${event.target.value}`,
        isAsyncReq
      ); // readyState will be 1

      xhr.onprogress = () => {
        // console.log("LOADING", xhr.readyState); // readyState will be 3
      };

      xhr.onload = (data) => {
        //console.log('data', data.target.responseText);
        const elem = document.createElement("div");
        elem.innerHTML = data.target.responseText;
        searchResultContainer.classList.remove("invisible");
        const productCards = Array.prototype.slice.call(
          elem.querySelectorAll(".product--card")
        );
        // console.log({ searchResultContainer, productCards });
        searchResultContainer.innerHTML = "";
        if (productCards.length > 0) {
          productCards.forEach((card) => {
            // console.log(card);
            searchResultContainer.insertAdjacentElement("beforeend", card);
          });
        } else {
          searchResultContainer.classList.remove("justify-start");
          searchResultContainer.classList.add("justify-center");
          searchResultContainer.insertAdjacentHTML(
            "beforeend",
            `<strong  class="text-3xl uppercase tracking-wider">Your search for "${event.target.value}" did not yield any results.</strong>`
          );
        }
      };

      xhr.send(null);
    } catch (error) {
      // remove skeleton when response after dom is loaded
      // console.info(error);
    }
  }
}

function handlePasteSearchResult(event, isAsyncReq = true) {
  const searchResultContainer = document.querySelector(
    '[data-element-type="search-result-container"]'
  );

  // console.log({ searchResultContainer });

  try {
    const xhr = new XMLHttpRequest();
    // console.log("UNSENT", xhr.readyState); // readyState will be 0

    xhr.open(
      "GET",
      `${location.origin}/search?q=${event.target.value}`,
      isAsyncReq
    ); // readyState will be 1

    xhr.onprogress = () => {
      // console.log("LOADING", xhr.readyState); // readyState will be 3
    };

    xhr.onload = (data) => {
      //console.log('data', data.target.responseText);
      const elem = document.createElement("div");
      elem.innerHTML = data.target.responseText;
      searchResultContainer.classList.remove("invisible");
      const productCards = Array.prototype.slice.call(
        elem.querySelectorAll(".product--card")
      );
      // console.log({ searchResultContainer, productCards });
      searchResultContainer.innerHTML = "";
      if (productCards.length > 0) {
        productCards.forEach((card) => {
          // console.log(card);
          searchResultContainer.insertAdjacentElement("beforeend", card);
        });
      } else {
        setTimeout(() => {
          searchResultContainer.classList.remove("justify-start");
          searchResultContainer.classList.add("justify-center");
          searchResultContainer.insertAdjacentHTML(
            "beforeend",
            `<strong  class="text-3xl uppercase tracking-wider">Your search for "${event.target.value}" did not yield any results.</strong>`
          );
        }, 50);
      }
    };

    xhr.send(null);
  } catch (error) {
    // remove skeleton when response after dom is loaded
    // console.info(error);
  }
}
*/
