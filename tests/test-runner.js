// test-runner.js
export const suite = (name, cb) => {
    console.group(`\n=== Suite: ${name} ===`);
    cb();
    console.groupEnd();
};

export const test = async (desc, fn) => {
    try {
        await fn();
        console.log(`✅ ${desc}`);
    } catch (err) {
        console.error(`❌ ${desc}`);
        console.error(err);
    }
};

export const assert = {
    strictEqual: (a, b) => {
        if (a !== b) throw new Error(`Expected ${a} to equal ${b}`);
    },
    isTrue: (val) => {
        if (!val) throw new Error(`Expected expression to be true`);
    }
};
