function showVariantSizes(event, element) {
  event.preventDefault();
  event.stopPropagation();
  //console.log({ event, element });
  let siblingDiv = element.nextElementSibling; // Get the next <div> (sibling)
  if (siblingDiv) {
    if (element.dataset.sizes === "close") {
      element.style.transform = "rotate(-45deg)";
      //siblingDiv.style.opacity = 1;
      //siblingDiv.style.visibility = "block";
      siblingDiv.classList.remove("variant--hidden");
      element.dataset.sizes = "open";
    } else {
      element.style.transform = "rotate(0)";
      //siblingDiv.style.opacity = 0;
      //siblingDiv.style.display = "none";
      siblingDiv.classList.add("variant--hidden");
      element.dataset.sizes = "close";
    }
  }
}

function addVariantToCart(event, element) {
  event.preventDefault();
  let addToCartForm = element.parentElement;
  let formData = new FormData(addToCartForm);
  addItemToCart(formData, "cart_drawer_container", "cart_drawer");
}

function createQuickViewElement(imgsArr, tempimg, tempimgNext, title, sizeArr) {
 // console.log({ imgsArr, tempimg, tempimgNext, title, sizeArr });
  return `
      <div class="quick-view-container sm:hidden md:flex" id="quickViewContainer">
        <div class="quick-view">
          <div class="action-btn cursor-pointer" id="quickViewCloseBtn" onclick="closeQuickView(this)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              class="icon icon-close w-5 h-5"
              fill="none"
              viewBox="0 0 18 17"
            >
              <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor">
            </svg>
          </div>
          <div class="quick-view-content">
            <div class="image-content">
              <div class="thumbnails">
                ${
                  imgsArr.length == 1 && imgsArr[0] == ""
                    ? `<div class="thumbnail-holder"><img src="${
                        "" || tempimg
                      }" class="thumbnail" onclick="toggleMainImage(this)" alt="${title}" /></div>
                  <div class="thumbnail-holder"><img src="${
                    "" || tempimgNext
                  }" class="thumbnail" onclick="toggleMainImage(this)" alt="${title}" /></div>`
                    : imgsArr
                        .map((i, idx) => {
                          if (idx != imgsArr.length - 1) {
                            return `<div class="thumbnail-holder"><img src="${i}" class="thumbnail" onclick="toggleMainImage(this)" alt="${title}-${idx}" /></div>`;
                          }
                        })
                        .join("")
                }
                
              </div>
              <div class="full-image-box">
                <img
                      src="${
                        imgsArr.length == 1 && imgsArr[0] == ""
                          ? tempimg
                          : imgsArr[0]
                      }"
                      alt="${title}"
                      class="full-image"
                      id="quickViewFullImg"
                      />
              </div>
            </div>
            <div class="prod-info"> 
              <h3 class="h3 collection-grid-item__title qv-title">
                <strong>${title}</strong>
              </h3>
              <h4 class="h4 collection-grid-item__title qv-price font-semibold">
                
              </h4>
              <form class="quick-view-form" action="/cart/add" method="post" enctype="multipart/form-data"> 
                <span class="quick-view-lbl">Size:</span>
                <ul class="qv-size-list-box">
                  ${sizeArr
                    .map((size) => {
                      if (!size.classList.contains("no-stock")) {
                        return `<li data-size="${
                          size.dataset.variantid
                        }" class="qv-size-list ${
                          size.classList.contains("no-stock")
                            ? "size-sold"
                            : "sizes-available"
                        }" onclick="selectSizeHandler(this)" >${
                          size.innerText
                        }</li>`;
                      } else {
                        return `<li class="qv-size-list ${
                          size.classList.contains("no-stock")
                            ? "size-sold"
                            : "sizes-available"
                        }" onclick="selectSizeHandler(this)" >${
                          size.innerText
                        }</li>`;
                      }
                    })
                    .join("")}
                </ul>
                <div class="form-inputs">
                  <input type="hidden" name="id" value="" id="sizeVariantQty" />
                  
                  <input type="submit" value="Add to cart" class="btn" id="qvAddToCart" />
                </div>
              </form>
              <span class="quick-view-lbl lbl-desc">Description:</span>
              <div class="qv-description"></div>
            </div>
          </div>
        </div>
      </div>
    `;
}
