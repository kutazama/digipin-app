# DIGIPIN App

## Description

The DIGIPIN (Digital Postal Index Number) App is a web application that allows users to find the DIGIPIN for any location in India. This app uses Mapbox for map visualization and the DIGIPIN calculation algorithm provided by India Post.

## Features

- Interactive map powered by Mapbox
- Search functionality for locations in India
- Geolocation support to find user's current location
- DIGIPIN calculation for any point on the map
- Satellite view toggle
- Copy-to-clipboard functionality for DIGIPIN

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- A Mapbox account and API token

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/digipin-app.git
   cd digipin-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Mapbox token:
   ```
   PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

## Usage

To run the app in development mode:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

To build the app for production:

```
npm run build
```

## Contributing

Contributions to the DIGIPIN App are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

- [India Post](https://www.indiapost.gov.in) for the DIGIPIN initiative
- [Mapbox](https://www.mapbox.com/) for their mapping services
- [Astro](https://astro.build/) for the web framework
- [React](https://reactjs.org/) for the UI library

## Contact

Project Link: [https://github.com/yourusername/digipin-app](https://github.com/yourusername/digipin-app)