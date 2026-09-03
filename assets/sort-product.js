const sortoptions = document.getElementById("collectionSort");
sortoptions.addEventListener("change", function (o) {
  const t = new URL(window.location);
  e = new URLSearchParams(t.search);
  e.set("sort_by", o.target.value);
  t.search = e.toString();
  window.location.search = t.search;
});
