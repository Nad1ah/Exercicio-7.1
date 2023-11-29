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

const ordersPromise = fetch("http://116.203.151.6:3000/orders");
const productsPromise = fetch("http://116.203.151.6:3000/products");

const [ordersResponde, productsResponse] = await Promise.all([ordersPromise, productsPromise]);
const [orders, products] = await Promise.all([ordersResponde.jason(), productsResponse.jason()]);

for (const order of orders) {
  const orderCurrency = order.currency;

  let orderPrice = 0;

  for (const productFromOrder of orders.products) {
    const foundProduct = products.find((productFromDb) => productFromOrder.name === productFromDb.name);

    const productCurrency = foundProduct.currency;
    productFromOrder.price = productFromOrder.quantity * foundProduct.price;

    const convertedPrice = convertToCurrency(price, orderCurrency, productCurrency);
    productFromOrder.price = convertedPrice;
  }
}
console.log(orders);
console.log(products);

function buildOrderList(orders) {
  for (const order of orders) {
    const tr = document.createElement("tr");
    const id = document.createElement("td");
    const state = document.createElement("td");
    const product = document.createElement("td");

    id.textContent = order.id;
    state.textContent = order.status;
    price.textContent = `${CurrencyToSymbol[order.price]} ${order.price.toFixed(2)}`;

    tr.appendChild(id);
    tr.appendChild(state);
    tr.appendChild(product);

    tableBodyNode.appendChild(tr);

    if (order.status === "draft") {
      state.style.backgroundColor = "#2196f3";
    }
    if (order.status === "processing") {
      state.style.backgroundColor = "#ffc107";
    }
    if (order.status === "shipped") {
      state.style.backgroundColor = "#4caf50";
    }
    if (order.status === "cancelled") {
      state.style.backgroundColor = "#ff5722";
    }
    const ul = document.createElement("ul");

    for (const product of order.products) {
      const li = document.createElement("li");
      li.textContent = product;
      ul.appendChild(li);
    }
    product.appendChild(ul);
  }
}

function convertToCurrency(value, fromCurrency, toCurrency) {
  const conversionRate = currencyValues[toCurrency] / currencyValues[fromCurrency];

  const convertedVlaue = value * conversionRate;

  return convertedVlaue;
}
