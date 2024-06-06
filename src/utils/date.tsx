function generateDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

const getMonthInfo = (date: Date): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = monthNames[date.getMonth()];

  return month;
};

function formatDate(date: Date, partial?: boolean): string {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const day = date.getUTCDate().toString().padStart(2, "0");
  return partial ? `${year}-${month}-${day}` : `${year}-${month}-${day}T00:00Z`;
}

export { getMonthInfo, formatDate, generateDatesBetween };
