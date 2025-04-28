// Initialize products array
let products = [];

// DOM elements
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const sortLowHigh = document.getElementById('sortLowHigh');
const sortHighLow = document.getElementById('sortHighLow');
const filterCategory = document.getElementById('filterCategory');

// Load products from local storage
function loadFromLocalStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
}

// Save products to local storage
function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Add new product
function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const image = document.getElementById('productImage').value;
    const category = document.getElementById('productCategory').value;

    if (name && price) {
        const newProduct = { name, price, image, category, id: Date.now() };
        products.push(newProduct);
        saveToLocalStorage();
        displayProducts();
        productForm.reset();
    }
}

// Display products
function displayProducts() {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
        productList.appendChild(li);
    });
    updateCategoryFilter();
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productCategory').value = product.category;
        
        // Remove the old product
        deleteProduct(id);
        
        // Focus on the submit button to make it clear it's ready for update
        document.querySelector('#productForm button[type="submit"]').focus();
    }
}

// Delete product
function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    saveToLocalStorage();
    displayProducts();
}

// Search products
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    displayFilteredProducts(filteredProducts);
}

// Sort products
function sortProducts(order) {
    products.sort((a, b) => {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
    displayProducts();
}

// Filter products by category
function filterProductsByCategory() {
    const category = filterCategory.value;
    if (category) {
        const filteredProducts = products.filter(product => product.category === category);
        displayFilteredProducts(filteredProducts);
    } else {
        displayProducts();
    }
}

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
        productList.appendChild(li);
    });
}

// Update category filter options
function updateCategoryFilter() {
    const categories = [...new Set(products.map(product => product.category))];
    filterCategory.innerHTML = '<option value="">Filter by Category</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

// Event listeners
productForm.addEventListener('submit', addProduct);
searchInput.addEventListener('input', searchProducts);
sortLowHigh.addEventListener('click', () => sortProducts('asc'));
sortHighLow.addEventListener('click', () => sortProducts('desc'));
filterCategory.addEventListener('change', filterProductsByCategory);

// Initial load
loadFromLocalStorage();
displayProducts();