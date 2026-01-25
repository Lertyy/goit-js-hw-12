import axios from 'axios';

const PIXABAY_API_KEY =
  import.meta.env.VITE_PIXABAY_KEY || '54322887-b96a62a676a9ab44083e67caf';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: PIXABAY_API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
