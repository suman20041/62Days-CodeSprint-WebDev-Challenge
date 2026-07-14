/**
 * Server-side code for demonstrating client-server communication.
 */

/**
 * Serves the main HTML page for the web app.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Client-Server Communication');
}

/**
 * This is a server-side function that we will call from the client-side JavaScript.
 * It can take arguments and must return a value that can be serialized as JSON
 * (e.g., strings, numbers, arrays, objects). It cannot return complex Apps Script objects.
 *
 * @param {string} name The name sent from the client.
 * @return {string} A greeting message.
 */
function getServerGreeting(name) {
  Logger.log(`getServerGreeting was called with name: ${name}`);
  if (!name) {
    return "Hello, mysterious stranger!";
  }
  return `Hello, ${name}! Welcome from the server.`;
}