# Floor Plan Visualizer & Column Positioner

This web application allows users to visualize CSV floor plan data, interactively place grid lines and columns, and export the results to JSON format. It also provides feedback on the accuracy of column placement.

## Features

- Load floor plans from CSV files
- Interactive 2D/3D visualization
- Place horizontal and vertical grid lines
- Position columns of adjustable size
- Export data to JSON format with user credentials
- Login system with engineer type selection
- Get accuracy feedback on column placement compared to previous users

## Development

### Quick Start with Development Helper

The application includes a PowerShell helper script for common development tasks:

```powershell
# Show available commands
.\dev-helper.ps1 help

# Run development environment (React client + Express server)
.\dev-helper.ps1 dev

# Build for production
.\dev-helper.ps1 build

# Create a deployment package
.\dev-helper.ps1 deploy

# Show project configuration
.\dev-helper.ps1 info

# Fix common development issues
.\dev-helper.ps1 fix
```

### Manual Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `node copyCSVFiles.js` to copy CSV files to the public folder
4. Start the React development server with `npm start`
5. In a separate terminal, run the backend server with `npm run server`

### Production Build

1. Run `npm run build` to create a production build
2. Start the server with `node server.js` which will serve the React app
3. Access the application at http://localhost:3000
   ## Using the Application

### Loading a Floor Plan

- Select a floor plan from the dropdown menu
- Or upload your own CSV file

### Adding Grid Lines

1. Click the "Grid Tool" button to activate
2. Choose "Horizontal" or "Vertical" direction
3. Click and drag on the visualizer to add grid lines

### Adding Columns

1. Click the "Column Tool" button to activate
2. Adjust the column size using the slider
3. Click on the visualizer to place columns

### Exporting Your Work

1. Click the "Calculate Accuracy & Export" button
2. The application will calculate the accuracy of your column placement
3. Your work will be exported as a JSON file
4. Review the accuracy feedback to improve your design

## CSV File Format

The application expects CSV files in the following format:

```
x,y,z
{0, 0, 0}
{1, 2, 0}
{3, 4, 0}
...
```

Where each line after the header represents a point in the floor plan polygon.

## Technologies Used

- React.js
- TypeScript
- Three.js (@react-three/fiber) 
- Styled Components
- PapaParse for CSV parsing
- Express.js for the backend server

## Deployment

For detailed instructions on how to deploy this application locally or on a traditional web hosting service, please refer to the [Deployment Guide](./DEPLOYMENT_GUIDE.md).

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
