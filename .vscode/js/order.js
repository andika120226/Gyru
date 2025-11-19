// Order Management System
class OrderManager {
  constructor() {
    this.currentOrder = null;
    this.initEventListeners();
  }

  initEventListeners() {
    // Order buttons on menu cards
    const orderButtons = document.querySelectorAll(".btn-order");
    orderButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = btn.getAttribute("data-name");
        const price = btn.getAttribute("data-price");
        this.openOrderModal(name, price);
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

    // Quantity controls
    document.getElementById("decreaseQty").addEventListener("click", () => {
      const qty = parseInt(document.getElementById("quantity").value) || 1;
      if (qty > 1) {
        document.getElementById("quantity").value = qty - 1;
        this.updateBillPreview();
        if (soundManager) soundManager.playClickSound();
      }
    });

    document.getElementById("increaseQty").addEventListener("click", () => {
      const qty = parseInt(document.getElementById("quantity").value) || 1;
      document.getElementById("quantity").value = qty + 1;
      this.updateBillPreview();
      if (soundManager) soundManager.playClickSound();
    });

    // Quantity input change
    document.getElementById("quantity").addEventListener("change", () => {
      this.updateBillPreview();
    });

    // Input fields update preview in real-time
    document.getElementById("customerName").addEventListener("input", () => {
      this.updateBillPreview();
    });

    document.getElementById("customerPhone").addEventListener("input", () => {
      this.updateBillPreview();
    });

    document.getElementById("notes").addEventListener("input", () => {
      this.updateBillPreview();
    });

    // Submit order button
    document.getElementById("submitOrder").addEventListener("click", () => {
      this.submitOrder();
    });

    // Print button
    document.getElementById("printBill").addEventListener("click", () => {
      this.printBill();
    });

    // Close bill button
    document.getElementById("closeBill").addEventListener("click", () => {
      document.getElementById("billModal").classList.remove("show");
      document.getElementById("orderModal").classList.remove("show");
      if (soundManager) soundManager.playClickSound();
    });
  }

  openOrderModal(menuName, menuPrice) {
    // Set menu info
    document.getElementById("menuName").value = menuName;
    document.getElementById("menuPrice").value = `IDR ${parseInt(
      menuPrice
    ).toLocaleString("id-ID")}`;
    document.getElementById("quantity").value = 1;

    // Clear form fields
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("notes").value = "";

    // Reset bill preview
    this.currentOrder = {
      menuName,
      menuPrice: parseInt(menuPrice),
    };

    this.updateBillPreview();

    // Show modal
    document.getElementById("orderModal").classList.add("show");
  }

  updateBillPreview() {
    if (!this.currentOrder) return;

    const qty = parseInt(document.getElementById("quantity").value) || 1;
    const customerName = document.getElementById("customerName").value || "-";
    const customerPhone = document.getElementById("customerPhone").value || "-";
    const notes = document.getElementById("notes").value || "-";
    const total = this.currentOrder.menuPrice * qty;

    // Update preview bill
    document.getElementById("billProduct").textContent =
      this.currentOrder.menuName;
    document.getElementById(
      "billPrice"
    ).textContent = `IDR ${this.currentOrder.menuPrice.toLocaleString(
      "id-ID"
    )}`;
    document.getElementById("billQty").textContent = `${qty}x`;
    document.getElementById(
      "billTotal"
    ).textContent = `IDR ${total.toLocaleString("id-ID")}`;
    document.getElementById("billCustomer").textContent = customerName;
    document.getElementById("billPhone").textContent = customerPhone;
    document.getElementById("billNotes").textContent = notes;
  }

  submitOrder() {
    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();

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
    const qty = parseInt(document.getElementById("quantity").value) || 1;
    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const notes = document.getElementById("notes").value || "-";
    const total = this.currentOrder.menuPrice * qty;

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

    // Update result bill
    document.getElementById("resultProduct").textContent =
      this.currentOrder.menuName;
    document.getElementById(
      "resultPrice"
    ).textContent = `IDR ${this.currentOrder.menuPrice.toLocaleString(
      "id-ID"
    )}`;
    document.getElementById("resultQty").textContent = `${qty}x`;
    document.getElementById(
      "resultTotal"
    ).textContent = `IDR ${total.toLocaleString("id-ID")}`;
    document.getElementById("resultCustomer").textContent = customerName;
    document.getElementById("resultPhone").textContent = customerPhone;
    document.getElementById("resultNotes").textContent = notes;
    document.getElementById("orderTime").textContent = dateTime;

    // Hide order modal, show bill modal
    document.getElementById("orderModal").classList.remove("show");
    document.getElementById("billModal").classList.add("show");
  }

  printBill() {
    const qty = parseInt(document.getElementById("quantity").value) || 1;
    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const notes = document.getElementById("notes").value || "-";
    const total = this.currentOrder.menuPrice * qty;

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
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { 
              font-weight: bold; 
              display: flex; 
              justify-content: space-between;
              margin: 10px 0;
              padding: 5px;
              background: #f0f0f0;
            }
            .footer { text-align: center; margin-top: 15px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">🍔 MAKANAN CEPAT SAJI 🍔</div>
            <div style="font-size: 12px; margin-top: 5px;">Terima kasih telah memesan</div>
          </div>
          
          <div class="item">
            <span>Produk:</span>
            <span>${this.currentOrder.menuName}</span>
          </div>
          <div class="item">
            <span>Harga:</span>
            <span>IDR ${this.currentOrder.menuPrice.toLocaleString(
              "id-ID"
            )}</span>
          </div>
          <div class="item">
            <span>Jumlah:</span>
            <span>${qty}x</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="total">
            <span>TOTAL:</span>
            <span>IDR ${total.toLocaleString("id-ID")}</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="item" style="margin-top: 10px;">
            <span><strong>Nama:</strong></span>
            <span>${customerName}</span>
          </div>
          <div class="item">
            <span><strong>No. HP:</strong></span>
            <span>${customerPhone}</span>
          </div>
          <div class="item">
            <span><strong>Catatan:</strong></span>
            <span>${notes}</span>
          </div>
          
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
document.addEventListener("DOMContentLoaded", () => {
  new OrderManager();
});
