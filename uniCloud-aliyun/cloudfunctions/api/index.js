'use strict';

const { Router } = require('uni-cloud-router');
const router = new Router(require("./config.js"));

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event: ', event);
	
	//返回数据给客户端
	return router.serve(event, context);
};
