const App = require("../models/app.models");

const app_config = async (key) => {

  const config = await App.Config.findOne({ where: { key }});

  switch (config.data_type) {
    case 'boolean':
      // Convierte a booleano (true para 'true', '1', 1; false para otros valores)
      if (typeof config.value === 'string') {
        config.value = config.value.toLowerCase();
      }
      return config.value === true || config.value === 'true' || config.value === '1' || config.value === 1;
    
    case 'number':
      // Convierte a número, retorna 0 si no es convertible
      const num = Number(config.value);
      return isNaN(num) ? 0 : num;
    
    case 'string':
      // Asegura que sea string
      return String(config.value);
    
    case 'json':
      try {
        // Intenta parsear JSON, si falla devuelve objeto vacío
        return typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return {};
      }
    
    case 'array':
      try {
        // Si es string, intenta parsear como array
        if (typeof config.value === 'string') {
          const parsed = JSON.parse(config.value);
          return Array.isArray(parsed) ? parsed : [parsed];
        }
        // Si ya es array, devuélvelo directamente
        return Array.isArray(config.value) ? config.value : [config.value];
      } catch (e) {
        // Si falla el parsing, crea array con el valor
        return [config.value];
      }
    
    default:
      return config.value;
  }
}

module.exports = app_config;