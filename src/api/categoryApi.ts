const API_BASE_URL = 'https://api.escuelajs.co/api/v1/categories';

export const fetchCategories = async () => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
