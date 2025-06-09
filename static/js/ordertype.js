 document.addEventListener("DOMContentLoaded", () => {
      const modal = document.getElementById("order-context-modal");
      const orderType = document.getElementById("order-type");
      const confirmBtn = document.getElementById("confirm-order-context");
      const extraFields = document.getElementById("extra-fields");

      orderType.addEventListener("change", () => {
        const type = orderType.value;
        extraFields.innerHTML = "";
        extraFields.classList.remove("hidden");

        if (type === "eat-in") {
  let tableOptions = "";
  for (let i = 1; i <= 10; i++) {
    tableOptions += `<option value="${i}">Table ${i}</option>`;
  }
  extraFields.innerHTML = `
    <label class="block text-left mb-1">Table Number:</label>
    <select id="table-number" class="w-full border p-2 rounded">
      <option disabled selected value="">Select a table</option>
      ${tableOptions}
    </select>`;
}
 else if (type === "takeaway") {
          extraFields.innerHTML = `
            <label class="block text-left mb-1">Your Name:</label>
            <input type="text" id="customer-name" class="w-full border p-2 rounded">`;
        } else if (type === "delivery") {
          extraFields.innerHTML = `
            <label class="block text-left mb-1">Delivery Address:</label>
            <input type="text" id="delivery-address" class="w-full border p-2 rounded mb-2">
            <label class="block text-left mb-1">Contact Number:</label>
            <input type="text" id="delivery-phone" class="w-full border p-2 rounded">`;
        }
      });

      confirmBtn.addEventListener("click", () => {
        const type = orderType.value;
        const data = { type };

        if (type === "eat-in") {
          data.table = document.getElementById("table-number").value;
        } else if (type === "takeaway") {
          data.name = document.getElementById("customer-name").value;
        } else if (type === "delivery") {
          data.address = document.getElementById("delivery-address").value;
          data.phone = document.getElementById("delivery-phone").value;
        }

        sessionStorage.setItem("order_context", JSON.stringify(data));
        modal.classList.add("hidden");
        displayOrderStatus();
      });

      if (!sessionStorage.getItem("order_context")) {
        modal.classList.remove("hidden");
      } else {
        displayOrderStatus();
      }

      document.getElementById("call-waiter-btn").addEventListener("click", () => {
        fetch("/call_waiter", { method: "POST" });
        alert("A waiter has been notified. Thank you!");
      });

      // Function to display order status on top of the menu
      function displayOrderStatus() {
        const context = JSON.parse(sessionStorage.getItem("order_context"));
        const statusDiv = document.getElementById("order-status");

        if (!context || !statusDiv) return;

        let statusText = "Order Type: ";

        if (context.type === "eat-in") {
          statusText += `Eat-in at Table ${context.table || "?"}`;
        } else if (context.type === "takeaway") {
          statusText += `Takeaway for ${context.name || "?"}`;
        } else if (context.type === "delivery") {
          statusText += `Delivery to ${context.address || "?"}`;
        } else {
          statusText += "Not Specified";
        }

        statusDiv.textContent = statusText;
      }
    });
