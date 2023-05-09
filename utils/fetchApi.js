import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

// const RAPID_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY;

export const fetchApi = async (url) => {

  const { data } = await axios.get((url), {
    headers: {
      'x-rapidapi-host': 'bayut.p.rapidapi.com',
      'x-rapidapi-key': '4a3aa53a53mshaa468e9cb8a8a8ap1583c6jsn046bbba396d7',
    },
  });

  return data;
}