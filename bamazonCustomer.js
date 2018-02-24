var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  queryAllProducts();

 // queryDanceSongs();

});


  


function queryAllProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("ID\tProduct\t\tDept.\t\tPrice\tStock Quantity")
    for (var i = 0; i < res.length; i++) {
      console.log("\n"+res[i].item_id + " \t| " +res[i].product_name + "  \t|" + res[i].department_name + " \t| " + res[i].price + " \t| "  + res[i].stock_quantity);
    }
    console.log("----------------------------------------------------------------");
  start();
  });

  
}
 

function start(){
inquirer
  .prompt([
    // Here we create a basic text prompt.
    
    {
      type: "list",
      message: "Whats the id of the number you would like to buy",
      choices: ["1", "2", "3","4","5", "6","7","8", "9", "10"],
      name: "shoppersAnswer"
    },
    {
      type: "input",
      message: "How many?",
      name: "quantity"
    },

    // Here we ask the user to confirm.
    {
      type: "confirm",
      message: "Are you sure:",
      name: "confirm",
      default: true
    }
  ])
  .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.confirm) {
      console.log("\nRetrieving ID:  " + inquirerResponse.shoppersAnswer + " \tQuantity: " + inquirerResponse.quantity+ "\n");
    
    queryCustomerSelection(inquirerResponse.shoppersAnswer,inquirerResponse.quantity);
    
    }
    else {
      console.log("\nThat's okay \n");
    }
  });
} 



function queryCustomerSelection(shoppersAnswer, quantity) {

  var query = connection.query("SELECT * FROM products WHERE item_id=?", [shoppersAnswer], function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("\n"+res[i].item_id + " \t| " +res[i].product_name + "  \t|" + res[i].department_name + " \t| " + res[i].price + " \t| "  + res[i].stock_quantity);
         if(quantity>res[i]){
          console.log("We have the amount you are asking for in stock!")
         }
         else{
          console.log("Insufficient Quantity!");
         }
    }


  });

  // logs the actual query being run
  console.log(query.sql);
}
