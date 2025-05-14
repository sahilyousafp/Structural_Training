import { Point, Column, CSVData, AccuracyResult } from "../types";

/**
 * Calculates the distance between two points
 */
const calculateDistance = (point1: Point, point2: Point): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) +
    Math.pow(point2.y - point1.y, 2) +
    Math.pow(point2.z - point1.z, 2)
  );
};

/**
 * Finds the optimal column positions based on the floor plan geometry
 */
export const calculateOptimalColumnPositions = (floorPlan: CSVData, gridSize: number = 3): Point[] => {
  // This is a simplified algorithm to calculate optimal positions
  // In a real implementation, you would need more sophisticated analysis
  
  const optimalPositions: Point[] = [];
  const points = floorPlan.points;
  
  if (!points || points.length < 3) {
    return optimalPositions;
  }
  
  // Find the bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  
  // Create a grid within the bounding box
  const width = maxX - minX;
  const height = maxY - minY;
  
  const numCols = Math.floor(width / gridSize);
  const numRows = Math.floor(height / gridSize);
  
  // Find centers for each grid cell and check if they are inside the polygon
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      const x = minX + (i + 0.5) * gridSize;
      const y = minY + (j + 0.5) * gridSize;
      
      // Check if point is inside the polygon - simplified version
      // In a real implementation, you would use a proper point-in-polygon test
      if (isPointInPolygon({ x, y, z: 0 }, points)) {
        optimalPositions.push({ x, y, z: 0 });
      }
    }
  }
  
  return optimalPositions;
};

/**
 * Simplified point-in-polygon test
 * This uses the ray casting algorithm
 */
const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
  // Ensure the polygon is closed
  const poly = [...polygon];
  if (poly[0] !== poly[poly.length - 1]) {
    poly.push(poly[0]);
  }
  
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    
    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Loads previous user data from the Output folder to compare with current user work
 */
const loadPreviousUserData = async (floorPlanName: string): Promise<Column[][]> => {
  // In a browser environment, we cannot directly access the file system
  // This is a mock implementation to simulate loading previous data
  try {
    console.log(`Attempting to load previous user data for ${floorPlanName} from Output directory`);
    
    // For now, we will return some mock data
    // In a real implementation, this would load actual files from D:\IaaC\TERM 3\RESEARCH\TRAINING VALIDITY\Output
    const mockPreviousColumns: Column[][] = [
      [
        { id: "prev1", position: { x: 2, y: 3, z: 0 }, size: 0.5 },
        { id: "prev2", position: { x: 5, y: 7, z: 0 }, size: 0.5 },
        { id: "prev3", position: { x: 8, y: 2, z: 0 }, size: 0.5 },
      ],
      [
        { id: "prev4", position: { x: 1.5, y: 3.2, z: 0 }, size: 0.5 },
        { id: "prev5", position: { x: 5.2, y: 6.8, z: 0 }, size: 0.5 },
        { id: "prev6", position: { x: 7.8, y: 2.1, z: 0 }, size: 0.5 },
      ]
    ];
    
    return mockPreviousColumns;
  } catch (error) {
    console.error("Error loading previous user data:", error);
    return [];
  }
};

/**
 * Calculates the accuracy of user-placed columns compared to optimal positions and previous users data
 */
export const calculateAccuracy = async (
  userColumns: Column[],
  floorPlan: CSVData
): Promise<AccuracyResult> => {
  // Calculate optimal positions based on geometry
  const optimalPositions = calculateOptimalColumnPositions(floorPlan);
  
  // Load previous users data for comparison
  const previousUsersColumns = await loadPreviousUserData(floorPlan.name);
  
  // If no optimal positions or no user columns
  if (optimalPositions.length === 0 || userColumns.length === 0) {
    return {
      score: 0,
      feedback: "Unable to calculate accuracy - no reference data available.",
      details: "Try a different floor plan or add more columns."
    };
  }
  
  // Calculate accuracy based on optimal positions (traditional method)
  let totalDistanceScore = 0;
  let columnDetails: string[] = [];
  
  for (const userColumn of userColumns) {
    let minDistance = Infinity;
    let closestOptimal: Point | null = null;
    
    for (const optimalPos of optimalPositions) {
      const distance = calculateDistance(userColumn.position, optimalPos);
      if (distance < minDistance) {
        minDistance = distance;
        closestOptimal = optimalPos;
      }
    }
    
    // Convert distance to a score (closer = higher score)
    const distanceScore = Math.max(0, 1 - minDistance / 5); // Normalize to 0-1 scale
    totalDistanceScore += distanceScore;
    
    if (closestOptimal) {
      columnDetails.push(`Column at (${userColumn.position.x.toFixed(2)}, ${userColumn.position.y.toFixed(2)}) - 
      Distance from optimal: ${minDistance.toFixed(2)}`);
    }
  }
  
  // Calculate average score based on distances to optimal positions
  const averageDistanceScore = totalDistanceScore / userColumns.length;
  const percentageScore = Math.round(averageDistanceScore * 100);
  
  // Calculate similarity to previous users column placements
  let similarityToOthers = 0;
  
  if (previousUsersColumns.length > 0) {
    let totalSimilarity = 0;
    
    // Compare user columns to each previous user columns
    for (const prevUserColumns of previousUsersColumns) {
      let userToOtherSimilarity = 0;
      
      // For each user column, find closest previous user column
      for (const userColumn of userColumns) {
        let minDist = Infinity;
        
        for (const prevColumn of prevUserColumns) {
          const distance = calculateDistance(userColumn.position, prevColumn.position);
          minDist = Math.min(minDist, distance);
        }
        
        // Convert distance to similarity score (closer = higher similarity)
        const similarityScore = Math.max(0, 1 - minDist / 5);
        userToOtherSimilarity += similarityScore;
      }
      
      // Average similarity for this previous user
      const avgSimilarity = prevUserColumns.length > 0 
        ? userToOtherSimilarity / userColumns.length
        : 0;
        
      totalSimilarity += avgSimilarity;
    }
    
    // Average similarity across all previous users
    similarityToOthers = previousUsersColumns.length > 0 
      ? totalSimilarity / previousUsersColumns.length
      : 0;
  }
  
  // Convert similarity to percentage
  const similarityPercentage = Math.round(similarityToOthers * 100);
  
  return {
    score: percentageScore,
    feedback: `You are close to ${similarityPercentage}% of the previous users column placements.`,
    details: columnDetails.join("\n")
  };
};
