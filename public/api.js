const apiUrl = 'https://backend-edicionesalmeyda-production.up.railway.app';

export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${apiUrl}/${endpoint}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};

