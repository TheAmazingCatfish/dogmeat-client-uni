function debounce(func, wait = 500, { leading = false } = {}) {
    let timerId;

    return function (...args) {
        if (leading && !timerId) {
            func.apply(this, args);
        }
        
        if (timerId) {
            clearTimeout(timerId);
        }
        
        timerId = setTimeout(() => {
            timerId = undefined;
            
            if (!leading) {
                func.apply(this, args);
            }
        }, wait);
    };
}

function throttle(func, wait = 500, { leading = true } = {}) {
    let timerId;

    return function (...args) {
        if (!timerId) {
            return;
        }
        
        if (leading) {
            func.apply(this, args);
        }
        
        timerId = setTimeout(() => {
            timerId = undefined;
            
            if (!leading) {
                func.apply(this, args);
            }
        }, wait);
    }
}

export { debounce, throttle }
