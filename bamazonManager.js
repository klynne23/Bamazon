// Require mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection information for the sql database
var connection = mysql.createConnection({

    host: "localhost",
    //your port
    port: 3306,
    // your username
    user: "root",
    // your password
    password: "",
    database: "bamazon_db"

}); // end connection


// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});



//****************************************//
// FUNCTIONS FOR EACH POSSIBLE USER INPUT //
//****************************************//

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // create an array to hold our formatted res data and loop through the res data
        var products = [];
        res.forEach(element => {
            products.push("ID#: " + element.item_id + " | Product Name: " + element.product_name + " | Price: $" + element.price + " | Quantity: " + element.stock_quantity);
        }); // end .forEach

        // display the items
        console.log('\n');
        console.log('《 ALL AVAILABLE PRODUCTS 》');
        console.log(" -------------------------" + '\n');
        products.forEach(element => {
            console.log(element);
        }); // end .forEach
        console.log('\n');
        start();
    }); // end .query
} // end viewProductsFunction

function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // parse each product quantity
        var quantities = [];
        res.forEach(element => {
            quantities.push(parseInt(element.stock_quantity));
        }); // end .forEach

        console.log('\n');
        console.log('《 ALL PRODUCTS WITH LOW INVENTORY 》');
        console.log(" ----------------------------------" + '\n');

        var counter = 0;
        quantities.forEach(element => {
            if (element < 10) {
                console.log("ID#: " + res[counter].item_id + " | Product Name: " + res[counter].product_name + " | Price: $" + res[counter].price + " | Quantity: " + res[counter].stock_quantity);
            }
            counter++;
        }); // end .forEach
        console.log('\n');
        start();
    }); // end .queru
} // end viewLowInventory

function addInventory() {
    // do a query for the products table to display all data
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var itemList = [];
        var itemIds = [];
        res.forEach(element => {
            itemList.push("ID#: " + element.item_id + " | Product Name: " + element.product_name + " | Quantity: " + element.stock_quantity);
            itemIds.push("" + element.item_id + "");
        });// end .forEach  

        console.log('\n');
        console.log('《 ALL AVAILABLE PRODUCTS 》');
        console.log(" -------------------------" + '\n');
        itemList.forEach(element => {
            console.log(element);
        }); // end .forEach
        console.log("----------------------------" + '\n');

        // prompt user once the response is returned
        inquirer.prompt([
            {
                name: "itemId",
                type: "list",
                message: "Plese select the ID# of the item you would like to add Inventory to",
                //****// small bug here, the list goes on infinitely, i tried every way possible to
                //****// build the itemIds array to avoid this but was unsuccesful
                choices: itemIds
            },
            {
                name: "numUnits",
                type: "input",
                message: "How many units would you like to add?",
                // handles if a string is entered or if nothing is entered
                validate: function validateNumUnits(name) {
                    if (name == '' || isNaN(name)) {
                        console.log('\n' + "Please enter the # of units to add");
                    }
                    else {
                        return name !== '';
                    }
                } // end validate
            } // end object of prompts
        ]) // end .prompt
            .then(function (answer) {
                var itemIdInt = parseInt(answer.itemId);
                var numUnits = parseInt(answer.numUnits);
                var newStock = ((res[(itemIdInt - 1)].stock_quantity) + numUnits);
                // console.log(newStock);

                //try to update the database
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                        stock_quantity: newStock
                    },
                    {
                        item_id: answer.itemId
                    }],
                    function (err) {
                        if (err) throw err;
                        // print out a receipt for the user 
                        console.log('\n');
                        console.log('《 UPDATE INFORMATION 》');
                        console.log(" ---------------------" + '\n');
                        console.log("Item: " + res[(itemIdInt - 1)].product_name);
                        console.log("Units Added: " + (answer.numUnits));
                        console.log("Total Units: " + newStock + '\n');
                        start();
                    }
                );// end connection.query
            }) // end .then
    }); // end connection.query
} // end addInventory

function addProduct() {
    console.log("Add a new product to the store \n");
    // prompt for info about the item being added
    inquirer.prompt([
        {
            name: "itemName",
            type: "input",
            message: "What is the name of the item you would like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "What department would you like to place this item into?"
        },
        {
            name: "price",
            type: "input",
            message: "What price would you like this item to have?",
            // validate that the input is a number
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            } // end validate
        },
        {
            name: "stock",
            type: "input",
            message: "How much stock of this item is available?",
            // validate that the input is a number
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }// end array object of answers
    ])// end .prompt
        .then(function (answer) {
            // when prompting is finished insert the item into the db
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.itemName,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log('\n');
                    console.log('《 NEW ITEM INFORMATION 》');
                    console.log(" -----------------------" + '\n');
                    console.log("Item: " + answer.itemName);
                    console.log("Department: " + answer.department);
                    console.log("Item Price: $" + answer.price);
                    console.log("Item Stock Quantity: " + answer.stock + '\n');
                    start();
                }
            ); // end .query
        }); // end .then
} // end addProduct


//*****************//
// SWITCH FUNCTION //
//*****************//

var switchFunction = (userSelection) => {
    switch (userSelection) {
        case "View Products for Sale":
            // call related function
            viewProducts();
            break;
        case "View Low Inventory":
            // call related function
            viewLowInventory();
            break;
        case "Add to Inventory":
            // call related function
            addInventory();
            break;
        case "Add New Product":
            // call related function
            addProduct();
            break;
        case "Quit":
            connection.end();
            console.log("Bye! \n");

    } // end switch (userSelection)
}// end switchFunction


//*****************//
// INQUIRER PROMPT //
//*****************//

function start() {
    inquirer.prompt({
        name: "userSelection",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    })
        .then(function (answer) {
            switchFunction(answer.userSelection);
        });
} // end function start()

