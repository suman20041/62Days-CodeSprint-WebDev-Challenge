const twilio = require('twilio');
const { getReceiversForResources } = require('../config/resources');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromNumber = process.env.TWILIO_FROM_NUMBER;

async function sendSmsAlerts(incidentData) {
    const body_text = `RESQ ALERT\nIncident: ${incidentData.incident_type}\nLocation: ${incidentData.location_gps}\nReport: ${incidentData.final_report}`;

    // SECURITY: Look up numbers on the backend based on resources needed.
    // Do not trust numbers sent from the client.
    const numbersToSendTo = getReceiversForResources(incidentData.resources_needed);

    if (numbersToSendTo.length === 0) {
        console.log("Dispatch requested, but no receivers configured for resources:", incidentData.resources_needed);
        return [{ status: 'skipped', reason: 'No configured receivers for required resources.' }];
    }

    const messagePromises = numbersToSendTo.map(number => {
        // Basic E.164 format validation
        if (!number || !/^(\+)[1-9][0-9]{9,14}$/.test(number)) {
            console.error(`Invalid phone number format in config: ${number}. Skipping.`);
            return Promise.resolve({ status: 'error', to: number, reason: 'Invalid phone number format in config.' });
        }
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
             console.error(`Twilio credentials not set. Cannot send SMS.`);
             return Promise.resolve({ status: 'error', to: number, reason: 'Twilio credentials not configured on server.' });
        }
        return client.messages.create({
            body: body_text,
            from: fromNumber,
            to: number
        })
        .then(message => ({ status: 'success', to: number, sid: message.sid }))
        .catch(err => ({ status: 'error', to: number, reason: err.message }));
    });

    const results = await Promise.all(messagePromises);
    console.log('Dispatch results:', results);
    return results;
}

module.exports = { sendSmsAlerts };