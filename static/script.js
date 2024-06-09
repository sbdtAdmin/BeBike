document.getElementById('orderForm').addEventListener('submit', function(event) {
  event.preventDefault();
  let orderType = document.getElementById('orderType').value;
  if (orderType === 'Другое') {
    orderType = document.getElementById('otherType').value;
  }
  const order = {
    clientName: document.getElementById('clientName').value,
    clientPhone: document.getElementById('clientPhone').value || '',
    problemDescription: document.getElementById('problemDescription').value || '',
    orderType: orderType,
    status: 'בהמתנה'
  };

  // שליחת ההזמנה לשרת
  fetch('/add_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      addOrderToTable(order);
    } else {
      alert('שגיאה בהוספת ההזמנה');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

  // ניקוי הטופס
  event.target.reset();
  document.getElementById('otherType').style.display = 'none';
});

document.getElementById('orderType').addEventListener('change', function() {
  if (this.value === 'Другое') {
    document.getElementById('otherType').style.display = 'block';
  } else {
    document.getElementById('otherType').style.display = 'none';
  }
});

function addOrderToTable(order) {
  const ordersTable = document.getElementById('ordersTable');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${order.clientName}</td>
    <td>${order.clientPhone}</td>
    <td>${order.problemDescription}</td>
    <td>${order.orderType}</td>
    <td>${order.status}</td>
    <td>
      <button class="btn btn-success btn-sm" onclick="completeOrder(this)">סיים תיקון</button>
      <button class="btn btn-danger btn-sm" onclick="deleteOrder(this)">מחק הזמנה</button>
    </td>
  `;
  ordersTable.appendChild(row);
}

function addCompletedOrderToTable(order) {
  const completedOrdersTable = document.getElementById('completedOrdersTable');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${order.clientName}</td>
    <td>${order.clientPhone}</td>
    <td>${order.problemDescription}</td>
    <td>${order.orderType}</td>
    <td>${order.status}</td>
    <td>
      <button class="btn btn-danger btn-sm" onclick="deleteCompletedOrder(this)">מחק הזמנה</button>
    </td>
  `;
  completedOrdersTable.appendChild(row);
}

function completeOrder(button) {
  const row = button.closest('tr');
  const clientPhone = row.cells[1].innerText;
  const orderType = row.cells[3].innerText;

  fetch('/complete_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: clientPhone, orderType: orderType }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert(`נשלחה הודעה ללקוח בטלפון: ${clientPhone} לגבי סוג: ${orderType}`);
      const order = {
        clientName: row.cells[0].innerText,
        clientPhone: row.cells[1].innerText,
        problemDescription: row.cells[2].innerText,
        orderType: row.cells[3].innerText,
        status: 'הושלם'
      };
      addCompletedOrderToTable(order);
      row.remove();
    } else {
      alert(`שגיאה: ${data.message}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function deleteOrder(button) {
  const row = button.closest('tr');
  const clientPhone = row.cells[1].innerText;

  fetch('/delete_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: clientPhone }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      row.remove();
    } else {
      alert(`שגיאה: ${data.message}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function deleteCompletedOrder(button) {
  const row = button.closest('tr');
  const clientPhone = row.cells[1].innerText;

  fetch('/delete_completed_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: clientPhone }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      row.remove();
    } else {
      alert(`שגיאה: ${data.message}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function clearOrders() {
  fetch('/clear_orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      document.getElementById('ordersTable').innerHTML = '';
    } else {
      alert(`שגיאה: ${data.message}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function clearCompletedOrders() {
  fetch('/clear_completed_orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      document.getElementById('completedOrdersTable').innerHTML = '';
    } else {
      alert(`שגיאה: ${data.message}`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// טעינת הזמנות קיימות בעת טעינת העמוד
document.addEventListener('DOMContentLoaded', function() {
  fetch('/get_orders')
  .then(response => response.json())
  .then(orders => {
    orders.forEach(order => {
      addOrderToTable(order);
    });
  });

  fetch('/get_completed_orders')
  .then(response => response.json())
  .then(orders => {
    orders.forEach(order => {
      addCompletedOrderToTable(order);
    });
  });
});
