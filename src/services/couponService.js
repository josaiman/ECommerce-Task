
const VALID_COUPONS = {
    'WELCOME10': { type: 'percent', value: 10, minOrder: 0 },
    'SAVE20': { type: 'percent', value: 20, minOrder: 10000 },
    'FLAT500': { type: 'flat', value: 500, minOrder: 5000 }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const couponService = {
    async validate(code, cartTotal) {
        await delay(400);
        const coupon = VALID_COUPONS[code.toUpperCase()];

        if (!coupon) {
            throw new Error('Invalid coupon code');
        }

        if (cartTotal < coupon.minOrder) {
            throw new Error(`Minimum order of ₹${coupon.minOrder} required`);
        }

        return coupon;
    }
};
