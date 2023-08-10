import axios from 'axios';
const BASE_URL = `https://pixabay.com/api/?key=${KEY}`;
const KEY = '38760294-50b199bb52bffa3fa55e924f9';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  get query() {
    return this.searchQuery;
  }
  
  async fetchLink() {
    const URL = `${BASE_URL}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    try {
      const response = await axios.get(URL);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log('Error fetching data:', error);
      throw error;
    }
  }
}
