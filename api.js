// api.js
import axios from 'axios';

const API_URL = 'https://giamsatdn-gumq-gumqs-projects.vercel.app/data/?_vercel_share=EbSXF9WBOb9tVcify2GarGftOIRzCE76';

export const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

  