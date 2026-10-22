import { createHash, createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
export const collections=['pages','articles','reports'] as const;
export type AICollection=typeof collections[number];
export type Target={collection:AICollection;id:number};
export type Change={field:string;value:unknown};
export type Edit=Target & {title:string;baseHash:string;changes:Change[];before:Record<string,unknown>};
export type Proposal={userID:number;expires:number;nonce:string;message:string;edits:Edit[]};
export class AIError extends Error { constructor(public status:number,message:string,public code='invalid_request'){super(message);} }
export function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new AIError(400,'Objet invalide.');return value as Record<string,unknown>;}
export function text(value:unknown,max=3000,allowEmpty=false):string {if(typeof value!=='string'||value.length>max||(!allowEmpty&&!value.trim()))throw new AIError(400,'Texte vide ou trop long.');return value;}
export function target(value:unknown):Target {const data=object(value);if(!collections.includes(data.collection as AICollection)||!Number.isSafeInteger(data.id)||Number(data.id)<1)throw new AIError(400,'Contenu non pris en charge.');return {collection:data.collection as AICollection,id:Number(data.id)};}
export function key(t:Target){return `${t.collection}:${t.id}`;}
export function lexicalText(value:unknown):string {
 if(!value||typeof value!=='object')return '';
 const n=value as Record<string,unknown>;
 if(typeof n.text==='string')return n.text;
 if(n.root)return lexicalText(n.root);
 const result=Array.isArray(n.children)?n.children.map(lexicalText).join(['root','list'].includes(String(n.type))?'\n\n':''):'';
 return n.type==='heading'?`${'#'.repeat(n.tag==='h1'?1:n.tag==='h3'?3:2)} ${result}`:n.type==='listitem'?`- ${result}`:result;
}
export function textToLexical(source:string){
 const leaf=(text:string)=>({type:'text',text,format:0,detail:0,mode:'normal',style:'',version:1});
 const children:Record<string,unknown>[]=[];
 for(const part of source.split(/\n\s*\n/).filter(Boolean)){
  const heading=/^(#{1,3}) ([\s\S]+)$/.exec(part);
  const lines=part.split('\n');
  if(lines.every(line=>/^[-*] /.test(line))){children.push({type:'list',listType:'bullet',tag:'ul',start:1,format:'',indent:0,version:1,direction:null,children:lines.map((line,i)=>({type:'listitem',value:i+1,format:'',indent:0,version:1,direction:null,children:[leaf(line.slice(2))]}))});}
  else children.push({type:heading?'heading':'paragraph',...(heading?{tag:`h${heading[1].length}`} : {}),format:'',indent:0,version:1,direction:null,children:[leaf(heading?heading[2]:part)]});
 }
 return {root:{type:'root',format:'' as const,indent:0,version:1,direction:null,children}};
}
const common=['title','summary','contentText','cover','seoTitle','seoDescription'];
export function allowedFields(collection:AICollection){return [...common,...(collection==='pages'?['kicker','buttonLabel','buttonHref','secondaryLabel','secondaryHref','edition','showInNavigation','sections']:collection==='articles'?['author','category']:['year','document'])];}
export function safeHref(value:unknown){if(value==null||value==='')return '';const s=text(value,1000);if(!/^\/(?!\/)/.test(s)&&!/^https:\/\//.test(s)&&!/^(mailto:|tel:)[^\s]+$/.test(s))throw new AIError(400,'Lien non autorisé.');return s;}
const relation=(value:unknown)=>value&&typeof value==='object'?(value as {id:unknown}).id:value;
export function sectionsForContext(value:unknown):Record<string,unknown>[] {
 if(!Array.isArray(value))return [];
 return value.map(s=>{const o=object(s);const result:Record<string,unknown>={};for(const f of ['kind','enabled','kicker','title','text','legacyImage','buttonLabel','buttonHref','feed','category','limit'])if(o[f]!=null)result[f]=o[f];if(o.image!=null)result.image=relation(o.image);if(Array.isArray(o.items))result.items=o.items.map(item=>{const d=object(item);const clean:Record<string,unknown>={};for(const f of ['title','text','label','legacyImage','href'])if(d[f]!=null)clean[f]=d[f];if(d.image!=null)clean.image=relation(d.image);return clean;});return result;});
}
export function editableDocument(collection:AICollection,doc:Record<string,unknown>){const result:Record<string,unknown>={};for(const field of allowedFields(collection)){result[field]=field==='contentText'?lexicalText(doc.content):field==='sections'?sectionsForContext(doc.sections):['cover','document'].includes(field)?relation(doc[field])??null:doc[field]??null;}return result;}
const sectionKinds=['text','split','cards','gallery','feed','callout','partners','contact'];
function imageID(value:unknown){if(value===null)return null;if(!Number.isSafeInteger(value)||Number(value)<1)throw new AIError(400,'Choisissez une image ou un fichier existant.');return Number(value);}
function cleanSection(data:unknown,item=false):Record<string,unknown>{
 const d=object(data);const allowed=item?['title','text','label','legacyImage','href','image']:['kind','enabled','kicker','title','text','legacyImage','buttonLabel','buttonHref','image','feed','category','limit','items'];
 if(Object.keys(d).some(f=>!allowed.includes(f)))throw new AIError(400,'Champ de section non autorisé.');
 const out:Record<string,unknown>={};
 if(!item){if(!sectionKinds.includes(String(d.kind)))throw new AIError(400,'Type de section inconnu.');out.kind=d.kind;}
 for(const [field,value]of Object.entries(d)){
  if(field==='kind')continue;
  if(field==='items'){if(!Array.isArray(value)||value.length>50)throw new AIError(400,'Maximum 50 éléments par section.');out.items=value.map(v=>cleanSection(v,true));}
  else if(field==='image')out.image=imageID(value);
  else if(field==='enabled'){if(typeof value!=='boolean')throw new AIError(400,'Visibilité invalide.');out.enabled=value;}
  else if(field==='limit'){if(!Number.isInteger(value)||Number(value)<1||Number(value)>100)throw new AIError(400,'Limite invalide.');out.limit=value;}
  else if(field==='feed'){if(!['articles','reports'].includes(String(value)))throw new AIError(400,'Flux inconnu.');out.feed=value;}
  else if(['buttonHref','href'].includes(field))out[field]=safeHref(value);
  else if(field==='legacyImage'){const v=text(value,1000,true);if(v&&!/^\/assets\/[a-zA-Z0-9_./% -]+$/.test(v))throw new AIError(400,'Image d’origine invalide.');out[field]=v;}
  else out[field]=text(value,field==='text'?12000:500,true);
 }
 return out;
}
export function validateChange(collection:AICollection,field:string,value:unknown):Change{
 if(!allowedFields(collection).includes(field))throw new AIError(400,'Ce champ ne peut pas être modifié par l’assistant.');
 if(field==='sections'){if(!Array.isArray(value)||value.length>30)throw new AIError(400,'Maximum 30 sections par page.');return {field,value:value.map(v=>cleanSection(v))};}
 if(['cover','document'].includes(field))return {field,value:imageID(value)};
 if(field==='showInNavigation'){if(typeof value!=='boolean')throw new AIError(400,'Visibilité invalide.');return {field,value};}
 if(field==='year'){if(!Number.isInteger(value)||Number(value)<1900||Number(value)>2200)throw new AIError(400,'Année invalide.');return {field,value};}
 if(['buttonHref','secondaryHref'].includes(field))return {field,value:safeHref(value)};
 if(field==='category'&&!['Gastronomie','Histoire & authenticité','Anthropologie','Cuisine traditionnelle','Alimentation','Tourisme','Épices'].includes(String(value)))throw new AIError(400,'Rubrique inconnue.');
 const max=field==='summary'?500:field==='seoTitle'?100:field==='seoDescription'?300:field==='contentText'?60000:500;
 return {field,value:text(value,max,!['title','summary'].includes(field)&&!(field==='contentText'&&collection!=='pages'))};
}
export function hashDocument(doc:Record<string,unknown>){return createHash('sha256').update(JSON.stringify(doc)).digest('hex');}
export function signProposal(data:Omit<Proposal,'nonce'|'expires'>,secret:string,now=Date.now()){
 const proposal:Proposal={...data,nonce:randomUUID(),expires:now+10*60*1000};const encoded=Buffer.from(JSON.stringify(proposal)).toString('base64url');
 const signature=createHmac('sha256',secret).update('cms-ai-v1:'+encoded).digest('base64url');return {proposal,token:encoded+'.'+signature};
}
export function verifyProposal(token:string,userID:number,secret:string,now=Date.now()):Proposal{
 if(token.length>250000)throw new AIError(400,'Proposition trop volumineuse.');const [encoded,signature,...extra]=token.split('.');
 if(!encoded||!signature||extra.length)throw new AIError(400,'Proposition invalide.');const expected=createHmac('sha256',secret).update('cms-ai-v1:'+encoded).digest();
 const actual=Buffer.from(signature,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new AIError(403,'Proposition modifiée ou invalide.');
 const proposal=JSON.parse(Buffer.from(encoded,'base64url').toString()) as Proposal;
 if(proposal.userID!==userID)throw new AIError(403,'Cette proposition appartient à un autre compte.');
 if(proposal.expires<now)throw new AIError(409,'Proposition expirée. Demandez une nouvelle proposition.','expired_proposal');return proposal;
}
