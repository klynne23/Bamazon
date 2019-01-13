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
    // if there are no errors with connection run the start function
    start();
}); // end connection.connect

function start() {
    // do a query for the products table to display info to the user
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var itemList = [];
        var itemIds = [];
        res.forEach(element => {
            itemList.push("#" + element.item_id + ": " + element.product_name + " ($" + element.price + ")");
            itemIds.push("" + element.item_id + "");
        }); // end .forEach

        console.log('\n' + "╭*******************************╮")
        console.log('| AVAILABLE ITEMS LISTED BY ID# |')
        console.log("╰*******************************╯" + '\n')
        console.log("-------------------------------");
        itemList.forEach(element => {
            console.log(element);
        }); // end .forEach
        console.log("----------------------------" + '\n');

        // prompt the user once the response is returned
        inquirer.prompt([
            {
                name: "itemId",
                type: "list",
                message: "Plese select the ID# of the item you would like to purchase",
                //****// small bug here, the list goes on infinitely, i tried every way possible to
                //****// build the itemIds array to avoid this but was unsuccesful
                choices: itemIds
            },
            {
                name: "numUnits",
                type: "input",
                message: "How many units would you like?",
                // handles if a string is entered or if nothing is entered
                validate: function validateNumUnits(name) {
                    if (name == '' || isNaN(name)) {
                        console.log('\n' + "Please enter the requested # of units");
                    }
                    else {
                        return name !== '';
                    }
                } // end validate
            } // end object of prompts
        ]) // end .prompt
            .then(function (answer) {
                // set up variables based on answer and query response
                var numUnits = parseInt(answer.numUnits);
                var itemIdInt = parseInt(answer.itemId);
                var price = res[(itemIdInt - 1)].price;
                var stock = res[(itemIdInt - 1)].stock_quantity;

                if (numUnits > stock) {
                    // display to the user the current amt of available items
                    console.log('\n' + "╭****************************╮")
                    console.log("| Insufficient item quantity |");
                    console.log("|     Units Available: " + stock);
                    console.log("╰****************************╯ \n")

                }
                else {
                    stockQuantity = (stock - numUnits);
                    stockQuantityString = ("" + (stock - numUnits) + "");
                    // console.log(stockQuantity);
                    // console.log(stockQuantityString);
                    // console.log(answer.itemId);
                    // console.log("Updated Stock: " + stockQuantity);

                    // whyyyy doessss thissss queryyyyyyy notttttt workkkkkkkkkkkk
                    connection.query(
                        // this command works in mysqlworkbench "UPDATE products SET stock_quantity=10 WHERE item_id=1;"
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: stockQuantityString
                            },
                            {
                                item_id: answer.itemId
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Stock updated successfully");
                        }
                    ) // end .query

                    // print out a receipt for the user 
                    console.log("-------------------------------");
                    console.log("╭*******************╮")
                    console.log('| ORDER INFORMATION |')
                    console.log("╰*******************╯")
                    console.log("-------------------------------");
                    console.log("Item: " + res[(itemIdInt - 1)].product_name);
                    console.log("Units Requested: " + (numUnits));
                    console.log("Price: $" + res[(itemIdInt - 1)].price + " (per item)");
                    console.log("----------------------------");
                    console.log("TOTAL PRICE: $" + (numUnits * price));
                    console.log("Units Remaining: " + stockQuantity + '\n');
                }// end else
            })// end .then
    }); // end .query
    connection.end();
} // end start function

