/**
 * The Logger service is the standard way to log output for debugging in Apps Script.
 * To view logs, run the function and then go to "View" > "Logs" in the script editor.
 */
function demonstrateLogging() {
  const simpleText = "Hello, World!";
  const number = 42;
  const anArray = ['a', 'b', 'c'];

  // Log a simple string
  Logger.log(simpleText);

  // Log a number
  Logger.log(number);

  // You can use string formatting, similar to C's printf
  Logger.log("The answer is %s.", number);
  
  // Log an array
  Logger.log(anArray); // This will log the array contents

  // Log an object
  const anObject = { name: "John Doe", role: "Developer" };
  Logger.log(anObject); // Objects are not fully expanded, use JSON.stringify for details
  
  Logger.log("Detailed Object: %s", JSON.stringify(anObject, null, 2));
}