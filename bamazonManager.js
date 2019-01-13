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
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  


//****************************************//
// FUNCTIONS FOR EACH POSSIBLE USER INPUT //
//****************************************//


//*****************//
// INQUIRER PROMPT //
//*****************//

function start(){
    inquirer.prompt({
        name: "userSelection",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    })
    .then(function(answer){
        switchFunction(answer.userSelection);
    });
} // end function start()



//*****************//
// SWITCH FUNCTION //
//*****************//

var switchFunction = (userSelection) => {
    switch (userSelection) {
        case "View Products for Sale":
        // call related function
        console.log("list all items \n");
        start();
        break;
        case "View Low Inventory":
        // call related function
        console.log("list all items with an inventory count lower than five \n");
        start();
        break;
        case "Add to Inventory":
        // call related function
        console.log("prompt to add more inventory to an item \n");
        start();
        break;
        case "Add New Product":
        // call related function
        console.log("Add a new product to the store \n");
        start();
        break;
        case "Quit":
        connection.end();
        console.log("Bye! \n");

    } // end switch (userSelection)
}// end switchFunction
