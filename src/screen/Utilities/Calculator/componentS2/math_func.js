import Traction from "./convert_traction"
export default function integrate(f, start, end, step) {
  let total = 0;
  step = step || 0.000001;
  for (let x = start; x < end; x += step) {
    total += f(x + step / 2) * step;
  }
  return total;
}

/**
 *     math.evaluate('integrate(2*x, x, 0, 2)')
 *     math.evaluate('integrate(2*x, x, 0, 2, 0.01)')
 *
 * @param {Array.<math.Node>} args
 *            Expects the following arguments: [f, x, start, end, step]
 * @param {Object} math
 * @param {Object} [scope]
 */
integrate.transform = function (args, math, scope) {
  // determine the variable name
  if (!args[1].isSymbolNode) {
    throw new Error('Second argument must be a symbol');
  }
  const variable = args[1].name;

  // evaluate start, end, and step
  const start = args[2].compile().evaluate(scope);
  const end = args[3].compile().evaluate(scope);
  const step = args[4] && args[4].compile().evaluate(scope); // step is optional

  // create a new scope, linked to the provided scope. We use this new scope
  // to apply the variable.
  const fnScope = Object.create(scope);

  // construct a function which evaluates the first parameter f after applying
  // a value for parameter x.
  const fnCode = args[0].compile();

  const f = function (x) {
    fnScope[variable] = x;
    return fnCode.evaluate(fnScope);
  };

  // execute the integration
  return integrate(f, start, end, step);
};

integrate.transform.rawArgs = true;
//===========================================================================================

//UCLN
//===========================================================================================

// ước chung lớn nhất 2 số
export function math_ucln_2(a, b, math) {
  if (typeof a == 'string' || typeof b == 'string') {
    return math.gcd(math.number(a), math.number(b));
  } else if (typeof a == 'number' || typeof b == 'number') {
    return math.gcd(a, b);
  } else return false;
}

// ước chung lớn nhất 3 số
export function math_ucln_3(a, b, c, math) {
  if (typeof a == 'string' || typeof b == 'string' || typeof c == 'string') {
    return math.gcd(math.number(a), math.number(b), math.number(c));
  } else if (
    typeof a == 'number' ||
    typeof b == 'number' ||
    typeof c == 'number'
  ) {
    return math.gcd(a, b, c);
  } else return false;
}
//===========================================================================================

//BCNN

//===========================================================================================

// bộ chung nhỏ nhất 2 số
export function math_bcnn_2(a, b, math) {
  if (typeof a == 'string' || typeof b == 'string') {
    return math.lcm(math.number(a), math.number(b));
  } else if (typeof a == 'number' || typeof b == 'number') {
    return math.lcm(a, b);
  } else return false;
}

// bội chung nhỏ nhất 3 số
export function math_bcnn_3(a, b, c, math) {
  if (typeof a == 'string' || typeof b == 'string' || typeof c == 'string') {
    return math.lcm(math.number(a), math.number(b), math.number(c));
  } else if (
    typeof a == 'number' ||
    typeof b == 'number' ||
    typeof c == 'number'
  ) {
    return math.lcm(a, b, c);
  } else return false;
}

//===========================================================================================

//Hệ phương trình bậc nhất
//Hệ 2 ẩn, đầu vào là các hệ số của biến
//===========================================================================================

export function equations_2_hidden(a, b, math) {
  try {
    let math_value = [];
    let value = math.lusolve(a, b)
    if(value.length>0)
    {
     value.map(val=>{
      math_value.push(Traction(val[0]))
      })
    }
    return math_value;
  } catch (e) {
    return 'err,err,err,err';
  }
}

//===========================================================================================
// giải phương trình bậc 1,2,3. đầu vào laf các hệ số

//===========================================================================================

function cuberoot(x) {
  var y = Math.pow(Math.abs(x), 1 / 3);
  return x < 0 ? -y : y;
}

export function solveCubic(a, b, c, d) {
  if (Math.abs(a) < 1e-8) {
    // Quadratic case, ax^2+bx+c=0
    a = b;
    b = c;
    c = d;
    if (Math.abs(a) < 1e-8) {
      // Linear case, ax+b=0
      a = b;
      b = c;
      if (Math.abs(a) < 1e-8)
        // Degenerate case
        return [];
      return [-b / a];
    }

    var D = b * b - 4 * a * c;
    if (Math.abs(D) < 1e-8) return [-b / (2 * a)];
    else if (D > 0)
      return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
    return [];
  }

  // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
  var p = (3 * a * c - b * b) / (3 * a * a);
  var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  var roots;

  if (Math.abs(p) < 1e-8) {
    // p = 0 -> t^3 = -q -> t = -q^1/3
    roots = [cuberoot(-q)];
  } else if (Math.abs(q) < 1e-8) {
    // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
  } else {
    var D = (q * q) / 4 + (p * p * p) / 27;
    if (Math.abs(D) < 1e-8) {
      // D = 0 -> two roots
      roots = [(-1.5 * q) / p, (3 * q) / p];
    } else if (D > 0) {
      // Only one real root
      var u = cuberoot(-q / 2 - Math.sqrt(D));
      roots = [u - p / (3 * u)];
    } else {
      // D < 0, three roots, but needs to use complex numbers/trigonometric solution
      var u = 2 * Math.sqrt(-p / 3);
      var t = Math.acos((3 * q) / p / u) / 3; // D < 0 implies p < 0 and acos argument in [-1..1]
      var k = (2 * Math.PI) / 3;
      roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
    }
  }

  // Convert back from depressed cubic
  for (var i = 0; i < roots.length; i++) roots[i] -= b / (3 * a);

  return roots;
}

//===========================================================================================
//tích có hướng của 2 vector
//===========================================================================================

export function math_cross(vecter_a, vecter_b, math) {
  return math.cross(vecter_a, vecter_b);
}

//===========================================================================================
//tích có hướng của 2 vector
//===========================================================================================
