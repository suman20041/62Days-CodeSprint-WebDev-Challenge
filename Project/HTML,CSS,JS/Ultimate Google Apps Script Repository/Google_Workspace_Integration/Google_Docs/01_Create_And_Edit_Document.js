/**
 * This script demonstrates how to create a new Google Document and add content to it.
 * To run this, you will need to grant the script permission to manage your Google Docs.
 */
function createAndEditDocument() {
  // Create a new Google Document with a specific name.
  const doc = DocumentApp.create('My First Apps Script Document');
  Logger.log(`Document created: ${doc.getUrl()}`);

  // Get the body of the document to add content.
  const body = doc.getBody();

  // Add a paragraph with some text.
  body.appendParagraph('Hello, Google Docs!');

  // Add a heading.
  body.appendParagraph('This is a Heading')
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);

  // Add a list item.
  body.appendListItem('First list item.');
  body.appendListItem('Second list item.');

  // Add a horizontal rule as a separator.
  body.appendHorizontalRule();

  // Add a table.
  const tableData = [
    ['Column 1', 'Column 2'],
    ['Cell A2', 'Cell B2'],
    ['Cell A3', 'Cell B3']
  ];
  body.appendTable(tableData);

  // Save and close the document to ensure all changes are written.
  doc.saveAndClose();
  
  Logger.log('Content added to the document.');
}