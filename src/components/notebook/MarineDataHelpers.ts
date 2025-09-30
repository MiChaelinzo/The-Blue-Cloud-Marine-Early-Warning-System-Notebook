// Marine Data Analysis Helper Functions for Blue-Cloud Notebooks

export interface OceanographicData {
  temperature: number[];
  salinity: number[];
  depth: number[];
  coordinates: { lat: number; lon: number };
  timestamp: Date[];
}

export interface SpeciesObservation {
  species: string;
  count: number;
  coordinates: { lat: number; lon: number };
  depth: number;
  timestamp: Date;
}

export interface VesselTrackingData {
  vesselId: string;
  coordinates: { lat: number; lon: number };
  speed: number;
  heading: number;
  timestamp: Date;
}

export class MarineDataAnalyzer {
  /**
   * Calculate temperature gradient from oceanographic data
   */
  static calculateTemperatureGradient(data: OceanographicData): number[] {
    const gradients: number[] = [];
    for (let i = 1; i < data.temperature.length; i++) {
      const tempDiff = data.temperature[i] - data.temperature[i - 1];
      const depthDiff = data.depth[i] - data.depth[i - 1];
      gradients.push(depthDiff !== 0 ? tempDiff / depthDiff : 0);
    }
    return gradients;
  }

  /**
   * Calculate thermocline depth (depth of maximum temperature gradient)
   */
  static findThermoclineDepth(data: OceanographicData): number {
    const gradients = this.calculateTemperatureGradient(data);
    const maxGradientIndex = gradients.indexOf(Math.min(...gradients));
    return data.depth[maxGradientIndex + 1] || 0;
  }

  /**
   * Calculate water density using UNESCO equation of state
   */
  static calculateDensity(temperature: number, salinity: number, pressure: number = 0): number {
    // Simplified UNESCO equation for seawater density
    const t = temperature;
    const s = salinity;
    const p = pressure;
    
    // Pure water density at atmospheric pressure
    const rho0 = 999.842594 + 6.793952e-2 * t - 9.095290e-3 * t * t + 1.001685e-4 * t * t * t;
    
    // Salinity contribution
    const a = 8.24493e-1 - 4.0899e-3 * t + 7.6438e-5 * t * t - 8.2467e-7 * t * t * t + 5.3875e-9 * t * t * t * t;
    const b = -5.72466e-3 + 1.0227e-4 * t - 1.6546e-6 * t * t;
    const c = 4.8314e-4;
    
    const rho = rho0 + a * s + b * s * Math.sqrt(s) + c * s * s;
    
    // Pressure correction (simplified)
    const pressureCorrection = 1 + p * 4.5e-6;
    
    return rho * pressureCorrection;
  }

  /**
   * Calculate species diversity index (Shannon-Weaver)
   */
  static calculateShannonDiversity(observations: SpeciesObservation[]): number {
    const speciesCounts = new Map<string, number>();
    let totalCount = 0;

    // Count species occurrences
    observations.forEach(obs => {
      const current = speciesCounts.get(obs.species) || 0;
      speciesCounts.set(obs.species, current + obs.count);
      totalCount += obs.count;
    });

    // Calculate Shannon diversity index
    let diversity = 0;
    speciesCounts.forEach(count => {
      const proportion = count / totalCount;
      if (proportion > 0) {
        diversity -= proportion * Math.log(proportion);
      }
    });

    return diversity;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  static calculateDistance(
    coord1: { lat: number; lon: number },
    coord2: { lat: number; lon: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLon = this.toRadians(coord2.lon - coord1.lon);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Analyze vessel trajectory for potential oil spill risk
   */
  static analyzeOilSpillRisk(vesselData: VesselTrackingData[]): {
    riskScore: number;
    riskFactors: string[];
  } {
    let riskScore = 0;
    const riskFactors: string[] = [];

    if (vesselData.length < 2) {
      return { riskScore: 0, riskFactors: ['Insufficient data'] };
    }

    // Check for sudden speed changes
    for (let i = 1; i < vesselData.length; i++) {
      const speedChange = Math.abs(vesselData[i].speed - vesselData[i - 1].speed);
      if (speedChange > 5) { // Sudden speed change > 5 knots
        riskScore += 10;
        riskFactors.push('Sudden speed change detected');
        break;
      }
    }

    // Check for erratic course changes
    for (let i = 1; i < vesselData.length; i++) {
      const headingChange = Math.abs(vesselData[i].heading - vesselData[i - 1].heading);
      const normalizedChange = Math.min(headingChange, 360 - headingChange);
      if (normalizedChange > 45) { // Course change > 45 degrees
        riskScore += 15;
        riskFactors.push('Erratic course changes detected');
        break;
      }
    }

    // Check for proximity to sensitive areas (simplified)
    const sensitiveAreas = [
      { lat: 60.0, lon: -3.0, name: 'North Sea Protected Area' },
      { lat: 43.5, lon: -8.0, name: 'Bay of Biscay Marine Park' }
    ];

    vesselData.forEach(point => {
      sensitiveAreas.forEach(area => {
        const distance = this.calculateDistance(point.coordinates, area);
        if (distance < 50) { // Within 50km of sensitive area
          riskScore += 20;
          riskFactors.push(`Near sensitive area: ${area.name}`);
        }
      });
    });

    return { riskScore: Math.min(riskScore, 100), riskFactors };
  }

  /**
   * Generate sample oceanographic data for testing
   */
  static generateSampleOceanData(depth: number = 100): OceanographicData {
    const depths = Array.from({ length: 11 }, (_, i) => i * (depth / 10));
    const temperatures = depths.map(d => 20 - (d * 0.1) + Math.random() * 2 - 1);
    const salinities = depths.map(() => 35 + Math.random() * 0.5 - 0.25);
    const timestamps = depths.map(() => new Date());

    return {
      temperature: temperatures,
      salinity: salinities,
      depth: depths,
      coordinates: { lat: 45.0 + Math.random() * 10, lon: -10.0 + Math.random() * 20 },
      timestamp: timestamps
    };
  }

  /**
   * Generate sample species observation data
   */
  static generateSampleSpeciesData(count: number = 10): SpeciesObservation[] {
    const species = ['Cod', 'Haddock', 'Herring', 'Mackerel', 'Tuna', 'Sardine', 'Anchovy'];
    const observations: SpeciesObservation[] = [];

    for (let i = 0; i < count; i++) {
      observations.push({
        species: species[Math.floor(Math.random() * species.length)],
        count: Math.floor(Math.random() * 50) + 1,
        coordinates: {
          lat: 45.0 + Math.random() * 10,
          lon: -10.0 + Math.random() * 20
        },
        depth: Math.random() * 200,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    return observations;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Global helper functions for notebook use
export const marineHelpers = {
  // Quick access to common functions
  calculateDensity: MarineDataAnalyzer.calculateDensity,
  calculateDistance: MarineDataAnalyzer.calculateDistance,
  calculateShannonDiversity: MarineDataAnalyzer.calculateShannonDiversity,
  findThermoclineDepth: MarineDataAnalyzer.findThermoclineDepth,
  analyzeOilSpillRisk: MarineDataAnalyzer.analyzeOilSpillRisk,
  
  // Sample data generators
  generateOceanData: MarineDataAnalyzer.generateSampleOceanData,
  generateSpeciesData: MarineDataAnalyzer.generateSampleSpeciesData,
  
  // Utility functions
  formatCoordinates: (coord: { lat: number; lon: number }) => 
    `${coord.lat.toFixed(4)}°N, ${Math.abs(coord.lon).toFixed(4)}°${coord.lon >= 0 ? 'E' : 'W'}`,
  
  formatDepth: (depth: number) => `${depth.toFixed(1)}m`,
  
  formatTemperature: (temp: number) => `${temp.toFixed(2)}°C`,
  
  formatSalinity: (salinity: number) => `${salinity.toFixed(2)} PSU`
};