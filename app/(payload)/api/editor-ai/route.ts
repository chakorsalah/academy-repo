import { createLocalReq, type PayloadRequest } from 'payload';
import { cms } from '@/lib/cms';
import { askOpenAI } from '@/cms/ai-provider';
import { AIError,object,text,target,key,editableDocument,allowedFields,hashDocument,validateChange,signProposal,verifyProposal,textToLexical,collections,type Target,type Edit } from '@/cms/ai-schema';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const response=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex'}});
const requests=new Map<number,{count:number;until:number}>();
async function session(request:Request){const payload=await cms();const {user}=await payload.auth({headers:request.headers});if(!user||!['admin','editor'].includes(user.role))throw new AIError(401,'Connectez-vous à l’espace éditorial.');return {payload,user};}
function errorResult(error:unknown){if(error instanceof AIError)return response({error:error.message,code:error.code},error.status);if(error instanceof Error&&['TimeoutError','AbortError'].includes(error.name))return response({error:'Le service IA a mis trop de temps à répondre. Réessayez.',code:'timeout'},504);return response({error:'L’opération a échoué. Aucun changement n’a été publié.',code:'operation_failed'},500);}
async function getDocument(payload:Awaited<ReturnType<typeof cms>>,user:Awaited<ReturnType<typeof session>>['user'],t:Target,req?:PayloadRequest){
 try{return await payload.findByID({collection:t.collection,id:t.id,draft:true,depth:0,overrideAccess:false,user,req}) as unknown as Record<string,unknown>;}catch{throw new AIError(404,'Contenu introuvable ou accès refusé.');}
}
async function mediaCheck(payload:Awaited<ReturnType<typeof cms>>,value:unknown,pdf=false){if(value==null)return;let doc;try{doc=await payload.findByID({collection:'media',id:Number(value),overrideAccess:false});}catch{throw new AIError(400,'Fichier de médiathèque introuvable.');}if(pdf?doc.mimeType!=='application/pdf':!doc.mimeType?.startsWith('image/'))throw new AIError(400,'Type de fichier incompatible.');}
async function validateMedia(payload:Awaited<ReturnType<typeof cms>>,changes:{field:string;value:unknown}[]){for(const change of changes){if(['cover','document'].includes(change.field))await mediaCheck(payload,change.value,change.field==='document');if(change.field==='sections')for(const section of change.value as Record<string,unknown>[]){await mediaCheck(payload,section.image);for(const item of (section.items||[]) as Record<string,unknown>[])await mediaCheck(payload,item.image);}}}
export async function GET(request:Request){try{const {payload,user}=await session(request);const targets=[];for(const collection of collections){const docs=await payload.find({collection,draft:true,overrideAccess:false,user,depth:0,limit:1000,sort:'title'});targets.push(...docs.docs.map(doc=>({collection,id:doc.id,title:doc.title,status:doc._status,href:`/admin/collections/${collection}/${doc.id}`})));}return response({enabled:Boolean(process.env.OPENAI_API_KEY),testMode:process.env.AI_TEST_MODE==='true'&&process.env.NODE_ENV!=='production',model:process.env.OPENAI_MODEL||'gpt-4.1-mini',targets});}catch(error){return errorResult(error);}}
async function body(request:Request){if(!request.headers.get('content-type')?.includes('application/json'))throw new AIError(415,'Un corps JSON est requis.');const reader=request.body?.getReader();if(!reader)throw new AIError(400,'Requête vide.');const chunks:Uint8Array[]=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>300000){await reader.cancel();throw new AIError(413,'Requête trop volumineuse.');}chunks.push(value);}try{return object(JSON.parse(Buffer.concat(chunks).toString()));}catch(error){if(error instanceof AIError)throw error;throw new AIError(400,'JSON invalide.');}}
export async function POST(request:Request){try{
 const {payload,user}=await session(request);
 const origin=request.headers.get('origin');const permitted=new Set([new URL(request.url).origin,process.env.NEXT_PUBLIC_SERVER_URL]);
 if(origin?!permitted.has(origin):!/^((JWT|Bearer) )/.test(request.headers.get('authorization')||''))throw new AIError(403,'Origine de la requête refusée.');
 const data=await body(request);
 if(data.action==='propose'){
  if(!process.env.OPENAI_API_KEY)throw new AIError(503,'L’assistant est prêt. Ajoutez OPENAI_API_KEY côté serveur pour activer les réponses.','ai_not_configured');
  const limit=requests.get(user.id);if(limit&&limit.until>Date.now()&&limit.count>=10)throw new AIError(429,'Maximum 10 demandes IA en 10 minutes.');requests.set(user.id,limit&&limit.until>Date.now()?{...limit,count:limit.count+1}:{count:1,until:Date.now()+600000});
  const prompt=text(data.prompt,3000);if(!Array.isArray(data.targets)||!data.targets.length||data.targets.length>3)throw new AIError(400,'Sélectionnez de un à trois contenus.');
  const selected=data.targets.map(target);if(new Set(selected.map(key)).size!==selected.length)throw new AIError(400,'Contenu sélectionné deux fois.');
  const saved=await Promise.all(selected.map(async t=>{const doc=await getDocument(payload,user,t);return {...t,title:String(doc.title),updatedAt:doc.updatedAt,fields:editableDocument(t.collection,doc),hash:hashDocument(doc)};}));
  const media=(await payload.find({collection:'media',overrideAccess:false,user,depth:0,limit:30,sort:'-createdAt'})).docs.map(m=>({id:m.id,description:m.alt,mimeType:m.mimeType}));
  const context={documents:saved.map(d=>({documentKey:key(d),title:d.title,editableFields:allowedFields(d.collection),values:d.fields})),availableMedia:media};if(JSON.stringify(context).length>90000)throw new AIError(400,'Ces contenus sont trop volumineux. Sélectionnez un seul contenu plus court.');
  const history=Array.isArray(data.history)?data.history.slice(-6).map(h=>{const m=object(h);if(!['user','assistant'].includes(String(m.role)))throw new AIError(400,'Historique invalide.');return {role:m.role as 'user'|'assistant',content:text(m.content,3000)};}):[];
  const output=object(await askOpenAI({prompt,context,history}));const message=text(output.message,3000);if(!Array.isArray(output.edits)||output.edits.length>3)throw new AIError(502,'Proposition IA invalide.');
  const edits:Edit[]=[];const seen=new Set<string>();
  for(const raw of output.edits){const edit=object(raw);const current=saved.find(s=>key(s)===edit.documentKey);if(!current||seen.has(String(edit.documentKey)))throw new AIError(502,'L’assistant a ciblé un contenu non sélectionné.');seen.add(String(edit.documentKey));if(!Array.isArray(edit.changes)||edit.changes.length>20)throw new AIError(502,'Proposition trop volumineuse.');
   const fields=new Set<string>();const changes=[];for(const rawChange of edit.changes){const c=object(rawChange);const field=text(c.field,40);if(fields.has(field))throw new AIError(502,'Champ répété dans la proposition.');fields.add(field);let value;try{value=JSON.parse(text(c.valueJSON,90000));}catch{throw new AIError(502,'Valeur proposée invalide.');}const change=validateChange(current.collection,field,value);if(JSON.stringify(change.value)!==JSON.stringify(current.fields[field]))changes.push(change);}
   await validateMedia(payload,changes);if(changes.length)edits.push({collection:current.collection,id:current.id,title:current.title,baseHash:current.hash,changes,before:Object.fromEntries(changes.map(c=>[c.field,current.fields[c.field]]))});
  }
  if(!edits.length)return response({message,proposal:null});const signed=signProposal({userID:user.id,message,edits},process.env.PAYLOAD_SECRET!);return response({message,...signed});
 }
 if(data.action==='apply'){
  const proposal=verifyProposal(text(data.token,250000),user.id,process.env.PAYLOAD_SECRET!);
  const transactionID=await payload.db.beginTransaction();if(!transactionID)throw new AIError(503,'Une transaction ne peut pas être ouverte. Réessayez.');
  const req=await createLocalReq({user},payload);req.transactionID=transactionID;
  try{for(const edit of proposal.edits){const current=await getDocument(payload,user,edit,req);if(hashDocument(current)!==edit.baseHash)throw new AIError(409,'Ce contenu a été modifié depuis la proposition. Demandez une nouvelle proposition.','stale_proposal');await validateMedia(payload,edit.changes);}
   for(const edit of proposal.edits){const update:Record<string,unknown>={};for(const c of edit.changes){const change=validateChange(edit.collection,c.field,c.value);update[change.field==='contentText'?'content':change.field]=change.field==='contentText'?textToLexical(String(change.value)):change.value;}
    await payload.update({collection:edit.collection,id:edit.id,data:update as never,draft:true,overrideAccess:false,overrideLock:false,user,req});
   }
   await payload.db.commitTransaction(transactionID);
  }catch(error){await payload.db.rollbackTransaction(transactionID).catch(()=>{});throw error;}
  return response({message:'Modifications enregistrées en brouillon. La publication reste à valider dans l’éditeur.',documents:proposal.edits.map(edit=>({title:edit.title,editor:`/admin/collections/${edit.collection}/${edit.id}`,preview:`/preview/${edit.collection}/${edit.id}`}))});
 }
 throw new AIError(400,'Action inconnue.');
 }catch(error){return errorResult(error);}}
