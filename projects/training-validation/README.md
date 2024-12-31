# Training vs. Validation Metrics Visualization

An interactive D3.js visualization tool for comparing training and validation metrics across epochs. This tool helps in identifying patterns like overfitting and underfitting in machine learning model training.

## Features

- Interactive line chart comparing training and validation metrics
- Hover tooltips showing exact metric values
- File upload support for custom datasets
- Responsive design with clear data visualization
- Sample data included for testing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Local Development

1. Clone the repository:
```bash
git clone [repository-url]
cd comparison-training-validation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. The build output will be in the `dist` directory, which can be deployed to any static hosting service.

## Using Sample Data

A sample dataset (`public/sample-data.json`) is included in the project. This dataset demonstrates a typical training scenario where:
- Training metrics steadily improve
- Validation metrics initially improve but then plateau or degrade
- Clear visualization of potential overfitting

Sample data format:
```json
[
  { "epoch": 1, "training": 0.95, "validation": 0.88 },
  { "epoch": 2, "training": 0.85, "validation": 0.82 }
]
```

To use your own data:
1. Prepare a JSON file following the same format
2. Click "Upload JSON Data" in the application
3. Select your JSON file

## Project Structure

```
comparison-training-validation/
├── src/
│   ├── App.tsx           # Main application component
│   └── App.css           # Styles
├── public/
│   └── sample-data.json  # Sample dataset
└── package.json          # Project dependencies
```

## Troubleshooting

1. If the chart doesn't render:
   - Ensure your JSON data follows the correct format
   - Check browser console for any errors
   - Verify that the file upload was successful

2. If labels are cut off:
   - Try resizing your browser window
   - Check if you're using the latest version

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.
