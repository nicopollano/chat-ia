export const formatDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexed
    const year = today.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  export const formatHour = () => {
    const today = new Date();
    const hour = String(today.getHours()).padStart(2, '0');
    const minute = String(today.getMinutes()).padStart(2, '0'); // Los meses son 0-indexed
    const seconds = String(today.getSeconds()).padStart(2, '0');
    
    return `${hour}:${minute}:${seconds}`;
  };