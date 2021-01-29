import { Dimensions } from 'react-native';

export default Constants = {
    MAX_WIDTH: Dimensions.get("screen").width,
    MAX_HEIGHT: Dimensions.get("screen").height,
    GRID_HORIZONTAL_SIZE: 20,
    GRID_VERTICAL_SIZE: 30,
    CELL_SIZE: Math.floor(Dimensions.get("screen").width / 20) < Math.floor(Dimensions.get("screen").height / 30) ?
        Math.floor(Dimensions.get("screen").width / 20)
        :
        Math.floor(Dimensions.get("screen").height / 30),
    SNAKE_LEVEL: 'SNAKE_LEVEL',
    SNAKE_HIGHSCORE: 'SNAKE_HIGHSCORE',
}
