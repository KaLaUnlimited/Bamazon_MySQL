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
   //   console.log("\nRetrieving ID:  " + inquirerResponse.shoppersAnswer + " \tQuantity: " + inquirerResponse.quantity+ "\n");
    
    queryCustomerSelection(inquirerResponse.shoppersAnswer,inquirerResponse.quantity);
    
    }
    else {
      console.log("\nThat's okay \n");
    }
  });
} 



function queryCustomerSelection(shoppersAnswer, quantity) {
var total=0;
  var query = connection.query("SELECT * FROM products WHERE item_id=?", [shoppersAnswer], function(err, res) {
    
    for (var i = 0; i < res.length; i++) {
         if(quantity<res[i].stock_quantity){
          console.log("\nWe have the amount you are asking for in stock!")

          console.log("\nID\tProduct\t\tDept.\t\tPrice\tStock Quantity\n"+res[i].item_id + " \t| " +res[i].product_name + "  \t|" + res[i].department_name + " \t| " + res[i].price + " \t| "  + res[i].stock_quantity);
      
              var newQuantity=res[i].stock_quantity-quantity;
               total+=res[i].price *quantity;
            console.log("\nRetrieving " +  res[i].product_name+ " at quantity: " + quantity+ ".\t Your total cost is : " + total);
            updateProduct(res[i].item_id, newQuantity,res[i].product_name);
           
              queryAllProducts();
         }
         else{
          console.log("Insufficient Quantity!\nPlease choose another item:\n");
          start();
         }
    }


  });

  // logs the actual query being run
 // console.log(query.sql);
}


function updateProduct(id, newQuantity, product) {
  console.log("\n\nUpdating " + product+ " quantities...");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: id
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      //deleteProduct();
    }
  );

  // logs the actual query being run
 // console.log(query.sql);
}