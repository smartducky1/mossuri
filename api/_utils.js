const crypto=require('crypto');
function body(req){return new Promise((resolve,reject)=>{let s='';req.on('data',c=>s+=c);req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch(e){reject(e)}});req.on('error',reject)})}
function sign(payload,secret){return crypto.createHmac('sha256',secret).update(JSON.stringify(payload)).digest('hex')}
module.exports={body,sign};
