import test from 'node:test';
import assert from 'node:assert/strict';
import { validateChange,textToLexical,lexicalText,signProposal,verifyProposal,safeHref,editableDocument,sectionsForContext,hashDocument,target } from '../cms/ai-schema';
const fixture={userID:7,message:'Une proposition',edits:[{collection:'pages' as const,id:1,title:'Accueil',baseHash:'abc',before:{title:'Avant'},changes:[{field:'title',value:'Après'}]}]};
test('AI can update editorial text but cannot change protected fields',()=>{assert.equal(validateChange('pages','title','Nouveau').value,'Nouveau');for(const field of ['slug','originalPath','_status','role','__proto__','pageKind'])assert.throws(()=>validateChange('pages',field,'bad'));});
test('bounded text validation',()=>{assert.throws(()=>validateChange('pages','summary','x'.repeat(501)));assert.throws(()=>validateChange('articles','title',''));assert.throws(()=>validateChange('articles','contentText',''));assert.doesNotThrow(()=>validateChange('pages','contentText',''));});
test('only known collection IDs can be targeted',()=>{assert.throws(()=>target({collection:'users',id:1}));assert.throws(()=>target({collection:'pages',id:-1}));assert.deepEqual(target({collection:'pages',id:4}),{collection:'pages',id:4});});
test('links reject script protocols and protocol-relative URLs',()=>{assert.throws(()=>safeHref('javascript:alert(1)'));assert.throws(()=>safeHref('//example.com'));assert.equal(safeHref('/academie'),'/academie');assert.equal(safeHref('https://example.com'),'https://example.com');});
test('section schema rejects arbitrary keys and oversized arrays',()=>{assert.throws(()=>validateChange('pages','sections',[{kind:'text',html:'<script>'}]));assert.throws(()=>validateChange('pages','sections',Array(31).fill({kind:'text'})));assert.throws(()=>validateChange('pages','sections',[{kind:'cards',items:Array(51).fill({title:'a'})}]));});
test('section images are media IDs',()=>{assert.throws(()=>validateChange('pages','sections',[{kind:'split',image:'https://example.com/p.png'}]));assert.deepEqual(validateChange('pages','sections',[{kind:'split',image:2}]).value,[{kind:'split',image:2}]);});
test('invalid legacy image locations rejected',()=>{assert.throws(()=>validateChange('pages','sections',[{kind:'split',legacyImage:'https://example.com/x'}]));});
test('numeric and enum fields are validated',()=>{assert.throws(()=>validateChange('reports','year',5000));assert.throws(()=>validateChange('articles','category','unknown'));assert.throws(()=>validateChange('pages','showInNavigation','true'));});
test('Lexical conversion preserves headings, paragraphs and bullets',()=>{const input='# Titre\n\nParagraphe arabe : مرحبا\n\n- Un\n- Deux';const doc=textToLexical(input);const result=lexicalText(doc);assert.ok(result.includes('# Titre'));assert.ok(result.includes('مرحبا'));assert.ok(result.includes('- Un'));assert.ok(result.includes('- Deux'));});
test('HTML remains plain text, never executable markup',()=>{const doc=textToLexical('<script>alert(1)</script>');assert.equal(doc.root.children[0].type,'paragraph');assert.equal(lexicalText(doc),'<script>alert(1)</script>');});
test('editable context does not include passwords or internal fields',()=>{const result=editableDocument('pages',{title:'a',password:'secret',originalPath:'/admin',_status:'published',content:textToLexical('Hello')});assert.equal(result.contentText,'Hello');for(const f of ['password','originalPath','_status'])assert.equal(f in result,false);});
test('context strips nested array IDs and populated media objects',()=>{assert.deepEqual(sectionsForContext([{kind:'cards',id:'internal',image:{id:2,url:'x'},items:[{id:'row',title:'a',image:{id:3}}]}]),[{kind:'cards',image:2,items:[{title:'a',image:3}]}]);});
test('signed proposal roundtrip belongs to its creator',()=>{const {token}=signProposal(fixture,'test-secret',1000);assert.equal(verifyProposal(token,7,'test-secret',1001).edits[0].title,'Accueil');assert.throws(()=>verifyProposal(token,8,'test-secret',1001));});
test('tampering and incorrect secrets rejected',()=>{const {token}=signProposal(fixture,'test-secret',1000);assert.throws(()=>verifyProposal(token+'x',7,'test-secret',1001));assert.throws(()=>verifyProposal(token,7,'wrong-secret',1001));});
test('expired proposals rejected',()=>{const {token}=signProposal(fixture,'test-secret',1000);assert.throws(()=>verifyProposal(token,7,'test-secret',1000+600001));});
test('hash catches content updates',()=>{assert.notEqual(hashDocument({title:'a'}),hashDocument({title:'b'}));});

import { askOpenAI } from '../cms/ai-provider';
import { AIError } from '../cms/ai-schema';
test('no key disables AI explicitly without making any network request',async()=>{
 const previousKey=process.env.OPENAI_API_KEY;const originalFetch=globalThis.fetch;let called=false;delete process.env.OPENAI_API_KEY;
 globalThis.fetch=async()=>{called=true;throw new Error('Unexpected network request');};
 try{await assert.rejects(()=>askOpenAI({prompt:'Améliore',context:{},history:[]}),(error:unknown)=>error instanceof AIError&&error.status===503&&error.code==='ai_not_configured');assert.equal(called,false);}
 finally{globalThis.fetch=originalFetch;if(previousKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=previousKey;}
});
