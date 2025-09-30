# Blue-Cloud Marine Notebook

## Overview

The Blue-Cloud Marine Notebook is an interactive data analysis environment specifically designed for marine researchers and oceanographers. It provides a Jupyter-like experience with built-in marine data analysis capabilities.

## Features

### 🌊 Core Notebook Features
- **Interactive Code Cells**: Execute JavaScript code with real-time output
- **Markdown Documentation**: Rich text formatting for research documentation
- **Auto-save**: Automatic saving of notebook changes
- **Export Options**: Export notebooks as JSON or Markdown
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🐟 Marine Data Analysis Tools

The notebook comes with pre-loaded marine analysis functions:

#### Oceanographic Analysis
- `calculateDensity(temperature, salinity, pressure)` - Calculate seawater density
- `findThermoclineDepth(oceanData)` - Find thermocline depth from temperature profile
- `calculateTemperatureGradient(oceanData)` - Calculate temperature gradients

#### Species Analysis
- `calculateShannonDiversity(observations)` - Calculate Shannon diversity index
- `generateSpeciesData(count)` - Generate sample species observation data

#### Spatial Analysis
- `calculateDistance(coord1, coord2)` - Calculate distance between coordinates using Haversine formula

#### Risk Assessment
- `analyzeOilSpillRisk(vesselData)` - Analyze vessel trajectories for oil spill risk

#### Data Generation
- `generateOceanData(depth)` - Generate realistic oceanographic profiles
- `generateSpeciesData(count)` - Generate sample species observations

## Usage Examples

### Basic Oceanographic Analysis
```javascript
// Generate sample data
const oceanProfile = generateOceanData(100); // 100m depth

// Find thermocline
const thermoclineDepth = findThermoclineDepth(oceanProfile);
console.log("Thermocline at:", thermoclineDepth, "meters");

// Calculate density
const density = calculateDensity(15.5, 35.2, 0);
console.log("Water density:", density, "kg/m³");
```

### Species Diversity Analysis
```javascript
// Generate species observations
const observations = generateSpeciesData(20);

// Calculate diversity
const diversity = calculateShannonDiversity(observations);
console.log("Shannon Diversity Index:", diversity);
```

### Oil Spill Risk Assessment
```javascript
// Vessel tracking data
const vesselTrack = [
  { vesselId: "SHIP_001", coordinates: { lat: 60.0, lon: -3.0 }, speed: 12, heading: 45, timestamp: new Date() },
  // ... more tracking points
];

// Analyze risk
const risk = analyzeOilSpillRisk(vesselTrack);
console.log("Risk Score:", risk.riskScore);
console.log("Risk Factors:", risk.riskFactors);
```

## Keyboard Shortcuts

- **Shift + Enter**: Execute current cell and move to next
- **Ctrl/Cmd + S**: Save notebook
- **Tab**: Indent in markdown cells

## Data Formats

### Oceanographic Data Structure
```javascript
{
  temperature: number[],    // Temperature values in °C
  salinity: number[],       // Salinity values in PSU
  depth: number[],          // Depth values in meters
  coordinates: { lat: number, lon: number },
  timestamp: Date[]
}
```

### Species Observation Structure
```javascript
{
  species: string,          // Species name
  count: number,           // Number of individuals observed
  coordinates: { lat: number, lon: number },
  depth: number,           // Observation depth in meters
  timestamp: Date
}
```

### Vessel Tracking Structure
```javascript
{
  vesselId: string,        // Unique vessel identifier
  coordinates: { lat: number, lon: number },
  speed: number,           // Speed in knots
  heading: number,         // Heading in degrees (0-360)
  timestamp: Date
}
```

## Integration with Blue-Cloud Services

The notebook is designed to work with Blue-Cloud VLabs and can be extended to integrate with:

- **Copernicus Marine Service**: Real-time oceanographic data
- **EMODnet Biology**: Species occurrence data
- **AIS Vessel Tracking**: Real-time vessel positions
- **Blue-Cloud VLabs**: Computational resources and datasets

## Best Practices

1. **Document Your Analysis**: Use markdown cells to explain your methodology
2. **Modular Code**: Break complex analysis into smaller, reusable functions
3. **Data Validation**: Always validate input data before analysis
4. **Error Handling**: Use try-catch blocks for robust analysis
5. **Export Results**: Save important findings using the export feature

## Troubleshooting

### Common Issues

**Code not executing**: Check for syntax errors in the console
**Slow performance**: Large datasets may take time to process
**Storage full**: Export and delete old notebooks to free space

### Performance Tips

- Use smaller datasets for initial testing
- Break large analyses into smaller cells
- Clear outputs of completed cells to save memory

## Contributing

The notebook system is part of the Blue-Cloud Marine Early Warning System. For contributions or issues, please refer to the main project repository.

## License

This project is part of the Blue-Cloud ecosystem and follows the project's licensing terms.