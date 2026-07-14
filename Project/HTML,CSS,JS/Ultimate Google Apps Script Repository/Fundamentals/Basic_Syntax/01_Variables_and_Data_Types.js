/**
 * This function demonstrates variables and data types in Google Apps Script.
 * Apps Script is based on JavaScript 1.6, with some features from 1.7 and 1.8.
 */
function demonstrateVariablesAndDataTypes() {
  // VARIABLES
  // 'var' is function-scoped.
  var oldVariable = "I'm old school.";

  // 'let' is block-scoped. It can be reassigned.
  let modernVariable = "I can change.";
  modernVariable = "See? I changed.";

  // 'const' is block-scoped. It cannot be reassigned.
  const constantVariable = "I am constant.";

  // DATA TYPES
  
  // String
  let myName = "Gemini Code Assist";
  Logger.log("String: " + myName);

  // Number (both integers and floating-point)
  let myAge = 1;
  let pi = 3.14159;
  Logger.log("Number (Integer): " + myAge);
  Logger.log("Number (Float): " + pi);

  // Boolean
  let isHelpful = true;
  Logger.log("Boolean: " + isHelpful);

  // Array
  let googleProducts = ["Sheets", "Docs", "Slides", "Forms"];
  Logger.log("Array: " + googleProducts[0]); // Accessing the first element

  // Object
  let myScript = {
    name: "Automation Script",
    version: "1.0",
    author: "You"
  };
  Logger.log("Object: " + myScript.name);
  
  // Null and Undefined
  let nothing = null;
  let notAssigned;
  Logger.log("Null: " + nothing);
  Logger.log("Undefined: " + notAssigned);
}