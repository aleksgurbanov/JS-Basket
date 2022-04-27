(function() {

    let productsContainer = document.querySelector("#grid");
    let cartContainer = document.querySelector("#shopping-cart");
    let cartContent = document.querySelector("#cart-content");
    let toggleCartBtn = document.querySelector("#toggle-cart-btn");
    let clearCartBtn = document.querySelector("#clear-cart");
    let checkoutBtn = document.querySelector("#checkout-btn");
    let totalPriceContainer = document.querySelector("#total-price");

    function toggleCart() {
        cartContainer.classList.toggle("open");
    }

    function getLSContent() {
        let lsContent = JSON.parse(localStorage.getItem("products")) || [];
        return lsContent;
    }

    function setLSContent(lsContent) {
        localStorage.setItem("products", JSON.stringify(lsContent));
    }

    function calculateTotal(prices) {
        return prices.reduce(function(prev, next) {
            return prev + next;
        }, 0);
    }

    function getCartItemPrices() {
        let prices = [];
        let nums = cartContent.querySelectorAll("tr td:nth-child(3)");

        if (nums.length > 0) {
            for (let cell = 0; cell < nums.length; cell++) {
                let num = nums[cell].innerText;
                num = num.replace(/[^\d]/g, "");
                num = parseFloat(num);
                prices.push(num);
            }
            return prices;
        } else {
            return;
        }
    }

    function displayCartTotal() {
        let prices = getCartItemPrices();
        let total = 0;
        if (prices) {
            total = calculateTotal(prices);
            totalPriceContainer.innerHTML = `<span class="total">Total: $${total.toFixed(
        2
      )}</span>`;
        } else {
            totalPriceContainer.innerHTML = '<span class="total">Total: $0</span>';
        }
    }

    function displayProducts() {
        const lsContent = getLSContent();
        let productMarkup = "";
        if (lsContent !== null) {
            for (let product of lsContent) {
                productMarkup += `
          <tr>
          <td><img class="cart-image" src="${product.image}" alt="${
          product.name
        }" width="120"></td>
          <td>
            ${product.name}
          </td>
          <td>${product.price}</td>
          <td><a href="#" data-id="${product.id}" class="remove">X</a></td>
          </tr>
        `;
            }
        } else {
            productMarkup = "Your cart is empty.";
        }
        cartContent.querySelector("tbody").innerHTML = productMarkup;
    }

    function saveProduct(clickedBtn) {

        let productId = clickedBtn.getAttribute("data-id");
        let card = clickedBtn.parentElement.parentElement;
        let cardInfo = clickedBtn.parentElement;
        let prodImage = card.querySelector("img").src;
        let prodName = cardInfo.querySelector("h4").textContent;
        let prodPrice = cardInfo.querySelector(".card__price").textContent;

        let isProductInCart = false;

        let lsContent = getLSContent();

        lsContent.forEach(function(product) {
            if (product.id === productId) {
                alert("Count qoymaga erinmishem, sorry 🥰 ");
                isProductInCart = true;
            }
        });
        if (!isProductInCart) {
            lsContent.push({
                id: productId,
                image: prodImage,
                name: prodName,
                price: prodPrice
            });

            setLSContent(lsContent);
            displayProducts();
        }
    }

    function removeProduct(productId) {
        let lsContent = getLSContent();

        let productIndex;
        lsContent.forEach(function(product, i) {
            if (product.id === productId) {
                productIndex = i;
            }
        });


        lsContent.splice(productIndex, 1);
        setLSContent(lsContent);

        displayProducts();
    }

    function clearCart() {
        let lsContent = getLSContent();
        lsContent.splice(0, lsContent.length);
        setLSContent(lsContent);
        displayProducts();
    }

    function checkout() {

        const cartProducts = cartContent.querySelector("tbody").innerHTML;
        if (cartProducts !== "" && confirm("Are you sure you want to checkout?")) {
            clearCart();
        } else {
            return;
        }
    }

    document.addEventListener("DOMContentLoaded", function(e) {
        displayProducts();
        displayCartTotal();
    });

    toggleCartBtn.addEventListener("click", function(e) {
        e.preventDefault();
        toggleCart();
    });

    productsContainer.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-to-cart")) {
            e.preventDefault();
            const clickedBtn = e.target;
            saveProduct(clickedBtn);
        }
    });

    productsContainer.addEventListener("click", function(e) {
        if (e.target.classList.contains("add-to-cart")) {
            displayCartTotal();
        }
    });

    cartContent.querySelector("tbody").addEventListener("click", function(e) {
        e.preventDefault();
        const clickedBtn = e.target;
        if (e.target.classList.contains("remove")) {
            const productId = clickedBtn.getAttribute("data-id");
            removeProduct(productId);
            displayCartTotal();
        }
    });

    clearCartBtn.addEventListener("click", function(e) {
        e.preventDefault();
        clearCart();
    });
    clearCartBtn.addEventListener("click", displayCartTotal);
    checkoutBtn.addEventListener("click", function(e) {
        e.preventDefault();
        checkout();
    });
    checkoutBtn.addEventListener("click", displayCartTotal);
})();