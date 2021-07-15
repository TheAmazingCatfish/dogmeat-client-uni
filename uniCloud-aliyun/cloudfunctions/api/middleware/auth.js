const uniID = require('uni-id');

module.exports = (options) => {
    // uniID.init(options);
    
    return async function auth(ctx, next) {
        const result = await uniID.checkToken(ctx.event.uniIdToken);
        
        if (result.code != 0) {
            throw result;
        }
        
        ctx.userId = result.uid;
        
        await next();
        
        if (result.token) {
            Object.assign(ctx.body, {
                token: result.token,
                tokenExpired: result.tokenExpired
            });
        }
    }
}
