import dayjs from 'dayjs';

// Función para agrupar los usuarios por mes (usaremos createdAt)
export const groupByMonth = (users, dateField = 'createdAt') => {
    const monthlyCounts = {};
  
    users.forEach(user => {
      const date = dayjs(Number(user[dateField]));
  
      if (date.isValid()) {
        const month = date.format('MMMM');
        
        if (!monthlyCounts[month]) {
          monthlyCounts[month] = 0;
        }
  
        monthlyCounts[month]++;
      }
    });
  
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    return months.map(month => monthlyCounts[month] || 0);
};

// Nueva función para agrupar por los últimos 7 días
export const groupByLast7Days = (users, dateField = 'createdAt') => {
    const dailyCounts = {};

    // Inicializamos un array con los últimos 7 días
    const last7Days = [...Array(7)].map((_, i) => dayjs().subtract(i, 'day').format('YYYY-MM-DD')).reverse();

    users.forEach(user => {
        const date = dayjs(Number(user[dateField])).format('YYYY-MM-DD');
        
        if (last7Days.includes(date)) {
            if (!dailyCounts[date]) {
                dailyCounts[date] = 0;
            }
            dailyCounts[date]++;
        }
    });

    return last7Days.map(day => dailyCounts[day] || 0);
};
