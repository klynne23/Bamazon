
# Bamazon


A node application with 2 views:

- Customer

- Manager

  

**video link to working demo: https://www.youtube.com/watch?v=H0McRenCHAE&feature=youtu.be**

  

# Program Guide

 

### Customer view: bamazonCustomer.js

* displays a list of all available products with Ids, Names and Prices

* User may then select the Id# of the product they would like to purchase

* User is then prompted to input their requested # of items

  

**then:**

  

* if the items are available the order goes through and the user is shown a receipt

* if the items are not available the order does not go through and the user is shown their requested item's current stock quantity

---

### Manager view: bamazonManager.js

-- 4 available functions

  

**View Products for Sale**

* displays all available products with Ids, Name, Price and Quantity

  

**View Low Inventory**

* displays all available products whose Quantity is less then 10 items

  

**Add Inventory**

* displays all available items with Ids, Name and Quantity

* user may then select the Id of the product they wish to add inventory to

* user then inputs the number of units to add to that products inventory

  

**Add Product**

* User will input the Product Name, Department, Price and Stock of the product to add to the database

  

**Quit**

* Will exit the program