# LaunchPoint - NASA Space Explorer

**LaunchPoint** is a comprehensive web application that provides real-time access to NASA's space exploration data through an intuitive, interactive interface. Built with React and powered by NASA's public APIs, it offers educational content, live space data, and immersive 3D visualizations.

## Features

### Core Functionality
- **Astronomy Picture of the Day (APOD)**: Daily NASA space images with detailed descriptions
- **Mars Rover Photos**: Browse and filter Curiosity rover photos by camera type and Martian day
- **ISS Live Feed**: Real-time International Space Station video feed and telemetry
- **Launch Tracker**: Upcoming NASA launches and mission information
- **3D Solar System**: Interactive Three.js-powered solar system simulation
- **Space Timeline**: Historical space exploration milestones and events

### Interactive Features
- **Photo Filtering**: Filter Mars photos by camera type (MAST, NAVCAM, CHEMCAM, etc.)
- **Camera Information**: Educational content about Curiosity rover's camera systems
- **Photo Downloads**: Download high-resolution Mars photos
- **3D Controls**: Orbit, zoom, and focus on planets in the solar system
- **Real-time Data**: Live ISS tracking and launch schedule updates

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Chakra UI** - Component library for consistent, accessible UI
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions

### 3D Graphics
- **Three.js** - 3D graphics library for solar system simulation
- **Custom Orbit Controls** - Smooth camera controls for 3D navigation

### APIs & Data
- **NASA APIs** - APOD, Mars Photos, and other space data
- **ISS Tracking API** - Real-time International Space Station data
- **Launch Library API** - Space launch information

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Git** - Version control
- **Environment Variables** - Secure API key management

## Project Structure

```
LaunchPoint/
├── public/
│   ├── textures/          # Planet texture images
│   │   └── hal9000.png       # App icon
│   ├── skyBox/           # 3D skybox textures
│   └── hal9000.png       # App icon
├── src/
│   ├── components/       # Reusable React components
│   │   ├── ui/          # UI utility components
│   │   ├── MarsFeed.jsx # Mars photo display component
│   │   ├── Planet.jsx   # 3D planet class
│   │   ├── SolarSystemView.jsx # 3D solar system
│   │   └── Timeline.jsx # Space history timeline
│   ├── pages/           # Main application pages
│   │   ├── Home.jsx     # Landing page with APOD
│   │   ├── MarsPage.jsx # Mars photos page
│   │   ├── LaunchPage.jsx # Launch tracker
│   │   ├── issLive.jsx  # ISS live feed
│   │   └── SolarSimPage.jsx # 3D solar system page
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── theme.js         # Chakra UI theme configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **NASA API Key** ([Get one here](https://api.nasa.gov))

### Installation


1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_NASA_API_KEY=your_nasa_api_key_here
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to Link in console

### Building for Production

```bash
npm run build
npm run preview
```

## API Documentation

### NASA APIs Used

#### Astronomy Picture of the Day (APOD)
- **Endpoint**: `https://api.nasa.gov/planetary/apod`
- **Purpose**: Daily space images and explanations
- **Usage**: Displayed on the home page

#### Mars Photos API
- **Endpoint**: `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`
- **Purpose**: Curiosity rover photos by Martian day (sol)
- **Usage**: Mars photos page with filtering

#### Mars Manifest API
- **Endpoint**: `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity`
- **Purpose**: Available sols (Martian days) with photos
- **Usage**: Populate sol selection dropdown

### External APIs

#### ISS Tracking
- **Endpoint**: `https://api.wheretheiss.at/v1/satellites/25544`
- **Purpose**: Real-time ISS position and telemetry
- **Usage**: ISS live page

## Usage Guide

### Mars Photos
1. Navigate to the **Mars Photos** page
2. Select a **Sol** (Martian day) from the dropdown
3. Use the **Camera Filter** to view photos from specific cameras
4. Click any photo to view details in a modal
5. Download photos or open them in full resolution

### 3D Solar System
1. Navigate to the **Solar System** page
2. **Mouse Controls**:
   - Left click + drag: Rotate view
   - Scroll wheel: Zoom in/out
3. **Planet Focus**: Click planet names to focus the camera
4. **Orbit Lines**: Toggle visibility with the checkbox
5. **Simulation Speed**: Adjust with the speed controls

### ISS Live Feed
1. Navigate to the **ISS Viewport** page
2. Watch the live video feed
3. View real-time telemetry data (altitude, velocity, coordinates)

##  Component Documentation

### MarsFeed Component
```jsx
/**
 * Displays Mars rover photos with filtering and educational features
 * @param {number} sol - Martian day to fetch photos for
 */
<MarsFeed sol={1000} />
```

**Features:**
- Photo filtering by camera type
- Educational camera information
- Photo download functionality
- Modal photo viewing
- Error handling and loading states

### SolarSystemView Component
```jsx
/**
 * 3D solar system simulation with interactive controls
 */
<SolarSystemView />
```

**Features:**
- Realistic planetary orbits
- Interactive camera controls
- Planet focusing system
- Adjustable simulation speed
- Orbit line toggles

### Planet Class
```jsx
/**
 * Creates 3D planet objects with textures
 * @param {number} radius - Planet radius
 * @param {number} distance - Distance from sun
 * @param {string} texturePath - Texture file path
 */
const earth = new Planet(1.2, 12, 'textures/earth.jpg');
```

## UI/UX Features

### Design System
- **Dark Theme**: Space-themed dark interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant components
- **Smooth Animations**: Framer Motion powered transitions

### Color Scheme
- **Primary**: Red/Mars theme for space exploration
- **Secondary**: Blue/teal for technology and data
- **Background**: Dark grays for space aesthetic
- **Accents**: Purple for special features

##  Security & Performance

### Security
- **API Keys**: Stored in environment variables
- **CORS**: Proper cross-origin request handling
- **Input Validation**: Sanitized user inputs

### Performance
- **Texture Caching**: Prevents duplicate texture loading
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Responsive images with fallbacks
- **Code Splitting**: Automatic bundle optimization

## Troubleshooting

### Common Issues

**NASA API Errors**
- Verify your API key is correct
- Check API rate limits (1000 requests per hour)
- Ensure internet connection is stable


**Photo Loading Issues**
- Check NASA API status



## License

This project is licensed under the MIT License 

##  Acknowledgments

- **NASA** for providing free access to space data and APIs



---

**Built with Love for space exploration and education**
