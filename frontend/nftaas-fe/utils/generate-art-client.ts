import axios from 'axios';

const generateArtClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_GENERATE_ART_URL,
});

export default generateArtClient