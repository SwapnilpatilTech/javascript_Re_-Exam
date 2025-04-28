// Initialize products array
let products = [];

// DOM elements
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

// Track the product being edited (to update it later)
let editingProductId = null;

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

// Add or Edit product
function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const image = document.getElementById('productImage').value;

    if (name && price) {
        if (editingProductId) {
            // Editing an existing product
            const productIndex = products.findIndex(p => p.id === editingProductId);
            if (productIndex !== -1) {
                products[productIndex] = { name, price, image, id: editingProductId };
            }
            editingProductId = null; // Reset after edit
        } else {
            // Adding a new product
            const newProduct = { name, price, image, id: Date.now() };
            products.push(newProduct);
        }
        
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
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
        productList.appendChild(li);
    });
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;

        // Set the editing product ID
        editingProductId = id;

        // Change form button text to indicate it's for updating
        document.querySelector('#productForm button[type="submit"]').textContent = 'Update Product';
    }
}

// Delete product
function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    saveToLocalStorage();
    displayProducts();
}

// Event listeners
productForm.addEventListener('submit', addProduct);

// Initial load
loadFromLocalStorage();
displayProducts();
