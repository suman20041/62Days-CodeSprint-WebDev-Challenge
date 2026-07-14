/**
 * The Properties Service lets you store simple data in key-value pairs scoped to
 * one script, one user of a script, or one document that uses an add-on.
 */

function demonstratePropertiesService() {
  // Get the script properties store. This is shared by all users of the script.
  const scriptProperties = PropertiesService.getScriptProperties();

  // --- Storing Data ---
  scriptProperties.setProperty('API_KEY', '123-abc-456-def');
  scriptProperties.setProperty('LAST_RUN_TIMESTAMP', new Date().toUTCString());
  
  // You can also store multiple properties at once.
  scriptProperties.setProperties({
    'USERNAME': 'admin',
    'MODE': 'production'
  });

  Logger.log("Properties have been set.");

  // --- Retrieving Data ---
  const apiKey = scriptProperties.getProperty('API_KEY');
  Logger.log("Retrieved API Key: " + apiKey);

  const allProperties = scriptProperties.getProperties();
  Logger.log("All stored properties:");
  for (const key in allProperties) {
    Logger.log(`  ${key}: ${allProperties[key]}`);
  }

  // --- Deleting Data ---
  scriptProperties.deleteProperty('MODE');
  Logger.log("Property 'MODE' has been deleted.");

  // To delete all properties in the store:
  // scriptProperties.deleteAllProperties();
  // Logger.log("All script properties deleted.");
}