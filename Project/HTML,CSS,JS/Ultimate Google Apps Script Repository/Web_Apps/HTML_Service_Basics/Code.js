/**
 * This is the server-side code for a basic web app.
 * The doGet(e) function is a special function that runs when a user visits the web app's URL.
 * It must return an HtmlOutput object.
 *
 * TO DEPLOY:
 * 1. In the script editor, click "Deploy" > "New deployment".
 * 2. Select "Web app" as the deployment type.
 * 3. In the configuration:
 *    - Give it a description.
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (for a public app) or "Anyone within [Your Domain]"
 * 4. Click "Deploy". You will get a URL for your web app.
 */
function doGet(e) {
  // `createHtmlOutputFromFile` serves the content of an HTML file.
  // The filename corresponds to a .html file in your Apps Script project.
  return HtmlService.createHtmlOutputFromFile('Index');
}