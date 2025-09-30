# Blue-Cloud Marine Early Warning System

A comprehensive marine monitoring platform that integrates real Blue-Cloud VLabs data to provide early warnings for marine ecosystems, fisheries, and offshore operations.

## Features

### 🔐 Authentication & Authorization
- Blue-Cloud integrated login system
- Role-based access control (Researcher, Operator, Admin)
- Permission-based data access

### 🌊 Real Data Integration
- **Copernicus Marine Service**: Oceanographic data (temperature, salinity, currents)
- **EMODnet Biology**: Species observations and biodiversity data
- **AIS Vessel Tracking**: Ship movements for oil spill risk assessment
- **Weather Services**: Real-time meteorological and sea state data

### 📊 Monitoring Capabilities

#### Species Migration Tracking
- Real-time fish population monitoring using EMODnet Biology data
- Migration pattern analysis and fisheries impact assessment
- Integration with Blue-Cloud species observation networks

#### Oil Spill Risk Assessment
- Vessel tracking and trajectory modeling
- Marine Protected Area threat analysis
- Real-time risk scoring and response protocols

#### Aquaculture Monitoring
- Offshore farm environmental monitoring
- Invasive species detection and alerts
- Weather impact assessment for farm operations

#### Extreme Weather Alerts
- Copernicus Marine weather integration
- Storm tracking and impact forecasting
- Emergency response coordination

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Data Sources**: Blue-Cloud VLabs APIs
- **Authentication**: OAuth/OIDC integration ready

## Blue-Cloud Integration

### Data Sources
- **Copernicus Marine Environment Monitoring Service (CMEMS)**
- **European Marine Observation and Data Network (EMODnet)**
- **Blue-Cloud VLabs computational resources**
- **ARGO float network data**
- **Glider observation networks**

### API Endpoints
```
/copernicus/marine/oceanography - Ocean temperature, salinity, currents
/emodnet/biology/observations - Species occurrence data
/ais/vessel-tracking - Real-time vessel positions
/copernicus/marine/weather - Weather and sea state forecasts
/aquaculture/farms - Farm locations and environmental data
```

## Getting Started

### Prerequisites
- Node.js 18+
- Blue-Cloud API credentials

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file:
```env
VITE_BLUE_CLOUD_API_BASE=https://api.blue-cloud.org
VITE_BLUE_CLOUD_TOKEN=your_api_token_here
VITE_COPERNICUS_MARINE_API=https://marine.copernicus.eu/api
VITE_EMODnet_API=https://www.emodnet.eu/api
```

### Development
```bash
npm run dev
```

### Demo Credentials
- Email: `demo@blue-cloud.org`
- Password: `demo123`

## Data Flow

1. **Authentication**: Users authenticate via Blue-Cloud D4Science
2. **Dataset Discovery**: Search and access Blue-Cloud datasets via data portal
3. **Data Processing**: Analysis using VLabs computational environments
4. **Visualization**: Interactive dashboards and alert systems
5. **Research Output**: Generate insights and publish results

## Marine Use Cases

### Fisheries Management
- Track species migrations using Global Fisheries Atlas datasets
- Assess fishing quota impacts
- Monitor protected species using Blue-Cloud biological datasets

### Environmental Protection
- Oil spill risk assessment using vessel tracking datasets
- Marine Protected Area monitoring with integrated observations
- Ecosystem health assessment using Marine Environmental Indicators

### Offshore Operations
- Aquaculture monitoring using Blue-Cloud Aquaculture Monitor VLab
- Environmental impact assessment using coastal observation datasets
- Emergency response using integrated marine data sources

## Contributing

This project integrates with the Blue-Cloud ecosystem. For dataset access and VLabs integration:

1. **Register**: Visit [blue-cloud.org](https://blue-cloud.org) and create an account
2. **Access VLabs**: Login to [blue-cloud.d4science.org](https://blue-cloud.d4science.org/)
3. **Browse Datasets**: Explore [data.blue-cloud.org](https://data.blue-cloud.org/search)
4. **Download Data**: Access datasets from Zenodo Blue-Cloud community
5. **Integrate**: Configure environment variables for dataset access

## License

MIT License - Built for the Blue-Cloud Hackathon 2024

## Acknowledgments

- Blue-Cloud Project and VLabs infrastructure
- Copernicus Marine Environment Monitoring Service
- European Marine Observation and Data Network (EMODnet)
- European marine research community