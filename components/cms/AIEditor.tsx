"use client";
import { useDocumentInfo,useFormModified } from '@payloadcms/ui';
import { AssistantWorkbench } from './AssistantWorkbench';
export function AIEditor(){const {id,collectionSlug}=useDocumentInfo();const modified=useFormModified();if(!['pages','articles','reports'].includes(collectionSlug||''))return null;return <details className="ai-inline"><summary><span>✧ Modifier avec l’IA</span><small>Rédiger · Traduire · Structurer</small></summary>{id?<AssistantWorkbench key={`${collectionSlug}:${id}`} fixed={{collection:collectionSlug as 'pages'|'articles'|'reports',id:Number(id)}} blocked={modified}/>:<p className="ai-notice">Créez et enregistrez d’abord ce contenu pour utiliser l’assistant.</p>}</details>;}
