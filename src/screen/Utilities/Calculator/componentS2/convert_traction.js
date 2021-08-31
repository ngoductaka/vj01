import { create, all } from 'mathjs';
const math = create(all);
const Traction = (string) => {
    if(string ==0)
    {
        return 0
    }
    var value = math.fraction(string)

    var ts = ""
    if (value.toString().search("-") == 0) {
        ts = '-' + value['n']
    }

    else {
        ts = value['n']
    }

    if (string.toString().search("e-") > -1) {
        return string
    }
    else if (value['d'] == 1) {
        return ts;
    }
    else {
        if (value["d"].toString().length > 5 && value["n"].toString().length > 3) {
            return string
        }
        else {
            return ts + '/' + value['d']
        }
    }

}
export default Traction