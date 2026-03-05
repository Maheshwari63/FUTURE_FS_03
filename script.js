// Shopping Cart System
let cart = [];

// Smooth scrolling
document.querySelectorAll('nav a, .btn').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    const menuCard = this.closest('.menu-card');
    const itemName = menuCard.dataset.item;
    const price = parseInt(menuCard.dataset.price);
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name: itemName, price: price, quantity: 1 });
    }
    
    updateCart();
    showNotification(`${itemName} added to cart!`);
  });
});

// Update cart display
function updateCart() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty</p>';
    cartTotal.textContent = '0';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} x${item.quantity}</span>
      <span>₹${item.price * item.quantity}</span>
      <button onclick="removeFromCart('${item.name}')">Remove</button>
    </div>
  `).join('');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total;
}

// Remove item from cart
function removeFromCart(itemName) {
  cart = cart.filter(item => item.name !== itemName);
  updateCart();
}

// Place order
document.getElementById('place-order').addEventListener('click', function() {
  const name = document.getElementById('customer-name').value;
  const phone = document.getElementById('customer-phone').value;
  const orderType = document.getElementById('order-type').value;
  const address = document.getElementById('delivery-address').value;
  
  if (cart.length === 0) {
    alert('Please add items to cart first!');
    return;
  }
  
  if (!name || !phone) {
    alert('Please enter your name and phone number!');
    return;
  }
  
  if (orderType === 'delivery' && !address) {
    alert('Please enter delivery address!');
    return;
  }
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? 50 : 0;
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee;
  
  const orderDetails = {
    customer: name,
    phone: phone,
    items: cart.map(item => `${item.name} x${item.quantity}`).join(', '),
    totalItems: totalItems,
    orderType: orderType === 'delivery' ? 'Delivery' : 'Pickup',
    total: total,
    orderId: 'SPG' + Date.now().toString().slice(-6)
  };
  
  // Show success message
  document.getElementById('order-success').innerHTML = `
    <div>
      <h4>✅ Order Placed Successfully!</h4>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Total:</strong> ₹${orderDetails.total}</p>
      <p><strong>Items:</strong> ${orderDetails.items}</p>
      <p>We'll call you on ${orderDetails.phone} to confirm!</p>
    </div>
  `;
  document.getElementById('order-success').style.display = 'block';
  
  // Scroll to success message
  document.getElementById('order-success').scrollIntoView({ behavior: 'smooth' });
  
  // Reset form and cart
  document.querySelector('.order-form').reset();
  cart = [];
  updateCart();
});

// Booking form (existing)
const bookingForm = document.getElementById('bookingForm');
const confirmation = document.getElementById('confirmation');

bookingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const seats = document.getElementById('seats').value;
  
  confirmation.textContent = `🎉 Thank you, ${name}! Your table for ${seats} seat(s) on ${date} at ${time} has been booked successfully!`;
  confirmation.style.display = 'block';
  confirmation.scrollIntoView({ behavior: 'smooth' });
  
  bookingForm.reset();
});

// Notification
function showNotification(message) {
  // Simple notification - you can enhance this
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; 
    background: var(--spice-orange); color: white; 
    padding: 1rem 2rem; border-radius: 10px; 
    z-index: 10000; font-weight: bold;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
