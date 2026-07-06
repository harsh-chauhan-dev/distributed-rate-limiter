import TokenBucket from './src/algorithms/token-bucket.ts';

const limiter = new TokenBucket(5, 1);

for (let i = 1; i <= 7; i++){
    const result = limiter.allowRequest("192.168.1.1");
    console.log(`Result ${i}: `,result);
}

console.log("\nWaiting for 3 seconds...\n");

setTimeout(() => {
    console.log(" \n After 3 seconds: \n");
    console.log(limiter.allowRequest("192.168.1.1"));
}, 3000);

