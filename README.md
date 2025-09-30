# 🌊 Blue-Cloud Marine Notebook - Complete Setup & Usage Guide

## Overview

The Blue-Cloud Marine Notebook is a web-based interactive data analysis environment designed specifically for marine researchers, oceanographers, and environmental scientists. It provides a Jupyter-like experience with built-in marine data analysis capabilities, running entirely in your browser.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MiChaelinzo/The-Blue-Cloud-Marine-Early-Warning-System.git
   cd The-Blue-Cloud-Marine-Early-Warning-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open your browser to `http://localhost:5173`
   - Login with demo credentials: `demo@blue-cloud.org` / `demo123`
   - Click the "Notebook" tab in the navigation

## 📊 Using the Notebook

### Creating Your First Notebook

1. **Create a new notebook:**
   - Click the "+" button in the sidebar
   - Enter a descriptive name (e.g., "Ocean Temperature Analysis")
   - Click "Create"

2. **Understanding the interface:**
   - **Left Sidebar**: Notebook list and management
   - **Main Area**: Notebook editor with cells
   - **Cell Types**: Code (JavaScript) and Markdown (documentation)

3. **Working with cells:**
   - **Run Code**: Click "Run" button or press `Shift + Enter`
   - **Add Cells**: Use "Add Code Cell" or "Add Markdown Cell" buttons
   - **Move Cells**: Use up/down arrows in cell toolbar
   - **Delete Cells**: Click trash icon (requires confirmation)

### Built-in Marine Analysis Functions

Every notebook comes pre-loaded with marine data analysis functions:

```javascript
// 🌊 Oceanographic Analysis
const oceanData = generateOceanData(100); // Generate 100m depth profile
const thermoclineDepth = findThermoclineDepth(oceanData);
const density = calculateDensity(15.5, 35.2, 0); // temp, salinity, pressure

// 🐟 Species Analysis
const speciesData = generateSpeciesData(20); // Generate 20 observations
const diversity = calculateShannonDiversity(speciesData);

// 📏 Spatial Calculations
const distance = calculateDistance(
  { lat: 45.0, lon: -2.0 }, 
  { lat: 46.0, lon: -1.0 }
); // Returns distance in km

// 🛢️ Risk Assessment
const vesselTrack = [/* vessel tracking data */];
const riskAssessment = analyzeOilSpillRisk(vesselTrack);
```

## 🐍 Python/Jupyter Integration

### Exporting to Jupyter Notebooks

1. **Export as JSON:**
   - Click "Export" → "JSON Format"
   - Use the conversion script below to convert to `.ipynb`

2. **Conversion Script (Python):**
   ```python
   import json
   import nbformat as nbf
   
   def convert_bluecloud_to_jupyter(json_file, output_file):
       """Convert Blue-Cloud notebook JSON to Jupyter .ipynb format"""
       
       with open(json_file, 'r') as f:
           notebook_data = json.load(f)
       
       # Create new Jupyter notebook
       nb = nbf.v4.new_notebook()
       nb.metadata.title = notebook_data['name']
       
       # Convert cells
       for cell in notebook_data['cells']:
           if cell['type'] == 'code':
               # Convert JavaScript to Python comments for manual conversion
               content = f"# Original JavaScript code:\n# {cell['content'].replace(chr(10), chr(10) + '# ')}\n\n# TODO: Convert to Python"
               nb_cell = nbf.v4.new_code_cell(content)
               
               # Add output if exists
               if 'output' in cell and cell['output']:
                   nb_cell.outputs = [nbf.v4.new_output(
                       output_type='stream',
                       name='stdout',
                       text=cell['output']['content']
                   )]
           
           elif cell['type'] == 'markdown':
               nb_cell = nbf.v4.new_markdown_cell(cell['content'])
           
           nb.cells.append(nb_cell)
       
       # Save as .ipynb
       with open(output_file, 'w') as f:
           nbf.write(nb, f)
       
       print(f"Converted {json_file} to {output_file}")
   
   # Usage
   convert_bluecloud_to_jupyter('my_notebook.json', 'my_notebook.ipynb')
   ```

### Python Marine Analysis Equivalent

Install required packages:
```bash
pip install numpy pandas matplotlib seaborn gsw geopy
```

Python equivalent functions:
```python
import numpy as np
import pandas as pd
import gsw  # Gibbs SeaWater package for oceanographic calculations
from geopy.distance import geodesic
from scipy.stats import entropy

class MarineAnalyzer:
    @staticmethod
    def calculate_density(temperature, salinity, pressure=0):
        """Calculate seawater density using GSW library"""
        return gsw.rho(salinity, temperature, pressure)
    
    @staticmethod
    def find_thermocline_depth(temperature, depth):
        """Find thermocline depth from temperature gradient"""
        gradients = np.gradient(temperature, depth)
        thermocline_idx = np.argmin(gradients)
        return depth[thermocline_idx]
    
    @staticmethod
    def calculate_shannon_diversity(species_counts):
        """Calculate Shannon diversity index"""
        proportions = species_counts / np.sum(species_counts)
        return entropy(proportions, base=np.e)
    
    @staticmethod
    def calculate_distance(coord1, coord2):
        """Calculate distance between coordinates"""
        return geodesic(coord1, coord2).kilometers

# Example usage
analyzer = MarineAnalyzer()
density = analyzer.calculate_density(15.5, 35.2, 0)
print(f"Water density: {density:.2f} kg/m³")
```

## 🌐 Deployment Options

### 1. Local Development
```bash
npm run dev  # Development server with hot reload
```

### 2. Production Build
```bash
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### 3. Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t blue-cloud-notebook .
docker run -p 8080:80 blue-cloud-notebook
```

### 4. Cloud Deployment

#### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
# Environment variables: None required
```

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🔧 Configuration & Customization

### Environment Variables
Create `.env` file:
```env
VITE_BLUE_CLOUD_API_BASE=https://api.blue-cloud.org
VITE_BLUE_CLOUD_TOKEN=your_api_token_here
VITE_COPERNICUS_MARINE_API=https://marine.copernicus.eu/api
VITE_EMODNET_API=https://www.emodnet.eu/api
```

### Custom Marine Functions
Add your own analysis functions in `src/components/notebook/MarineDataHelpers.ts`:

```typescript
export class CustomMarineAnalyzer extends MarineDataAnalyzer {
  static calculateChlorophyll(fluorescence: number[], depth: number[]): number[] {
    // Your custom chlorophyll calculation
    return fluorescence.map((f, i) => f * Math.exp(-depth[i] * 0.1));
  }
  
  static detectAlgalBloom(chlorophyll: number[], threshold: number = 5.0): boolean {
    return Math.max(...chlorophyll) > threshold;
  }
}
```

## 📱 Mobile & Tablet Usage

The notebook is fully responsive and works on mobile devices:

- **Touch-friendly interface**: Large buttons and touch targets
- **Responsive layout**: Adapts to different screen sizes
- **Mobile code editing**: Optimized Monaco Editor for mobile
- **Gesture support**: Swipe and pinch gestures where appropriate

### Mobile-specific features:
- Collapsible sidebar on small screens
- Touch-optimized cell controls
- Simplified toolbar for mobile
- Auto-hide line numbers on small screens

## 🔍 Troubleshooting

### Common Issues

**1. Notebook not loading:**
```bash
# Clear browser cache and localStorage
localStorage.clear();
location.reload();
```

**2. Code execution errors:**
```javascript
// Check browser console for detailed error messages
// Ensure code syntax is correct JavaScript
```

**3. Performance issues:**
```javascript
// For large datasets, process in smaller chunks
const processInChunks = (data, chunkSize = 1000) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
};
```

**4. Storage quota exceeded:**
```bash
# Export important notebooks and delete old ones
# Or use browser's developer tools to clear storage
```

### Debug Mode
Enable debug logging:
```javascript
// In browser console
localStorage.setItem('notebook-debug', 'true');
location.reload();
```

## 🧪 Testing & Development

### Running Tests
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run lint        # Check code quality
```

### Development Workflow
1. **Feature Development**: Create feature branch
2. **Testing**: Add tests for new functionality
3. **Documentation**: Update README and inline docs
4. **Code Review**: Submit pull request
5. **Deployment**: Merge to main branch

## 📚 API Reference

### Notebook Storage API
```javascript
// Create notebook
const notebook = NotebookStorage.createNotebook("My Analysis");

// Save notebook
NotebookStorage.save({ notebooks: {...}, activeNotebookId: "..." });

// Load notebooks
const storage = NotebookStorage.load();

// Export notebook
const content = NotebookStorage.exportNotebook(notebook, 'json');
```

### Marine Analysis API
```javascript
// All functions available in notebook execution context
const functions = [
  'calculateDensity',
  'findThermoclineDepth', 
  'calculateShannonDiversity',
  'calculateDistance',
  'analyzeOilSpillRisk',
  'generateOceanData',
  'generateSpeciesData'
];
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open pull request**

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure responsive design
- Test on multiple browsers

## 📄 License

This project is licensed under the EPL-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Blue-Cloud Project**: Marine data infrastructure
- **Copernicus Marine Service**: Oceanographic data
- **EMODnet**: European marine data network
- **Monaco Editor**: Code editing capabilities
- **React Ecosystem**: UI framework and tools

## 📞 Support

- **Documentation**: Check this README and inline help
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join Blue-Cloud community discussions
- **Email**: Contact project maintainers

---

**Happy Marine Data Analysis! 🌊🔬📊**
