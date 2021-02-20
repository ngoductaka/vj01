
const nextShapeReducer = (state = [], action) => {
    let newShape = state;
    switch(action.type) {
        case 'NEXT_SHAPE':
            newShape = action.shape;
            break;

        default:
            newShape = state;
    }
    return newShape;
};


export default nextShapeReducer;