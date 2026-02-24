# Today's Exchange Rates in Japan

A currency exchange rate converter web app designed for iPad displays in stores. Converts Japanese Yen (JPY) to 8 major currencies with real-time exchange rates.

## Features

✅ **Real-time Exchange Rates** - Fetches latest rates from exchangerate-api.com  
✅ **8 Major Currencies** - USD, EUR, KRW, CNY, TWD, GBP, AUD, MYR  
✅ **Quick Select Buttons** - ¥10,000, ¥20,000, ¥30,000  
✅ **Custom Number Pad** - Easy input for any amount  
✅ **Auto-refresh** - Updates rates every 30 minutes  
✅ **iPad Optimized** - Large fonts for visibility from distance  
✅ **Kappodo Branding** - Subtle watermark logo  

## Technology Stack

- **Framework**: Expo (React Native for Web)
- **Styling**: React Native StyleSheet (no CSS frameworks)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Run Development Server

```bash
pnpm start
```

### Build for Web

```bash
pnpm build:web
```

Output will be in the `dist/` directory.

## Deployment

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Setup Instructions

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
   - Save

3. **Automatic Deployment**:
   - Every push to `main` branch triggers automatic deployment
   - Check the Actions tab to monitor deployment progress

4. **Access Your App**:
   - URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Project Structure

```
exchange-rates-japan-web/
├── app/
│   ├── _layout.tsx       # Root layout
│   └── index.tsx         # Main currency converter screen
├── assets/
│   ├── icon.png          # App icon
│   ├── splash.png        # Splash screen
│   ├── favicon.png       # Web favicon
│   └── kappodo-logo.png  # Watermark logo
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment workflow
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Currency Configuration

To add or modify currencies, edit the `CURRENCIES` array in `app/index.tsx`:

```typescript
const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  // Add more currencies here...
];
```

## API

Exchange rates are fetched from:
```
https://api.exchangerate-api.com/v4/latest/JPY
```

This is a free API with no authentication required.

## License

Private project for Kappodo.

## Author

Built with Manus AI
