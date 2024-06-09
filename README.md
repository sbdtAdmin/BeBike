

This project is a bicycle repair management system built using Flask for the backend and Bootstrap for the frontend. The system allows users to add, view, and manage bicycle repair orders.

## Features

- Add new repair orders with customer name, phone, problem description, and type of vehicle.
- View current and completed repair orders.
- Complete orders and move them to the completed orders table.
- Delete individual orders from both current and completed orders.
- Clear all orders from both current and completed orders.

## Prerequisites

- Python 3.x
- Flask
- Bootstrap (included via CDN)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/sbdtAdmin/BeBike.git
    cd bike-repair-management
    ```

2. Create a virtual environment and activate it:
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

3. Install the required packages:
    ```sh
    pip install -r r.txt
    ```

## Running the Application

1. Start the Flask server:
    ```sh
    python main.py
    ```

2. Open your web browser and go to `http://127.0.0.1:5000`.

## Project Structure

- `main.py` - The main Flask server script.
- `templates/BeBike.html` - The main HTML template.
- `static/script.js` - JavaScript file for client-side functionality.
- `static/style.css` - CSS file for styling.

## Usage

### Adding a New Order

1. Fill in the customer name, phone, problem description, and select the type of vehicle.
2. If "Другое" (Other) is selected, an additional input field will appear to specify the type.
3. Click "הוסף הזמנה" (Add Order) to add the order to the current orders table.

### Managing Orders

- **Complete Order**: Click the "סיים תיקון" (Complete Repair) button to move the order to the completed orders table and send a notification.
- **Delete Order**: Click the "מחק הזמנה" (Delete Order) button to remove the order from the table.

### Clearing Orders

- **Clear Current Orders**: Click the "איפוס הזמנות" (Clear Orders) button to remove all orders from the current orders table.
- **Clear Completed Orders**: Click the "איפוס הזמנות שהושלמו" (Clear Completed Orders) button to remove all orders from the completed orders table.

## Customization

- **Notification System**: Modify the `send_notifications` function in `main.py` to integrate with your preferred SMS or email notification service.
- **Styling**: Update `static/style.css` to change the appearance of the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [Bootstrap](https://getbootstrap.com/)
