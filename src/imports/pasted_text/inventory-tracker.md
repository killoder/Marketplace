Create a modern responsive web app for a single user to track buying and selling of photography and electronics gear.

The app is a personal inventory and profit tracker for items like drones, cameras, lenses, batteries, ND filters, gimbals, microphones, and accessories.

Goal:
Help the user record purchases, extra costs, sales, stock, and profit in a very clear and practical way.

Platform:
Responsive web app, desktop-first but mobile-friendly.
Clean, modern, minimal interface.
Designed for personal internal use, not a marketplace.
Professional dashboard style.
Use a compact, data-focused layout with clear hierarchy.

Main sections:
1. Dashboard
2. Inventory
3. Item Details
4. Sales
5. Reports

Dashboard requirements:
- Show summary cards for:
  - Total spent
  - Total revenue
  - Total profit
  - Items in stock
  - Stock value
  - Sold items
- Show recent purchases
- Show recent sales
- Show top profit items
- Show a monthly profit chart

Inventory page requirements:
- Main data table of all items
- Columns:
  - Item name
  - Category
  - Brand / Model
  - Condition
  - Purchase date
  - Total cost
  - Expected sell price
  - Actual sell price
  - Profit
  - Status
- Filters:
  - status
  - category
  - brand
  - date range
- Search bar
- Button to add new item
- Quick actions for edit, mark as sold, view details

Item Details page requirements:
- Full item information
- Cost breakdown section
- Expenses list
- Sale information
- Profit calculation card
- Notes section
- Optional image area for item photo
- Clear status badge such as In Stock, Sold, Reserved

Sales flow:
- Simple form to mark an item as sold
- Fields:
  - sale price
  - sale date
  - platform
  - shipping cost
  - payment fee
  - other fee
  - notes
- Automatically show net revenue and final profit

Reports page requirements:
- Monthly profit overview
- Spending by month
- Revenue by month
- Profit by category
- Inventory aging / unsold items
- Best and worst deals

Data model logic to reflect in UI:
- Each item can have multiple expenses
- Expenses can include:
  - purchase
  - travel
  - shipping
  - repair
  - parts
  - other
- Total cost = sum of all item expenses
- Net revenue = sale price minus fees and shipping
- Profit = net revenue minus total cost

Suggested categories:
- Camera
- Lens
- Drone
- Battery
- Filter
- Gimbal
- Microphone
- Light
- Accessory
- Other

Design direction:
- Modern, elegant, slightly premium
- Inspired by admin dashboards and inventory tools
- Neutral palette, subtle contrast, clean spacing
- Clear cards, structured tables, strong readability
- Minimal visual noise
- Use good empty states
- Make tables feel practical and professional
- Use charts that are simple and readable
- Add polished modal or side-panel forms for adding/editing items

Important:
- This is a personal productivity tool, not an ecommerce site
- Focus on usability, clarity, and fast data entry
- Avoid unnecessary social, marketplace, or multi-user features
- Make the dashboard and inventory page the strongest screens