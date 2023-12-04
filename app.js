import "./style.css";

const currencyValues = {
  EUR: 1,
  USD: 1.07,
  GBP: 0.87,
};

const currencyToSymbol = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

const tableBodyNode = document.querySelector("#table-body");
const newOrderForm = document.querySelector("#new-order-form");
const addProductBtn = document.querySelector("#add-product");
const productsForm = document.querySelector("#order-products-form");

const ordersPromise = fetch("http://116.203.151.6:3000/orders");
const productsPromise = fetch("http://116.203.151.6:3000/products");

const [ordersResponse, productsResponse] = await Promise.all([
  ordersPromise,
  productsPromise,
]);
const [orders, products] = await Promise.all([
  ordersResponse.json(),
  productsResponse.json(),
]);

for (const order of orders) {
  const orderCurrency = order.currency;

  let orderPrice = 0;

  for (const productFromOrder of order.products) {
    const foundProduct = products.find(
      (productFromDb) => productFromOrder.name === productFromDb.name
    );

    const productPrice = productFromOrder.quantity * foundProduct.price;
    const productCurrency = foundProduct.currency;
    const convertedPrice = convertCurrency(
      productPrice,
      productCurrency,
      orderCurrency
    );

    productFromOrder.price = convertedPrice;
    orderPrice = orderPrice + convertedPrice;
  }

  order.price = orderPrice;
}

console.log(orders);
console.log(products);

buildOrdersList(orders);

function buildOrdersList(orders) {
  for (const order of orders) {
    const orderRow = document.createElement("tr");

    const id = document.createElement("td");
    const status = document.createElement("td");
    const price = document.createElement("td");

    id.textContent = order.id;
    price.textContent = `${
      currencyToSymbol[order.currency]
    } ${order.price.toFixed(2)}`;

    const innerStatusBadge = buildStatusBadge(order);

    status.appendChild(innerStatusBadge);

    orderRow.appendChild(id);
    orderRow.appendChild(status);
    orderRow.appendChild(price);

    tableBodyNode.appendChild(orderRow);
  }
}

addProductBtn.addEventListener("click", () => {
  const productSelect = document.createElement("select");
  const productQuantity = document.createElement("input");

  productSelect.setAttribute("name", "order-products");
  productQuantity.setAttribute("name", "products-quantity");

  for (const product of products) {
    const productOption = document.createElement("option");
    productOption.textContent = product.name;
    productOption.value = product.name;

    productSelect.appendChild(productOption);
  }

  productsForm.appendChild(productSelect);
  productsForm.appendChild(productQuantity);
});

newOrderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(newOrderForm);

  const orderCurrency = form.get("order-currency");
  const orderProducts = form.getAll("order-products");
  const productQuantities = form.getAll("products-quantity");

  const body = JSON.stringify({
    currency: orderCurrency,
    products: orderProducts.map((op, index) => {
      const quantity = Number.parseInt(productQuantities[index]);

      return { name: op, quantity };
    }),
  });

  fetch("http://116.203.151.6:3000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
    .then(() => {
      return fetch("http://116.203.151.6:3000/orders");
    })
    .then((res) => {
      return res.json();
    })
    .then((orders) => {
      buildOrdersList(orders);
    });
});

function buildStatusBadge(order) {
  const innerStatusBadge = document.createElement("div");
  innerStatusBadge.classList.add("status-badge");
  innerStatusBadge.textContent = `${order.status
    .charAt(0)
    .toUpperCase()}${order.status.slice(1)}`;

  switch (order.status) {
    case "processing":
      innerStatusBadge.classList.add("status-warning");
      break;
    case "shipped":
      innerStatusBadge.classList.add("status-success");
      break;
    case "cancelled":
      innerStatusBadge.classList.add("status-error");
      break;
    default:
      innerStatusBadge.classList.add("status-info");
  }

  return innerStatusBadge;
}

function convertCurrency(value, fromCurrency, toCurrency) {
  const conversionRate =
    currencyValues[toCurrency] / currencyValues[fromCurrency];
  const convertedValue = value * conversionRate;

  return convertedValue;
}
