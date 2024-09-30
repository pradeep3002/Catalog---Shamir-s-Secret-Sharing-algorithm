const fs = require('fs');

function decodeValue(base, value) {
    return parseInt(value, parseInt(base));
}

function lagrangeInterpolation(x, y, xInterp) {
    let result = 0;
    for (let i = 0; i < x.length; i++) {
        let term = y[i];
        for (let j = 0; j < x.length; j++) {
            if (i !== j) {
                term *= (xInterp - x[j]) / (x[i] - x[j]);
            }
        }
        result += term;
    }
    return result;
}

function findSecret(data) {
    const keys = data.keys;
    const n = keys.n;
    const k = keys.k;

    const x = [];
    const y = [];

    for (let i = 1; i <= n; i++) {
        if (data[i]) {
            const point = data[i];
            x.push(i);
            y.push(decodeValue(point.base, point.value));
        }
    }

    // Ensure we have at least k points
    if (x.length < k) {
        return { secret: null, wrongPoints: [] };
    }

    // Find the secret (constant term)
    const secret = Math.round(lagrangeInterpolation(x.slice(0, k), y.slice(0, k), 0));

    // Find wrong points (for the second test case)
    const wrongPoints = [];
    for (let i = k; i < x.length; i++) {
        const expectedY = lagrangeInterpolation(x.slice(0, k), y.slice(0, k), x[i]);
        if (Math.round(expectedY) !== y[i]) {
            wrongPoints.push(x[i]);
        }
    }

    return { secret, wrongPoints };
}

function main() {
    // Read test cases from JSON files
    const testcase1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
    const testcase2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));

    // Process test cases
    const { secret: secret1 } = findSecret(testcase1);
    const { secret: secret2, wrongPoints: wrongPoints2 } = findSecret(testcase2);

    // Print results
    console.log(`Secret for Test Case 1: ${secret1}`);
    console.log(`Secret for Test Case 2: ${secret2}`);
    console.log(`Wrong points in Test Case 2: ${wrongPoints2}`);
}

main();