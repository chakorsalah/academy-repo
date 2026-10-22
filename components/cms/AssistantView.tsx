import type { AdminViewServerProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import { AssistantWorkbench } from './AssistantWorkbench';
export function AssistantView(props:AdminViewServerProps){const {req,locale,permissions,visibleEntities}=props.initPageResult;return <DefaultTemplate {...props} req={req} payload={req.payload} user={req.user||undefined} i18n={req.i18n} locale={locale} permissions={permissions} visibleEntities={visibleEntities}><div className="ai-page"><header><p className="cms-eyebrow">ACADÉMIE · STUDIO ÉDITORIAL</p><h1>Votre site, avec vos mots.</h1><p>Choisissez les contenus à faire évoluer. Décrivez votre idée, relisez la proposition et enregistrez un brouillon.</p></header><AssistantWorkbench/></div></DefaultTemplate>;}
