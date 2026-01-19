// Function to format date: "Monday, 20 January 2026"
export const dateBuilder = (d) => {
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Function to format time: "6:30 AM"
export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Function to get short day name: "Mon", "Tue"
export const getDayName = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: 'short' });
};

// Function to convert temperature based on Unit
export const getTemp = (tempInC, unit) => {
  if (unit === 'C') return `${tempInC.toFixed()}°`;
  const tempInF = (tempInC * 9/5) + 32;
  return `${tempInF.toFixed()}°`;
};