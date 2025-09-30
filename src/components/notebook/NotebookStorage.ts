import { Notebook, NotebookStorage as INotebookStorage } from './types';

const NOTEBOOKS_KEY = 'blue-cloud-notebooks';
const ACTIVE_NOTEBOOK_KEY = 'blue-cloud-active-notebook';

export class NotebookStorage {
  static save(storage: INotebookStorage): void {
    try {
      localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(storage.notebooks));
      if (storage.activeNotebookId) {
        localStorage.setItem(ACTIVE_NOTEBOOK_KEY, storage.activeNotebookId);
      } else {
        localStorage.removeItem(ACTIVE_NOTEBOOK_KEY);
      }
    } catch (error) {
      console.error('Failed to save notebooks to localStorage:', error);
      // Fallback to sessionStorage if localStorage is full
      try {
        sessionStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(storage.notebooks));
        if (storage.activeNotebookId) {
          sessionStorage.setItem(ACTIVE_NOTEBOOK_KEY, storage.activeNotebookId);
        }
      } catch (sessionError) {
        console.error('Failed to save to sessionStorage as well:', sessionError);
        throw new Error('Unable to save notebooks - storage quota exceeded');
      }
    }
  }

  static load(): INotebookStorage {
    try {
      const notebooksData = localStorage.getItem(NOTEBOOKS_KEY) || sessionStorage.getItem(NOTEBOOKS_KEY);
      const activeNotebookId = localStorage.getItem(ACTIVE_NOTEBOOK_KEY) || sessionStorage.getItem(ACTIVE_NOTEBOOK_KEY);
      
      const notebooks = notebooksData ? JSON.parse(notebooksData) : {};
      
      // Convert date strings back to Date objects
      Object.values(notebooks).forEach((notebook: unknown) => {
        notebook.createdAt = new Date(notebook.createdAt);
        notebook.updatedAt = new Date(notebook.updatedAt);
      });

      return {
        notebooks,
        activeNotebookId
      };
    } catch (error) {
      console.error('Failed to load notebooks from storage:', error);
      return {
        notebooks: {},
        activeNotebookId: null
      };
    }
  }

  static setActiveNotebook(notebookId: string | null): void {
    try {
      if (notebookId) {
        localStorage.setItem(ACTIVE_NOTEBOOK_KEY, notebookId);
      } else {
        localStorage.removeItem(ACTIVE_NOTEBOOK_KEY);
      }
    } catch (error) {
      console.error('Failed to set active notebook:', error);
    }
  }

  static createNotebook(name: string): Notebook {
    const id = `notebook-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date();
    
    return {
      id,
      name: name || `Untitled Notebook ${new Date().toLocaleDateString()}`,
      cells: [
        {
          id: `cell-${Date.now()}`,
          type: 'markdown',
          content: '# Blue-Cloud Marine Analysis Notebook\n\nWelcome to your interactive marine data analysis environment! This notebook allows you to:\n\n- **Analyze oceanographic data** from Copernicus Marine Service\n- **Visualize species migration patterns** using EMODnet Biology data\n- **Process marine environmental data** with JavaScript\n- **Document your research** with markdown cells\n\n## Getting Started\n\nUse the code cells below to start your marine data analysis. You can execute JavaScript code and see the results immediately.',
          metadata: {}
        },
        {
          id: `cell-${Date.now() + 1}`,
          type: 'code',
          content: '// Welcome to Blue-Cloud Marine Analysis!\n// Marine data helpers are available for your analysis\n\n// Generate sample oceanographic data\nconst oceanData = {\n  temperature: [15.2, 16.1, 17.3, 18.5, 19.2],\n  salinity: [35.1, 35.3, 35.2, 35.4, 35.6],\n  depth: [0, 10, 20, 30, 40],\n  coordinates: { lat: 45.5, lon: -2.3 },\n  location: "North Atlantic"\n};\n\nconsole.log("🌊 Marine Data Analysis Started");\nconsole.log("📍 Location:", oceanData.location);\nconsole.log("🌡️ Temperature range:", Math.min(...oceanData.temperature), "°C to", Math.max(...oceanData.temperature), "°C");\nconsole.log("🧂 Average salinity:", (oceanData.salinity.reduce((a, b) => a + b) / oceanData.salinity.length).toFixed(2), "PSU");\n\n// Calculate water density at surface\nconst surfaceDensity = 999.842594 + 0.8 * oceanData.salinity[0];\nconsole.log("💧 Surface water density:", surfaceDensity.toFixed(2), "kg/m³");',
          metadata: {}
        },
        {
          id: `cell-${Date.now() + 2}`,
          type: 'code',
          content: '// 🧪 Advanced Marine Analysis with Built-in Helpers\n// The notebook provides marine analysis functions automatically!\n\n// Generate realistic oceanographic data\nconst sampleData = generateOceanData(50); // 50m depth profile\nconsole.log("📊 Generated oceanographic profile:");\nconsole.log("🌡️ Temperature range:", Math.min(...sampleData.temperature).toFixed(1), "to", Math.max(...sampleData.temperature).toFixed(1), "°C");\nconsole.log("🧂 Salinity range:", Math.min(...sampleData.salinity).toFixed(2), "to", Math.max(...sampleData.salinity).toFixed(2), "PSU");\nconsole.log("📍 Location:", sampleData.coordinates.lat.toFixed(2) + "°N, " + Math.abs(sampleData.coordinates.lon).toFixed(2) + "°W");\n\n// Find thermocline depth\nconst thermoclineDepth = findThermoclineDepth(sampleData);\nconsole.log("🌊 Thermocline depth:", thermoclineDepth.toFixed(1), "meters");\n\n// Calculate water density at different depths\nconst surfaceDensity = calculateDensity(sampleData.temperature[0], sampleData.salinity[0]);\nconst deepDensity = calculateDensity(sampleData.temperature[sampleData.temperature.length-1], sampleData.salinity[sampleData.salinity.length-1]);\nconsole.log("💧 Surface density:", surfaceDensity.toFixed(2), "kg/m³");\nconsole.log("💧 Deep water density:", deepDensity.toFixed(2), "kg/m³");',
          metadata: {}
        },
        {
          id: `cell-${Date.now() + 3}`,
          type: 'code',
          content: '// 🐟 Species Diversity Analysis\n// Generate sample species observation data\nconst speciesData = generateSpeciesData(15);\nconsole.log("🔬 Generated", speciesData.length, "species observations");\n\n// Calculate Shannon diversity index\nconst diversity = calculateShannonDiversity(speciesData);\nconsole.log("📈 Shannon Diversity Index:", diversity.toFixed(3));\n\n// Show species distribution\nconst speciesCounts = {};\nspeciesData.forEach(obs => {\n  speciesCounts[obs.species] = (speciesCounts[obs.species] || 0) + obs.count;\n});\n\nconsole.log("\\n🐠 Species Distribution:");\nObject.entries(speciesCounts)\n  .sort(([,a], [,b]) => b - a)\n  .forEach(([species, count]) => {\n    console.log(`  ${species}: ${count} individuals`);\n  });\n\n// Calculate distances between observation points\nif (speciesData.length >= 2) {\n  const distance = calculateDistance(\n    speciesData[0].coordinates, \n    speciesData[1].coordinates\n  );\n  console.log("\\n📏 Distance between first two observations:", distance.toFixed(2), "km");\n}',
          metadata: {}
        },
        {
          id: `cell-${Date.now() + 4}`,
          type: 'markdown',
          content: '## 🚢 Oil Spill Risk Assessment\n\nThe notebook includes advanced marine monitoring capabilities. Try the oil spill risk analysis below:',
          metadata: {}
        },
        {
          id: `cell-${Date.now() + 5}`,
          type: 'code',
          content: '// 🛢️ Oil Spill Risk Assessment Example\n// Simulate vessel tracking data with potential risk factors\nconst vesselTrack = [\n  { vesselId: "TANKER_001", coordinates: { lat: 60.1, lon: -3.2 }, speed: 12, heading: 45, timestamp: new Date() },\n  { vesselId: "TANKER_001", coordinates: { lat: 60.15, lon: -3.1 }, speed: 8, heading: 90, timestamp: new Date() },\n  { vesselId: "TANKER_001", coordinates: { lat: 60.2, lon: -3.0 }, speed: 15, heading: 135, timestamp: new Date() },\n  { vesselId: "TANKER_001", coordinates: { lat: 60.25, lon: -2.9 }, speed: 3, heading: 180, timestamp: new Date() }\n];\n\nconsole.log("🚢 Analyzing vessel trajectory for oil spill risk...");\nconst riskAssessment = analyzeOilSpillRisk(vesselTrack);\n\nconsole.log("\\n⚠️ Risk Assessment Results:");\nconsole.log("🎯 Risk Score:", riskAssessment.riskScore + "/100");\nconsole.log("📋 Risk Factors:");\nriskAssessment.riskFactors.forEach(factor => {\n  console.log("  • " + factor);\n});\n\nif (riskAssessment.riskScore > 30) {\n  console.log("\\n🚨 HIGH RISK: Immediate monitoring recommended!");\n} else if (riskAssessment.riskScore > 15) {\n  console.log("\\n⚡ MODERATE RISK: Continue surveillance");\n} else {\n  console.log("\\n✅ LOW RISK: Normal operations");\n}',
          metadata: {}
        }
      ],
      createdAt: now,
      updatedAt: now,
      metadata: {
        language: 'javascript',
        kernelName: 'javascript'
      }
    };
  }

  static exportNotebook(notebook: Notebook, format: 'json' | 'markdown'): string {
    if (format === 'json') {
      return JSON.stringify(notebook, null, 2);
    } else {
      // Export as markdown
      let markdown = `# ${notebook.name}\n\n`;
      markdown += `*Created: ${notebook.createdAt.toLocaleDateString()}*\n`;
      markdown += `*Updated: ${notebook.updatedAt.toLocaleDateString()}*\n\n`;
      
      notebook.cells.forEach((cell, index) => {
        if (cell.type === 'markdown') {
          markdown += `${cell.content}\n\n`;
        } else {
          markdown += `## Cell ${index + 1} (Code)\n\n`;
          markdown += `\`\`\`javascript\n${cell.content}\n\`\`\`\n\n`;
          if (cell.output) {
            markdown += `**Output:**\n\`\`\`\n${cell.output.content}\n\`\`\`\n\n`;
          }
        }
      });
      
      return markdown;
    }
  }

  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}