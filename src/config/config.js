const config = {
  apiUrl: process.env.NODE_ENV === 'development' ? 'your_api_localhost' : 'your_production_api_host',
  url: process.env.NODE_ENV === 'development' ? 'your_localhost' : 'your_production_host',
}

export default config;
