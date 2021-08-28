const binaryOperators = {
    '+': (left, right) => left + right,
    '-': (left, right) => left - right,
    '*': (left, right) => left * right,
    '/': (left, right) => {
        if (right == 0) {
            throw new Error('TypeError: Division by zero.');
        } else {    
            return (left / right);
        }
    },
}

function evalBinaryExpr(expr, operators) {
    const regex = new RegExp(`(?<left>(^-)?\\d+(\\.\\d+)?(e[+-]\\d+)?)(?<operator>[\\${operators.join('\\')}])(?<right>-?\\d+(\\.\\d+)?(e[+-]\\d+)?)`);
    const match = regex.exec(expr);
    
    if (!match) {
        return expr;
    }

    const left = Number(match.groups.left);
    const right = Number(match.groups.right);
    const operator = match.groups.operator;
    const operatorFunc = binaryOperators[operator];

    try {
        const eval = operatorFunc(left, right);
        return expr.replace(match[0], eval);
    } catch (error) {
        throw error;        
    }
}

function evalMultiplicationAndDivision(expr) {
    let processed = expr;

    try {
        processed = evalBinaryExpr(processed, ['*', '/']); 
        
        if (processed == expr) {
            return processed;
        } else {
            return evalMultiplicationAndDivision(processed); 
        }
    } catch (error) {
        throw error;
    }
}

function evalSummationAndSubtraction(expr) {
    let processed = expr;

    try {
        processed = evalBinaryExpr(processed, ['+', '-']); 
        
        if (processed == expr) {
            return processed;
        } else {
            return evalSummationAndSubtraction(processed); 
        }
    } catch (error) {
        throw error;
    }
}

function doEvalRun(expr) {
    let processed = expr;

    try {
        processed = evalMultiplicationAndDivision(processed); 
        processed = evalSummationAndSubtraction(processed);
        return processed; 
    } catch (error) {
        throw error;
    }
}

function eval(expr) {
    let processed = expr;

    try {
        const regex = /\((?<nestedExpr>[^\(\)]+)\)/;
        const match = regex.exec(processed);
        
        if (!match) {
            if (processed.match(/[\(\)]/)) {
                throw new Error('ExpressionError: Brackets must be paired');
            } else {
                return doEvalRun(processed);
            }
        }

        const nestedExpr = match.groups.nestedExpr;
        processed = processed.replace(match[0], doEvalRun(nestedExpr));
        
        return eval(processed);
    } catch (error) {
        throw error;        
    }
}

function expressionCalculator(expr) {
    let processed = expr.replace(/\s/g, '');

    try {
        return Number(eval(processed));       
    } catch (error) {
        throw error;        
    }
}

/*
expressionCalculator(
    //'1.2345e-10-18'
    //' 24 - 23 * 17 / (  93 + 52 * 70 * (  6 + 91 / (  (  4 / 39 / 8 * 30  ) / (  22 * 97 * (  32 * 20 * (  82 - 80 * 51 / 89 * 9  ) * 56 + 82  ) * 89  ) - 17 - 17  ) / 29 / 81  )  ) '
);
*/

module.exports = {
    expressionCalculator
}