import { Dimensions } from 'react-native';

export default Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    GRID_SIZE: 20,
    CELL_SIZE: Math.floor(Dimensions.get("screen").width / 20),
    SNAKE_LEVEL: 'SNAKE_LEVEL',
    SNAKE_HIGHSCORE: 'SNAKE_HIGHSCORE',
}
