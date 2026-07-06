interface Bucket{
    tokens: number;
    lastRefill: number;
}

interface RateLimiter{
    allowed: boolean;
    limit: number;
    remaining: number;
}

class TokenBucket {
    private capacity: number;
    private refillRate: number;
    private buckets: Map<string, Bucket>;
    

    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.buckets = new Map<string, Bucket>();
    }

    private getBucket(key: string): Bucket{
        let bucket = this.buckets.get(key);

        if (!bucket) {
            bucket = {
                tokens: this.capacity,
                lastRefill: Date.now(),
            };
            this.buckets.set(key, bucket);
        }
        return bucket;
    }

    private refillBucket(bucket: Bucket): void{
        const now = Date.now();
        const elapsed = (now - bucket.lastRefill) / 1000;
        const refillTokens = elapsed * this.refillRate;

        bucket.tokens = Math.min(this.capacity, bucket.tokens + refillTokens);
        bucket.lastRefill = now;
    }

    private consumeToken(bucket: Bucket): void{
        bucket.tokens--;
    }

    public allowRequest(key: string): RateLimiter{
        const bucket = this.getBucket(key);
        this.refillBucket(bucket);

        if (bucket.tokens < 1) {
            return {
                allowed: false,
                limit: this.capacity,
                remaining: 0
            }
        }
        this.consumeToken(bucket);
        return {
            allowed: true,
            limit: this.capacity,
            remaining: Math.floor(bucket.tokens)
        };
    }
}

export default TokenBucket;
