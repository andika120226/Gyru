// checkout.js - renders cart on dedicated order page, handles payment and bill
document.addEventListener("DOMContentLoaded", () => {
  const checkoutItemsEl = document.getElementById("checkoutItems");
  const checkoutTotalEl = document.getElementById("checkoutTotal");
  const amountPaidEl = document.getElementById("amountPaid");
  const paidAmountEl = document.getElementById("paidAmount");
  const changeAmountEl = document.getElementById("changeAmount");
  const paymentInfoEl = document.getElementById("paymentInfo");

  function loadCart() {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    const cart = loadCart();
    checkoutItemsEl.innerHTML = "";
    if (!cart || cart.length === 0) {
      checkoutItemsEl.innerHTML =
        '<p class="empty-message">Keranjang kosong. Kembali ke <a href="menu.html">Menu</a></p>';
      checkoutTotalEl.textContent = "IDR 0";
      paymentInfoEl.style.display = "none";
      return;
    }

    let total = 0;
    cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <div class="item-details">
          <h4>${item.name}</h4>
          <p class="item-price">IDR ${item.price.toLocaleString("id-ID")}</p>
        </div>
        <div class="item-control">
          <div class="qty-control-inline">
            <button class="qty-btn-sm" data-id="${
              item.id
            }" data-op="dec">-</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn-sm" data-id="${
              item.id
            }" data-op="inc">+</button>
          </div>
          <p class="subtotal">IDR ${subtotal.toLocaleString("id-ID")}</p>
          <button class="btn-remove" data-id="${item.id}">Hapus</button>
        </div>
      `;

      checkoutItemsEl.appendChild(itemEl);
    });

    checkoutTotalEl.textContent = `IDR ${total.toLocaleString("id-ID")}`;
  }

  // delegate clicks
  checkoutItemsEl.addEventListener("click", (e) => {
    const cart = loadCart();
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = Number(btn.getAttribute("data-id"));
    const op = btn.getAttribute("data-op");

    if (btn.classList.contains("btn-remove")) {
      const updated = cart.filter((i) => i.id !== id);
      saveCart(updated);
      if (soundManager) soundManager.playClickSound();
      return;
    }

    if (op === "inc") {
      const found = cart.find((i) => i.id === id);
      if (found) found.quantity += 1;
      saveCart(cart);
      if (soundManager) soundManager.playClickSound();
      return;
    }

    if (op === "dec") {
      const found = cart.find((i) => i.id === id);
      if (found) {
        found.quantity = Math.max(0, found.quantity - 1);
        if (found.quantity === 0) {
          // remove
          const updated = cart.filter((i) => i.id !== id);
          saveCart(updated);
        } else {
          saveCart(cart);
        }
        if (soundManager) soundManager.playClickSound();
      }
      return;
    }
  });

  // clear cart page
  document.getElementById("clearCartPage").addEventListener("click", () => {
    if (confirm("Hapus semua item dari keranjang?")) {
      localStorage.removeItem("cart");
      renderCart();
      if (soundManager) soundManager.playClickSound();
    }
  });

  // send order
  document.getElementById("sendOrder").addEventListener("click", () => {
    const cart = loadCart();
    if (!cart || cart.length === 0) {
      alert("Keranjang kosong");
      return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const amountPaid = Number(document.getElementById("amountPaid").value) || 0;

    if (!name) {
      alert("Masukkan nama pemesan");
      return;
    }
    if (!phone) {
      alert("Masukkan nomor telepon");
      return;
    }

    // compute total
    let total = 0;
    cart.forEach((i) => (total += i.price * i.quantity));

    // compute change
    const change = amountPaid - total;

    // prepare bill
    const billListEl = document.getElementById("billList");
    billListEl.innerHTML = "";
    cart.forEach((i) => {
      const row = document.createElement("div");
      row.className = "bill-item-row";
      row.innerHTML = `<span>${i.name} x${i.quantity}</span><span>IDR ${(
        i.price * i.quantity
      ).toLocaleString("id-ID")}</span>`;
      billListEl.appendChild(row);
    });

    document.getElementById(
      "billTotal"
    ).textContent = `IDR ${total.toLocaleString("id-ID")}`;
    document.getElementById(
      "billPaid"
    ).textContent = `IDR ${amountPaid.toLocaleString("id-ID")}`;
    document.getElementById("billChange").textContent = `IDR ${Math.max(
      0,
      change
    ).toLocaleString("id-ID")}`;

    document.getElementById("billName").textContent = name;
    document.getElementById("billPhone").textContent = phone;
    document.getElementById("billNotes").textContent = notes || "-";

    const now = new Date();
    document.getElementById("billTime").textContent =
      now.toLocaleString("id-ID");

    // show paid info on page
    paymentInfoEl.style.display = "block";
    paidAmountEl.textContent = `IDR ${amountPaid.toLocaleString("id-ID")}`;
    changeAmountEl.textContent = `IDR ${Math.max(0, change).toLocaleString(
      "id-ID"
    )}`;

    // show modal
    document.getElementById("orderBillModal").classList.add("show");

    if (soundManager) soundManager.playSuccessSound();
  });

  // close bill modal
  document.getElementById("closeBillModal").addEventListener("click", () => {
    document.getElementById("orderBillModal").classList.remove("show");
  });
  document.getElementById("closeBillBtn").addEventListener("click", () => {
    document.getElementById("orderBillModal").classList.remove("show");
    // clear cart after closing so order is considered sent
    localStorage.removeItem("cart");
    renderCart();
  });

  // print bill
  document.getElementById("printBillBtn").addEventListener("click", () => {
    const popup = window.open("", "_blank");
    const billHtml = document.querySelector(".bill-result").outerHTML;
    popup.document.write(
      `<html><head><title>Bill</title></head><body>${billHtml}</body></html>`
    );
    popup.document.close();
    popup.print();
    if (soundManager) soundManager.playSuccessSound();
  });

  // live update total when cart changes elsewhere
  window.addEventListener("storage", () => {
    renderCart();
  });

  // initial render
  renderCart();
});
