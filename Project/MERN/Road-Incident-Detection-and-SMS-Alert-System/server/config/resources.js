// In a production system, this data should be stored in a database
// or a secure configuration management tool, not in a source file.

const RESOURCE_RECEIVERS = {
    "Ambulance": [process.env.AMBULANCE_NUMBER_1],
    "Fire Truck": [process.env.FIRE_TRUCK_NUMBER_1, process.env.FIRE_TRUCK_NUMBER_2],
    "Police": [process.env.POLICE_NUMBER_1, process.env.POLICE_NUMBER_2],
};

function getReceiversForResources(resources = []) {
    const numbers = new Set();
    resources.forEach(resource => {
        const resourceNumbers = RESOURCE_RECEIVERS[resource];
        if (resourceNumbers) {
            resourceNumbers.forEach(num => { if (num) numbers.add(num) });
        }
    });
    return Array.from(numbers);
}

module.exports = { getReceiversForResources };