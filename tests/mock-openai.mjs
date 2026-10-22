// Local protocol fixture for integration tests. No requests are sent to OpenAI.
import http from 'node:http';
const server=http.createServer(async(req,res)=>{if(req.url!=='/responses'){res.writeHead(404).end();return;}let raw='';for await(const part of req)raw+=part;const body=JSON.parse(raw);const context=JSON.parse(body.input[0].content).savedDocuments;const prompt=body.input.at(-1).content;
 if(prompt.includes('provider-error')){res.writeHead(503,{'Content-Type':'application/json'}).end('{}');return;}
 let edits=context.documents.map(doc=>({documentKey:doc.documentKey,changes:[{field:'title',valueJSON:JSON.stringify(doc.values.title+' — version IA')}]}));
 if(prompt.includes('forbidden-field'))edits[0].changes=[{field:'_status',valueJSON:'"published"'}];
 if(prompt.includes('cross-target'))edits[0].documentKey='users:1';
 if(prompt.includes('reorder-sections'))edits[0].changes=[{field:'sections',valueJSON:JSON.stringify([...context.documents[0].values.sections].reverse())}];
 if(prompt.includes('invalid-json')){res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({status:'completed',output:[{type:'function_call',name:'propose_edits',arguments:'oops'}]}));return;}
 if(prompt.includes('incomplete')){res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({status:'incomplete',output:[]}));return;}
 if(prompt.includes('clarify'))edits=[];
 res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({status:'completed',output:[{type:'function_call',name:'propose_edits',arguments:JSON.stringify({message:'Proposition du fournisseur simulé pour les tests.',edits})}]}));
});server.listen(4319,'127.0.0.1',()=>console.log('Local OpenAI protocol fixture ready on 4319.'));process.on('SIGINT',()=>server.close(()=>process.exit(0)));
