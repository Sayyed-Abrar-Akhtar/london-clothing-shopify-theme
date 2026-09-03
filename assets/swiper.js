function productSwiper(sectionID) {
  if (window.innerWidth < 1000) {
    let start = 0,
      end = 0;

    const brandContainerNode = `swiper-container-${sectionID}`;
    const brandContainerClass = `swiper-container-${sectionID}`;

    const brandContainer = document.getElementById(brandContainerNode);

    brandContainer.addEventListener(
      "touchstart",
      (e) => {
        console.log("touch started")
        start = e.changedTouches[0].clientX;
      },
      { passive: true }
    );

    brandContainer.addEventListener(
      "touchend",
      (e) => {
        end = e.changedTouches[0].clientX;

        console.log({ start, end });
        if (start > end && start - end > 20) {
          swipeRTL();
        } else if (start < end && end - start > 20) {
          swipeLTR();
        }
      },
      { passive: true }
    );
    // brandContainer.addEventListener('dragover', (e) => {
    //   e.dataTransfer.dropEffect = 'move';
    //   e.preventDefault();
    // });
    // brandContainer.addEventListener('dragstart', (e) => {
    //   start = e.clientX;
    // });
    // brandContainer.addEventListener('dragend', (e) => {
    //   end = e.clientX;
    //   if (start > end && start - end > 15) {
    //     console.log('swipe ltr invoked', { start, end });
    //     swipeRTL();
    //   } else if (start < end && end - start > 15) {
    //     console.log('swipe rtl invoked', { start, end });
    //     swipeLTR();
    //   }
    //   e.preventDefault();
    // });

    function swipeRTL() {
      //console.log("swipping r to l <-");
      // select first child
      let brandNodeSelector = `.${brandContainerClass} > .product:first-child`;

      const brandChild = document.querySelector(brandNodeSelector);

      const brandChilds = document.querySelectorAll(
        `.${brandContainerClass}>.product`
      );
      brandChilds.forEach((el, idx) =>
        el.animate(
          [
            {
              // from
              transform: "translateX(0)",
              opacity: 1,
            },
            {
              // to
              transform: "translateX(-80%)",
              visbility: "hidden",
              offset: 0.8,
            },
            {
              // to
              transform: "translateX(-100%)",
              visbility: "hidden",
            },
          ],
          500
        )
      );
      setTimeout(() => {
        // add selected child to end
        brandContainer.appendChild(brandChild);
      }, 500);
    }

    function swipeLTR() {
      //console.log("swipping l to r =>");
      // select last child
      let brandNodeSelector = `.${brandContainerClass}>.product:last-child`;
      const brandChild = document.querySelector(brandNodeSelector);

      //setTimeout(()=> {
      // add selected child to end
      brandContainer.insertAdjacentElement("afterbegin", brandChild);
      //}, 500)

      const brandChilds = document.querySelectorAll(
        `.${brandContainerClass}>.product`
      );
      brandChilds.forEach((el, idx) =>
        el.animate(
          [
            {
              // from
              transform: "translateX(-20%)",
            },
            {
              // from
              transform: "translateX(5%)",
              offset: 0.8,
            },
            {
              // to
              transform: "translateX(0)",
            },
          ],
          500
        )
      );
    }
  }
}

function indexCalculator() {
  const imgs = document.querySelectorAll(".images-box section");
  const imgsLen = imgs.length;
  const img = document.querySelector(`.images-box section[data-index="1"]`);
  let scrollThreshold = [];
  if (img) {
    const imgHeight = img.getBoundingClientRect().height;
    for (let index = 1; index < imgsLen + 5; index++) {
      scrollThreshold.push(Math.floor((imgHeight * index * 98) / 100));
    }
  }
  return scrollThreshold;
}

function scrollImage() {
  const scrollContainer = document.querySelector(".images-box");
  const scrollThreshold = indexCalculator();
  const imageVisible = scrollThreshold?.map((item) =>
    Math.floor((item * 50) / 100)
  );
  let currentIndex = 1;
  scrollContainer?.addEventListener("scroll", function (event) {
    scrollThreshold?.forEach(function (threshold, index) {
      //console.log({ scrollBy: event.target.scrollTop, threshold, index });
      if (
        event.target.scrollTop > threshold &&
        event.target.scrollTop < scrollThreshold[index + 1]
      ) {
        changeThumbnailActiveStatus(index + 2);
      }
      if (event.target.scrollTop < scrollThreshold[0]) {
        changeThumbnailActiveStatus(1);
      }
    });
  });
}

function changeThumbnailActiveStatus(index) {
  const thumbnails = document.querySelectorAll(".image-thumbnail");
  thumbnails.forEach((thumbnail) =>
    thumbnail.classList.remove("image--active")
  );
  const activeThumbnailEl = document.querySelector(
    `.image-thumbnail[data-index="${index}"]`
  );
  activeThumbnailEl?.classList?.add("image--active");
}

function scrollToImg(event) {
  const imgContainer = document.querySelector(".images-box");
  const index = event.target.parentElement.dataset.index;
  const img = document.querySelector(`.images-box section[data-index="1"]`);

  const options = {
    top:
      parseInt(index) === 1
        ? 0
        : (parseInt(index) - 1) * img.getBoundingClientRect().height +
          Math.abs(parseInt(index) * 10),
    left: 0,
    behavior: "smooth",
  };
  //console.log({ options, index, img });
  setImageBoxHeight();
  imgContainer.scrollTo(options);
  changeThumbnailActiveStatus(index);
}

function setImageBoxHeight() {
  const imgContainer = document.querySelector(".images-box");
  const img = document.querySelector(`.images-box section[data-index="2"]`);
  if (img) {
    const imgHeight = img.getBoundingClientRect().height;
    imgContainer.style.height = imgHeight ? `${imgHeight}px`: '100%';
    const video = document.querySelector(".product_video");
    if (video) {
      video.style.height = `${imgHeight}px`;
    }
  }
}
function magnifyImage() {}

function showImages() {
  const imgs = document.querySelectorAll(".images-box section");
  imgs?.forEach((img, idx) => {
    img?.classList?.remove("invisible");
    img?.addEventListener("click", function (event) {
      revealZoomOverlay(idx + 1);
    });
  });
}

function revealZoomOverlay(index) {
  const overlay = document.querySelector(".zoom-image-overlay");
  const target = document.querySelector(`.zoomed-image-${index}`);
  if (overlay && target) {
    const offsetTop = target.offsetTop;
    overlay.scrollTo({
      top: offsetTop + 22 * (index - 1), // scroll to top of image minus gap
      behavior: "instant",
    });
  }
  window.scroll({
    top: 0,
    left: 0,
    behavior: "instant",
  });
  overlay.classList.add("reveal");
  document.body.style.overflow = "hidden";
}
function hideZoomOverlay() {
  const overlay = document.querySelector(".zoom-image-overlay");
  overlay.classList.remove("reveal");
  document.body.style.overflow = "";
}
window.addEventListener("DOMContentLoaded", function () {
  showImages();
  setImageBoxHeight();
  scrollImage();
});
document
  .querySelector(".zoom-image-close")
  ?.addEventListener("click", hideZoomOverlay);

function addElHeight() {
  const productImgBox = document.querySelector(".images-box");
}