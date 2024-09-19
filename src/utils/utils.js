import dayjs from 'dayjs';

// Función para agrupar los usuarios por mes (usaremos createdAt)
export const groupByMonth = (users, dateField = 'createdAt') => {
    const monthlyCounts = {};
  
    // Recorremos todos los usuarios
    users.forEach(user => {
      const date = dayjs(Number(user[dateField]));
  
      // Si la fecha es válida, tomamos el mes y el año
      if (date.isValid()) {
        const month = date.format('MMMM'); // Formato del mes en texto completo
        
        // Si el mes no está en el objeto, lo inicializamos en 0
        if (!monthlyCounts[month]) {
          monthlyCounts[month] = 0;
        }
  
        // Incrementamos el conteo de usuarios en ese mes
        monthlyCounts[month]++;
      }
    });
  
    // Creamos un array con todos los meses del año
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Devolvemos un array con el conteo de cada mes, o 0 si no hay datos para ese mes
    return months.map(month => monthlyCounts[month] || 0);
  };
  