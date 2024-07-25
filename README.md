# DIGIPIN App

## Demo

Demo Link: [https://digipin.netlify.app](https://digipin.netlify.app)

## Description

The DIGIPIN (Digital Postal Index Number) App is a web application that allows users to find the DIGIPIN for any location in India. This app uses Mapbox for map visualization and the DIGIPIN calculation algorithm provided by India Post.

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

