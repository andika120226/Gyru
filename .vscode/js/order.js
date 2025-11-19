// Order Management System with Shopping Cart
class OrderManager {
  constructor() {
    this.cart = [];
    this.customerInfo = {
      name: "",
      phone: "",
      notes: "",
    };
    this.initEventListeners();
    this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem("cart");
    if (saved) {
      this.cart = JSON.parse(saved);
      this.updateCartDisplay();
    }
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.updateCartDisplay();
  }

  initEventListeners() {
    // Order buttons on menu cards
    const orderButtons = document.querySelectorAll(".btn-order");
    orderButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = btn.getAttribute("data-name");
        const price = btn.getAttribute("data-price");
        this.addToCart(name, price);
        if (soundManager) soundManager.playClickSound();
      });
    });

    // Modal close buttons
    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const modal = btn.closest(".modal");
        if (modal) {
          modal.classList.remove("show");
          if (soundManager) soundManager.playClickSound();
        }
      });
    });

    // Modal background click to close
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
        }
      });
    });

    // Cart sidebar toggle
    const cartBtn = document.getElementById("shopping-cart");
    if (cartBtn) {
      cartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleCartSidebar();
        if (soundManager) soundManager.playClickSound();
      });
    }

    // Input fields for customer info
    const customerNameInput = document.getElementById("customerName");
    const customerPhoneInput = document.getElementById("customerPhone");
    const notesInput = document.getElementById("notes");

    if (customerNameInput) {
      customerNameInput.addEventListener("input", (e) => {
        this.customerInfo.name = e.target.value;
      });
    }
    if (customerPhoneInput) {
      customerPhoneInput.addEventListener("input", (e) => {
        this.customerInfo.phone = e.target.value;
      });
    }
    if (notesInput) {
      notesInput.addEventListener("input", (e) => {
        this.customerInfo.notes = e.target.value;
      });
    }

    // Submit order button
    const submitBtn = document.getElementById("submitOrder");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.submitOrder();
      });
    }

    // Print button
    const printBtn = document.getElementById("printBill");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        this.printBill();
      });
    }

    // Close bill button
    const closeBillBtn = document.getElementById("closeBill");
    if (closeBillBtn) {
      closeBillBtn.addEventListener("click", () => {
        document.getElementById("billModal").classList.remove("show");
        document.getElementById("cartModal").classList.remove("show");
        this.clearCart();
        if (soundManager) soundManager.playClickSound();
      });
    }

    // Clear cart button
    const clearCartBtn = document.getElementById("clearCart");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        if (confirm("Hapus semua item dari keranjang?")) {
          this.clearCart();
          if (soundManager) soundManager.playClickSound();
        }
      });
    }
  }

  addToCart(name, price) {
    const existingItem = this.cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: Date.now(),
        name: name,
        price: parseInt(price),
        quantity: 1,
      });
    }

    this.saveCart();
    this.showCartNotification();
  }

  removeFromCart(itemId) {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    this.saveCart();
    if (soundManager) soundManager.playClickSound();
  }

  updateItemQuantity(itemId, quantity) {
    const item = this.cart.find((item) => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  clearCart() {
    this.cart = [];
    this.customerInfo = { name: "", phone: "", notes: "" };
    localStorage.removeItem("cart");
    this.updateCartDisplay();
    document.getElementById("cartModal").classList.remove("show");
  }

  toggleCartSidebar() {
    const cartModal = document.getElementById("cartModal");
    if (!cartModal) {
      console.warn("Cart modal not found");
      return;
    }

    if (cartModal.classList.contains("show")) {
      cartModal.classList.remove("show");
    } else {
      cartModal.classList.add("show");
      this.updateCartDisplay();
    }
  }

  updateCartDisplay() {
    const cartItemsList = document.getElementById("cartItemsList");
    const cartCount = document.getElementById("cartCount");
    const emptyCart = document.getElementById("emptyCart");
    const checkoutSection = document.getElementById("checkoutSection");

    if (!cartItemsList) return;

    // Update cart count badge
    if (cartCount) {
      const totalItems = this.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "inline-block" : "none";
    }

    if (this.cart.length === 0) {
      cartItemsList.innerHTML = '<p class="empty-message">Keranjang kosong</p>';
      if (emptyCart) emptyCart.style.display = "block";
      if (checkoutSection) checkoutSection.style.display = "none";
      return;
    }

    if (emptyCart) emptyCart.style.display = "none";
    if (checkoutSection) checkoutSection.style.display = "block";

    let html = "";
    let totalPrice = 0;

    this.cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      totalPrice += subtotal;

      html += `
        <div class="cart-item">
          <div class="item-details">
            <h4>${item.name}</h4>
            <p class="item-price">IDR ${item.price.toLocaleString("id-ID")}</p>
          </div>
          <div class="item-control">
            <div class="qty-control-inline">
              <button class="qty-btn-sm" onclick="orderManager.updateItemQuantity(${
                item.id
              }, ${item.quantity - 1})">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn-sm" onclick="orderManager.updateItemQuantity(${
                item.id
              }, ${item.quantity + 1})">+</button>
            </div>
            <p class="subtotal">IDR ${subtotal.toLocaleString("id-ID")}</p>
            <button class="btn-remove" onclick="orderManager.removeFromCart(${
              item.id
            })">Hapus</button>
          </div>
        </div>
      `;
    });

    cartItemsList.innerHTML = html;

    // Update total price
    const totalPriceEl = document.getElementById("totalPrice");
    if (totalPriceEl) {
      totalPriceEl.textContent = `IDR ${totalPrice.toLocaleString("id-ID")}`;
    }
  }

  showCartNotification() {
    const notif = document.createElement("div");
    notif.className = "cart-notification";
    notif.textContent = "✅ Item ditambahkan ke keranjang!";
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.classList.add("show");
    }, 10);

    setTimeout(() => {
      notif.classList.remove("show");
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }

  submitOrder() {
    if (this.cart.length === 0) {
      alert("❌ Keranjang kosong! Silakan tambah item terlebih dahulu.");
      return;
    }

    const customerName = this.customerInfo.name.trim();
    const customerPhone = this.customerInfo.phone.trim();

    // Validation
    if (!customerName) {
      alert("❌ Mohon masukkan nama Anda!");
      return;
    }

    if (!customerPhone) {
      alert("❌ Mohon masukkan nomor telepon Anda!");
      return;
    }

    // Play success sound
    if (soundManager) soundManager.playSuccessSound();

    // Show bill modal
    this.showBillResult();
  }

  showBillResult() {
    const customerName = this.customerInfo.name;
    const customerPhone = this.customerInfo.phone;
    const notes = this.customerInfo.notes || "-";

    // Get current date and time
    const now = new Date();
    const dateTime = now.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Calculate totals
    let totalPrice = 0;
    let itemsHtml = "";

    this.cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      totalPrice += subtotal;

      itemsHtml += `
        <div class="bill-item-row">
          <span>${item.name} x${item.quantity}</span>
          <span>IDR ${subtotal.toLocaleString("id-ID")}</span>
        </div>
      `;
    });

    // Update result bill
    const billItemsContainer = document.getElementById("billItemsContainer");
    if (billItemsContainer) {
      billItemsContainer.innerHTML = itemsHtml;
    }

    document.getElementById("resultCustomer").textContent = customerName;
    document.getElementById("resultPhone").textContent = customerPhone;
    document.getElementById("resultNotes").textContent = notes;
    document.getElementById(
      "resultTotal"
    ).textContent = `IDR ${totalPrice.toLocaleString("id-ID")}`;
    document.getElementById("orderTime").textContent = dateTime;

    // Hide cart modal, show bill modal
    document.getElementById("cartModal").classList.remove("show");
    document.getElementById("billModal").classList.add("show");
  }

  printBill() {
    const customerName = this.customerInfo.name;
    const customerPhone = this.customerInfo.phone;
    const notes = this.customerInfo.notes || "-";

    let totalPrice = 0;
    let itemsHtml = "";

    this.cart.forEach((item) => {
      const subtotal = item.price * item.quantity;
      totalPrice += subtotal;
      itemsHtml += `
        <div class="item">
          <span>${item.name} x${item.quantity}</span>
          <span>IDR ${subtotal.toLocaleString("id-ID")}</span>
        </div>
      `;
    });

    const printContent = `
      <html>
        <head>
          <title>STRUK PESANAN</title>
          <style>
            body { 
              font-family: monospace; 
              max-width: 400px; 
              margin: 0 auto; 
              padding: 20px;
              background: #fff;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px dashed #000;
              margin-bottom: 10px;
              padding-bottom: 10px;
            }
            .title { font-weight: bold; font-size: 16px; }
            .divider { border-bottom: 2px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; font-size: 12px; }
            .total { 
              font-weight: bold; 
              display: flex; 
              justify-content: space-between;
              margin: 10px 0;
              padding: 5px;
              background: #f0f0f0;
              font-size: 14px;
            }
            .footer { text-align: center; margin-top: 15px; font-size: 12px; }
            .info { font-size: 12px; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🍔 MAKANAN CEPAT SAJI 🍔</div>
            <div style="font-size: 12px; margin-top: 5px;">Terima kasih telah memesan</div>
          </div>
          
          <div class="divider"></div>
          
          ${itemsHtml}
          
          <div class="divider"></div>
          
          <div class="total">
            <span>TOTAL:</span>
            <span>IDR ${totalPrice.toLocaleString("id-ID")}</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="info"><strong>Nama:</strong> ${customerName}</div>
          <div class="info"><strong>No. HP:</strong> ${customerPhone}</div>
          <div class="info"><strong>Catatan:</strong> ${notes}</div>
          
          <div class="footer">
            <p>✅ Pesanan berhasil diterima</p>
            <p>Kami akan memproses pesanan Anda dengan cepat</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "height=500,width=500");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    if (soundManager) soundManager.playSuccessSound();
  }
}

// Initialize order manager when DOM is ready
let orderManager = null;
document.addEventListener("DOMContentLoaded", () => {
  orderManager = new OrderManager();
});
