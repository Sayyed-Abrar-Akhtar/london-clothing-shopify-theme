function toggleHamburgerMenu() {
  const menu = document.querySelector(
    '[data-btn-role="toggle-hamburger-menu"]'
  );
  if (menu.checked) {
    menu.checked = false;
    document.body.style.overflow = "visible";
  } else {
    menu.checked = true;
    document.body.style.overflow = "hidden";
  }
}

function toggleSmenuList(selector = ".smenu-title") {
  const smenuTitle = Array.from(document.querySelectorAll(selector));

  function highlightSelectedList(list) {
    smenuTitle.forEach(function (sl) {
      sl.classList.remove("smenu--selected");
    });
    list.classList.toggle("smenu--selected");
  }

  if (smenuTitle && smenuTitle.length) {
    smenuTitle.forEach(function (list) {
      const isSubListSelected =Array.isArray(list?.nextElementSibling?.children) ? Array.from(
        list?.nextElementSibling?.children
      )?.reduce(function (acc, cur) {
        return acc || Array.from(cur?.classList)?.includes("smenu--selected");
      }, false):false;
      if (isSubListSelected) {
        highlightSelectedList(list);
      }

      list.addEventListener("click", function (e) {
        if (Array.from(e?.target?.classList)?.includes("smenu--selected")) {
          e?.target?.classList?.remove("smenu--selected");
          // e.target.nextElementSibling.style.display="none";
        } else {
          highlightSelectedList(list);
        }
      });
    });
  }
}

function isSublistSelected(mainList = ".smenu-title + .smenu-sublist") {
  const smenuTitles = Array.from(document.querySelectorAll(mainList));

  smenuTitles.forEach(function (item) {
    const isSelected = Array.from(item.children).some((child) =>
      child.firstElementChild.classList.contains("smenu--selected")
    );
    if (isSelected) {
      item.previousElementSibling.classList.add("smenu--selected");
    }
  });
}

// setTimeout(() => {
//   toggleSmenuList(".smenu-title");
//   toggleSmenuList(".snestedmenu-title");
//   isSublistSelected();
// }, 500);


// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    toggleSmenuList(".smenu-title");
    toggleSmenuList(".snestedmenu-title");
    isSublistSelected();
  }, 500);
});

// Make functions globally available
window.toggleHamburgerMenu = toggleHamburgerMenu;
window.toggleSmenuList = toggleSmenuList;
window.isSublistSelected = isSublistSelected;