/**
 * This script demonstrates how to create an event in the user's default Google Calendar.
 */
function createCalendarEvent() {
  // Get the user's default calendar.
  const calendar = CalendarApp.getDefaultCalendar();
  
  // Define the event details.
  const title = 'Team Meeting';
  
  // Set the start and end times for the event.
  // Let's schedule it for tomorrow at 10 AM for one hour.
  const startTime = new Date();
  startTime.setDate(startTime.getDate() + 1); // Tomorrow
  startTime.setHours(10, 0, 0); // 10:00:00 AM
  
  const endTime = new Date(startTime.getTime());
  endTime.setHours(endTime.getHours() + 1); // 11:00:00 AM

  // Set event options, like description and guest list.
  const options = {
    description: 'Discuss project milestones for Q3.',
    location: 'Virtual (Google Meet)',
    guests: 'user1@example.com,user2@example.com', // Comma-separated list of guest emails
    sendInvites: true // Set to true to send invitations to guests.
  };

  try {
    // Create the event.
    const event = calendar.createEvent(title, startTime, endTime, options);
    Logger.log(`Event created successfully! Event ID: ${event.getId()}`);
    Logger.log(`View it here: ${event.getHtmlLink()}`);
  } catch (e) {
    Logger.log(`Error creating event: ${e.toString()}`);
  }
}