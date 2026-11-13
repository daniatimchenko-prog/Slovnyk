export default{async fetch(req,env){
 const h={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type,x-app-token','Access-Control-Allow-Methods':'POST,OPTIONS'};
 if(req.method==='OPTIONS')return new Response(null,{headers:h});
 if(req.method!=='POST')return new Response('ok',{headers:h});
 if(env.APP_TOKEN&&req.headers.get('x-app-token')!==env.APP_TOKEN)return new Response('forbidden',{status:403,headers:h});
 const {system,messages}=await req.json();
 const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:'claude-sonnet-5-5',max_tokens:600,system:String(system||'').slice(0,2000),messages:(messages||[]).slice(-20)})});
 const d=await r.json();
 const j={...h,'content-type':'application/json'};
 if(!r.ok)return new Response(JSON.stringify(d),{status:r.status,headers:j});
 return new Response(JSON.stringify({text:(d.content||[]).map(x=>x.text||'').join('')}),{headers:j})}}
