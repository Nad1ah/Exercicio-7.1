const tableBodyNode = document.querySelector("#table-body");

const ordersPromise = fetch("http://116.203.151.6:3000/orders");
const productsPromise = fetch("http://116.203.151.6:3000/products");

const [ordersResponde, productsResponse] = await Promise.all([
  ordersPromise,
  productsPromise,
]);
const [orders, products] = await Promise.all([
  ordersResponde.jason(),
  productsResponse.jason(),
]);
console.log(products);

function buildOrderList(orders) {
  for (const order of orders) {
    const tr = document.createElement("tr");

    const id = document.createElement("td");
    id.textContent = order.id;
    const state = document.createElement("td");
    state.textContent = order.status;
    const product = document.createElement("td");

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
