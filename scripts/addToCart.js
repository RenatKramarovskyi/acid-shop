class Product {
    constructor(cardObject) {
        this.img = cardObject.querySelector("img").src;
        this.title = cardObject.querySelector("h2").innerText;
        this.price = cardObject.querySelector("p").innerText.slice(8);
    }

    getJson() {
        return JSON.stringify({
            title: this.title,
            price: this.price,
            img: this.img
        });
    }

    static fromJson(jsonString) {
        const data = JSON.parse(jsonString);
        const product = Object.create(Product.prototype);
        product.title = data.title;
        product.price = data.price;
        product.img = data.img;
        return product;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let orderArray = [];

    function loadCartFromLocalStorage() {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
            const parsedOrders = JSON.parse(storedOrders);
            parsedOrders.forEach(orderJson => {
                orderArray.push(Product.fromJson(orderJson));
            });
            updateCart();
        }
    }

    // =============================
    const cartButton = document.getElementById("cartButton");
    const cartModal = document.getElementById("cartModal");
    const closeModal = document.querySelector(".close");
    const cartItems = document.getElementById("cartItems");
    // =============================

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            orderArray.push(new Product(button.parentElement));
            updateCart();
        });
    });

    cartButton.addEventListener("click", function () {
        cartModal.style.display = "block";
    });

    closeModal.addEventListener("click", function () {
        cartModal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === cartModal) {
            cartModal.style.display = "none";
        }
    });

    document.querySelector("#removeAllButton").addEventListener(
        "click", () => {
            orderArray = [];
            updateCart();
        }
    );

    function arrayToParsableString(orderArray) {
        return JSON.stringify(orderArray.map(order => order.getJson()));
    }

    function updateCart() {
        localStorage.setItem("orders", arrayToParsableString(orderArray));

        cartItems.innerHTML = '';

        orderArray.forEach((order, index) => {
            let modalDiv = document.createElement("div");
            modalDiv.innerHTML = `
                <div class="order-info">
                    <h3>${order.title}</h3> 
                    <p>${order.price}</p>
                </div>  
                <div>
                    <button class="remove-button" data-index="${index}">REMOVE</button>
                </div>`;
            cartItems.appendChild(modalDiv);
        });


        cartButton.textContent = `Cart (${orderArray.length})`;

        document.querySelectorAll(".remove-button").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                orderArray.splice(index, 1);
                updateCart();
            });
        });
    }

    loadCartFromLocalStorage();
});
