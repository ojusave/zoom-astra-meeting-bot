function getDateRange(months = 6) {
    const end = new Date();
    const start = new Date(end);
    start.setMonth(start.getMonth() - months);
  
    const dateRanges = [];
    let currentDate = new Date(start);
  
    while (currentDate < end) {
      let rangeEnd = new Date(currentDate);
      rangeEnd.setDate(rangeEnd.getDate() + 29); // 30-day range (0-29)
  
      if (rangeEnd > end) {
        rangeEnd = new Date(end);
      }
  
      dateRanges.push({
        from: currentDate.toISOString().split('T')[0],
        to: rangeEnd.toISOString().split('T')[0]
      });
  
      currentDate = new Date(rangeEnd);
      currentDate.setDate(currentDate.getDate() + 1); // Start next range from the next day
    }
  
    return dateRanges;
  }
  
  module.exports = { getDateRange };