class ProductsPage {
constructor() {
this.products = [];
this.filteredProducts = [];
this.currentPage = 1;
this.productsPerPage = 12;
this.isGridView = true;
this.filters = {
category: "",
priceRange: "",
sort: "name",
search: "",
};
}
async init() {
try {
this.applyFilters();
} catch (error) {
this.showError("Failed to load products. Please try again later.");
}
}
async loadProducts() {
this.loadProductsFromDOM();
}
loadProductsFromDOM() {
const productCards = document.querySelectorAll(".product-card");
this.products = Array.from(productCards).map((card) => {
return {
id: card.dataset.productId || "",
name: card.querySelector("h3")?.textContent || "",
category: card.dataset.category || "",
price: card.querySelector(".price")?.textContent || "",
};
});
this.filteredProducts = [...this.products];
}
setupEventListeners() {
const nameSearch = document.getElementById("name-search");
if (nameSearch) {
nameSearch.addEventListener("input", (e) => {
this.filters.search = e.target.value.trim();
this.applyFilters();
});
nameSearch.addEventListener("keyup", (e) => {
if (e.key === "Escape") {
nameSearch.value = "";
this.filters.search = "";
this.applyFilters();
}
});
}
document
.getElementById("category-filter")
.addEventListener("change", (e) => {
this.filters.category = e.target.value;
this.applyFilters();
});
document.getElementById("price-filter").addEventListener("change", (e) => {
this.filters.priceRange = e.target.value;
this.applyFilters();
});
document.getElementById("sort-filter").addEventListener("change", (e) => {
this.filters.sort = e.target.value;
this.applyFilters();
});
document.getElementById("clear-filters").addEventListener("click", () => {
this.clearAllFilters();
});
document.getElementById("grid-view").addEventListener("click", () => {
this.setGridView(true);
});
document.getElementById("list-view").addEventListener("click", () => {
this.setGridView(false);
});
const loadMoreBtn = document.getElementById("load-more");
if (loadMoreBtn) {
loadMoreBtn.addEventListener("click", () => {
this.loadMoreProducts();
});
}
const globalSearch = document.getElementById("global-search");
if (globalSearch) {
globalSearch.addEventListener("input", (e) => {
this.filters.search = e.target.value.trim();
this.applyFilters();
});
}
}
setupURLParams() {
const urlParams = new URLSearchParams(window.location.search);
const searchParam = urlParams.get("search");
if (searchParam) {
this.filters.search = searchParam;
const globalSearch = document.getElementById("global-search");
if (globalSearch) {
globalSearch.value = searchParam;
}
}
const categoryParam = urlParams.get("category");
if (categoryParam) {
this.filters.category = categoryParam;
document.getElementById("category-filter").value = categoryParam;
}
}
applyFilters() {
this.filteredProducts = [...this.products];
if (this.filters.category) {
this.filteredProducts = this.filteredProducts.filter(
(product) => product.category === this.filters.category
);
}
if (this.filters.priceRange) {
this.filteredProducts = this.filteredProducts.filter((product) => {
const price = this.extractPrice(product.price || product.mrp);
return this.isPriceInRange(price, this.filters.priceRange);
});
}
if (this.filters.search) {
const searchTerm = this.filters.search.toLowerCase();
this.filteredProducts = this.filteredProducts.filter(
(product) =>
product.name.toLowerCase().includes(searchTerm) ||
product.description.toLowerCase().includes(searchTerm) ||
(product.category &&
product.category.toLowerCase().includes(searchTerm))
);
}
this.applySorting();
this.currentPage = 1;
this.renderProducts();
this.updateProductsCount();
}
applySorting() {
switch (this.filters.sort) {
case "name":
this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
break;
case "price-low":
this.filteredProducts.sort((a, b) => {
const priceA = this.extractPrice(a.price || a.mrp);
const priceB = this.extractPrice(b.price || b.mrp);
return priceA - priceB;
});
break;
case "price-high":
this.filteredProducts.sort((a, b) => {
const priceA = this.extractPrice(a.price || a.mrp);
const priceB = this.extractPrice(b.price || b.mrp);
return priceB - priceA;
});
break;
case "featured":
this.filteredProducts.sort((a, b) => {
const aFeatured = a.featured || a.badge === "Featured" || false;
const bFeatured = b.featured || b.badge === "Featured" || false;
if (aFeatured && !bFeatured) return -1;
if (!aFeatured && bFeatured) return 1;
return a.name.localeCompare(b.name);
});
break;
}
}
extractPrice(priceString) {
if (!priceString) return 0;
return parseFloat(priceString.replace(/[₹,]/g, "")) || 0;
}
isPriceInRange(price, range) {
switch (range) {
case "0-50":
return price >= 0 && price <= 50;
case "50-100":
return price >= 50 && price <= 100;
case "100-200":
return price >= 100 && price <= 200;
case "200-500":
return price >= 200 && price <= 500;
case "500-1000":
return price >= 500 && price <= 1000;
case "1000-2000":
return price >= 1000 && price <= 2000;
case "2000-5000":
return price >= 2000 && price <= 5000;
case "5000+":
return price >= 5000;
default:
return true;
}
}
renderProducts() {
const container = document.getElementById("products-grid");
const loadMoreBtn = document.getElementById("load-more");
const noProductsSection = document.getElementById("no-products");
if (this.filteredProducts.length === 0) {
container.innerHTML = "";
loadMoreBtn.style.display = "none";
noProductsSection.style.display = "block";
return;
}
noProductsSection.style.display = "none";
const productsToShow = this.filteredProducts.slice(
0,
this.currentPage * this.productsPerPage
);
container.innerHTML = productsToShow
.map((product) => this.renderProductCard(product))
.join("");
const hasMore = this.filteredProducts.length > productsToShow.length;
loadMoreBtn.style.display = hasMore ? "block" : "none";
}
renderProductCard(product) {
const discount = this.calculateDiscount(product);
const discountHTML =
discount > 0 ? `<span class="discount">(${discount}% OFF)</span>` : "";
const mrpHTML =
product.mrp && product.mrp !== product.price
? `<span class="mrp">${product.mrp}</span>`
: "";
return `
<div class="product-card ${
product.featured ? "featured-product" : ""
}" data-product-id="${product.id}">
${
product.featured
? '<div class="featured-badge">⭐ Featured</div>'
: ""
}
${
product.badge
? `<div class="product-badge">${product.badge}</div>`
: ""
}
<div class="product-image">
${
product.image
? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
: `<div class="placeholder-emoji">📦</div>`
}
</div>
<div class="product-info">
<h3>${product.name}</h3>
<p>${product.description || ""}</p>
<div class="price-container">
${mrpHTML}
<span class="price">${
product.price || product.mrp
}</span>
${discountHTML}
</div>
${
product.stock !== undefined
? `
<div class="stock-info ${
product.stock === 0 ? "out-of-stock" : ""
}">
${
product.stock > 0
? `Stock: ${product.stock}`
: "Out of Stock"
}
</div>
`
: ""
}
</div>
</div>
`;
}
calculateDiscount(product) {
if (!product.mrp || !product.price || product.mrp === product.price) {
return 0;
}
const mrpValue = this.extractPrice(product.mrp);
const priceValue = this.extractPrice(product.price);
if (mrpValue > priceValue && mrpValue > 0) {
return Math.round(((mrpValue - priceValue) / mrpValue) * 100);
}
return 0;
}
loadMoreProducts() {
this.currentPage++;
this.renderProducts();
}
setGridView(isGrid) {
this.isGridView = isGrid;
const container = document.getElementById("products-grid");
const gridBtn = document.getElementById("grid-view");
const listBtn = document.getElementById("list-view");
if (isGrid) {
container.classList.remove("list-view");
gridBtn.classList.add("active");
listBtn.classList.remove("active");
} else {
container.classList.add("list-view");
listBtn.classList.add("active");
gridBtn.classList.remove("active");
}
}
clearAllFilters() {
this.filters = {
category: "",
priceRange: "",
sort: "name",
search: "",
};
document.getElementById("category-filter").value = "";
document.getElementById("price-filter").value = "";
const nameSearch = document.getElementById("name-search");
if (nameSearch) {
nameSearch.value = "";
}
document.getElementById("sort-filter").value = "name";
const globalSearch = document.getElementById("global-search");
if (globalSearch) {
globalSearch.value = "";
}
const url = new URL(window.location);
url.search = "";
window.history.replaceState({}, "", url);
this.applyFilters();
}
updateProductsCount() {
const countElement = document.getElementById("products-count");
const total = this.filteredProducts.length;
const showing = Math.min(this.currentPage * this.productsPerPage, total);
if (total === 0) {
countElement.textContent = "No products found";
} else if (showing === total) {
countElement.textContent = `Showing all ${total} products`;
} else {
countElement.textContent = `Showing ${showing} of ${total} products`;
}
}
showError(message) {
const container = document.getElementById("products-grid");
container.innerHTML = `
<div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
<div style="font-size: 3rem; margin-bottom: 20px;">😔</div>
<h3 style="color: #e74c3c; margin-bottom: 10px;">Error Loading Products</h3>
<p style="color: #7f8c8d;">${message}</p>
<button onclick="location.reload()" class="cta-button" style="margin-top: 20px;">
Try Again
</button>
</div>
`;
}
}
function clearAllFilters() {
if (window.productsPage) {
window.productsPage.clearAllFilters();
}
}
function handleFilterRedirect(select) {
const selectedOption = select.options[select.selectedIndex];
const url = selectedOption.getAttribute("data-url");
if (url) {
window.location.href = url;
}
}
function filterByCategory(categoryId) {
if (categoryId) {
window.location.href = "products.php?catId="  categoryId;
} else {
window.location.href = "products.php";
}
}
function setupPriceFilter() {
document
.getElementById("price-filter")
?.addEventListener("change", function () {
const priceRange = this.value;
const cards = document.querySelectorAll(".product-card");
cards.forEach((card) => {
const priceElement = card.querySelector(".price");
if (priceElement) {
const price = parseFloat(
priceElement.textContent.replace(/[₹,]/g, "")
);
let show = true;
if (priceRange === "0-50" && (price < 0 || price > 50)) show = false;
else if (priceRange === "50-100" && (price < 50 || price > 100))
show = false;
else if (priceRange === "100-200" && (price < 100 || price > 200))
show = false;
else if (priceRange === "200-500" && (price < 200 || price > 500))
show = false;
else if (priceRange === "500-1000" && (price < 500 || price > 1000))
show = false;
else if (priceRange === "1000-2000" && (price < 1000 || price > 2000))
show = false;
else if (priceRange === "2000-5000" && (price < 2000 || price > 5000))
show = false;
else if (priceRange === "5000+" && price < 5000) show = false;
card.style.display = show ? "" : "none";
}
});
updateProductsCount();
});
}
function sortProductCards(sortBy) {
const container = document.getElementById("products-grid");
if (!container) {
return;
}
const cards = Array.from(container.querySelectorAll(".product-card"));
if (cards.length === 0) {
return;
}
cards.sort((a, b) => {
switch (sortBy) {
case "name":
const nameA = a.querySelector("h3")?.textContent || "";
const nameB = b.querySelector("h3")?.textContent || "";
return nameA.localeCompare(nameB);
case "price-low":
const priceA = parseFloat(
a.querySelector(".price")?.textContent.replace(/[₹,]/g, "") || "0"
);
const priceB = parseFloat(
b.querySelector(".price")?.textContent.replace(/[₹,]/g, "") || "0"
);
return priceA - priceB;
case "price-high":
const priceA2 = parseFloat(
a.querySelector(".price")?.textContent.replace(/[₹,]/g, "") || "0"
);
const priceB2 = parseFloat(
b.querySelector(".price")?.textContent.replace(/[₹,]/g, "") || "0"
);
return priceB2 - priceA2;
default:
return 0;
}
});
cards.forEach((card) => container.appendChild(card));
}
function setupSortFilter() {
document
.getElementById("sort-filter")
?.addEventListener("change", function () {
sortProductCards(this.value);
});
}
function setupClearFilters() {
document
.getElementById("clear-filters")
?.addEventListener("click", function () {
window.location.href = "products.php";
});
}
function updateProductsCount() {
const visibleCards = document.querySelectorAll(
'.product-card:not([style*="display: none"])'
).length;
const countElement = document.getElementById("products-count");
if (countElement) {
countElement.textContent = `Showing ${visibleCards} products`;
}
}
function setupViewToggle() {
const gridBtn = document.getElementById("grid-view");
const listBtn = document.getElementById("list-view");
const container = document.getElementById("products-grid");
gridBtn?.addEventListener("click", function () {
container.classList.remove("list-view");
this.classList.add("active");
listBtn.classList.remove("active");
});
listBtn?.addEventListener("click", function () {
container.classList.add("list-view");
this.classList.add("active");
gridBtn.classList.remove("active");
});
}
document.addEventListener("DOMContentLoaded", function () {
setupPriceFilter();
setupSortFilter();
setupClearFilters();
setupViewToggle();
updateProductsCount();
sortProductCards("price-high");
});
function debugSort() {
const container = document.getElementById("products-grid");
const cards = container
? Array.from(container.querySelectorAll(".product-card"))
: [];
if (cards.length > 0) {
}
}
function filterProductsByName(searchTerm) {
const productCards = document.querySelectorAll('.product-card');
const searchLower = searchTerm.toLowerCase().trim();
let visibleCount = 0;
productCards.forEach(card => {
const productName = card.querySelector('h3')?.textContent.toLowerCase() || '';
const productDescription = card.querySelector('.description')?.textContent.toLowerCase() || '';
if (searchLower === '' ||
productName.includes(searchLower) ||
productDescription.includes(searchLower)) {
card.style.display = 'block';
card.classList.remove('hidden-search');
visibleCount++;
} else {
card.style.display = 'none';
card.classList.add('hidden-search');
}
});
updateProductsCount(visibleCount);
const noProductsSection = document.getElementById('no-products');
if (noProductsSection) {
noProductsSection.style.display = visibleCount === 0 ? 'block' : 'none';
}
}
function updateVisibleProductsCount() {
const visibleCards = document.querySelectorAll('.product-card:not(.hidden-search)');
updateProductsCount(visibleCards.length);
}
function updateProductsCount(count) {
const countElement = document.getElementById('products-count');
if (countElement) {
countElement.textContent = `Showing ${count} products`;
}
}
document.addEventListener("DOMContentLoaded", function () {
const nameSearchInput = document.getElementById('name-search');
if (nameSearchInput) {
nameSearchInput.addEventListener('input', function(e) {
filterProductsByName(e.target.value);
});
nameSearchInput.addEventListener('keyup', function(e) {
if (e.key === 'Escape') {
this.value = '';
filterProductsByName('');
}
});
}
const clearFiltersBtn = document.getElementById('clear-filters');
if (clearFiltersBtn) {
clearFiltersBtn.addEventListener('click', function() {
if (nameSearchInput) {
nameSearchInput.value = '';
}
filterProductsByName('');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const sortFilter = document.getElementById('sort-filter');
if (categoryFilter) categoryFilter.value = '';
if (priceFilter) priceFilter.value = '';
if (sortFilter) sortFilter.value = 'name';
});
}
window.productsPage = new ProductsPage();
window.productsPage.loadProductsFromDOM();
const clearBtn = document.getElementById("clearAllFiltersBtn");
if (clearBtn) {
clearBtn.addEventListener("click", function () {
clearAllFilters();
});
}
updateProductsCount(document.querySelectorAll('.product-card').length);
});
