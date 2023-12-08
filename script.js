const productsContainer = document.querySelector(".products_container");
const inputSearch = document.querySelector("#search_input");
const buttonSearch = document.querySelector("#search_button");
const filterCategory = document.querySelector("#select_category");
const cartItem = document.querySelector("#cart-items");

// generator cards
function generatorCards(data) {
  // создаём пустой массив чтобы потом ретурнить сюда же
  const cards = [];
  //цикл для определение сколько раз запушить , поэтому и i < data.length
  for (let i = 0; i < data.length; i++) {
    cards.push(`
    <div class="product_card" data-product-id="1">
    <img src="https://loremflickr.com/200/150/id${data[i].id}" alt="" />
    <div id="card_title">${data[i].title}</div>
    <div id="card_category">${data[i].category}</div>
    <div id="product_color">${data[i].color}</div>
    <div id="product_cost">${data[i].cost} $</div>
    <button id="shop_cart">Добавить в корзинку</button>
  </div>
    `);
  }

  return cards;
}

const cardsArr = generatorCards(data);
productsContainer.innerHTML = cardsArr.join(" ");



//корзинкача
const cartItems = {}; 

// Функция для обновления карточек на основе данных
function updateCards(data) {
  const cardsArr = generatorCards(data);
  productsContainer.innerHTML = cardsArr.join(" ");

  // Перебираем все кнопки "Добавить в корзинку" и добавляем обработчик событий
  const addToCartButtons = document.querySelectorAll("#shop_cart");
  addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", () => addToCart(data[index]));
  });
}


// Функция обнов корзины
function updateCart() {
  // Очищаем корзину перед обновлением
  cartItem.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  // Перебираем товары в корзине
  for (const productId in cartItems) {
    const item = cartItems[productId];
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");

    // Добавим атрибут data-product-id
    cartItemElement.dataset.productId = productId;

    cartItemElement.innerHTML = `
      <div>${item.product.title}</div>
      <div>Количество: ${item.quantity}</div>
      <div>Сумма: ${item.total} $</div>
      <button id="minus_cart">-</button>
      <button id="plus_cart">+</button>
    `;

    // Добавляем элемент корзины в контейнер
    cartItem.appendChild(cartItemElement);

    // Увеличиваем кол и  цену
    totalItems += item.quantity;
    totalPrice += item.total;
  }


  cartTotalItems.innerHTML = `В корзине: ${totalItems} товаров`;
  cartTotalPrice.innerHTML = `Общая стоимость: ${totalPrice} $`;
}



//добавления корзину
function addToCart(product) {
  const productId = product.id;

  if (cartItems[productId]) {
    // Если товар уже есть в корзине, увеличиваем количество и обновляем сумму
    cartItems[productId].quantity += 1;
    cartItems[productId].total = cartItems[productId].quantity * product.cost;
  } else {
    // Если товара еще нет в корзине, добавляем новый элемент
    cartItems[productId] = {
      product: product,
      quantity: 1,
      total: product.cost,
    };
  }

  // Обновляем отображение корзины
  updateCart();
}

// Инициализация карточек при загрузке страницы
updateCards(data);



// Функция для обновления количества товаров в корзине
function updateCartQuantity(productId, change) {
  if (cartItems[productId]) {
    // Уменьшаем или увеличиваем количество в корзине
    cartItems[productId].quantity += change;

    // Если количество становится меньше 1, удаляем товар из корзины
    if (cartItems[productId].quantity < 1) {
      delete cartItems[productId];
    } else {
      // Обновляем сумму для соответствующего товара
      const product = cartItems[productId].product;
      cartItems[productId].total = cartItems[productId].quantity * product.cost;
    }

    // Обновляем отображение корзины
    updateCart();
  }
}


// Обработчик событий для кнопки уменьшения и увеличения количества товаров в корзине
document.addEventListener("click", function (event) {
  const targetId = event.target.id;

  if (targetId === "minus_cart" || targetId === "plus_cart") {
    const button = event.target;
    const cartItemElement = button.closest(".cart-item");

    if (cartItemElement) {
      const productId = cartItemElement.dataset.productId;
      const change = targetId === "minus_cart" ? -1 : 1;

      updateCartQuantity(productId, change);
    }
  }
});




// Обработчик событий для кнопки поиска
buttonSearch.addEventListener("click", searchProducts);

// Функция поиска
function searchProducts() {
  const searchTerm = inputSearch.value.toLowerCase();
  const filteredData = data.filter((product) => {
    // есть ли те знаки в титле и через return вернуть
    return (
      product.title.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  });

  // Обновляем карточки на основе отфильтрованных данных
  updateCards(filteredData);
}



// Обработчик событий для поля ввода для мгновенного поиска
// inputSearch.addEventListener("input", searchProducts);

// Инициализация карточек при загрузке страницы
// updateCards(data);




//беру значенения
filterCategory.addEventListener("change", filterByCategory);

// Функция фильтрации по категории
function filterByCategory() {
  //toLowerCase делает шрифт маленькими
  const selectedCategory = filterCategory.value.toLowerCase();

  
  const filteredData = selectedCategory
    ? data.filter(
        (product) => product.category.toLowerCase() === selectedCategory
      )
    : data;

  // Обновляем карточки на основе отфильтрованных данных
  updateCards(filteredData);
}


//open or close Корзинка
function toggleCart() {
  const cartItems = document.getElementById("cart-items");
  //если у cartitem в стили dispal none или просто пусто
  if (cartItems.style.display === "none" || cartItems.style.display === "") {
    //то добавить стил display block
    cartItems.style.display = "block";
  } else {
    cartItems.style.display = "none";
  }
}
