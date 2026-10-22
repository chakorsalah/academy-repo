import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticlePageView } from '@/components/page-renderers';
import { ManagedPage } from '@/components/managed-page';
import { publishedArticles,publishedPages,pagePath,mediaURL } from '@/lib/cms';
export const dynamic='force-dynamic';
type Args={params:Promise<{slug:string[]}>};
async function resolve(slug:string[]){let path='/'+slug.join('/');if(path==='/mot-du-president')path='/academie/president';const [articles,pages]=await Promise.all([publishedArticles(),publishedPages()]);return {article:articles.find(a=>a.path===path),page:pages.find(p=>pagePath(p)===path)};}
export async function generateMetadata({params}:Args):Promise<Metadata>{const {slug}=await params;const {article,page}=await resolve(slug);if(!article&&!page)return {title:'Page introuvable',robots:{index:false,follow:false}};const title=page?.seoTitle||article?.seoTitle||article?.title||page?.title;const description=page?.seoDescription||article?.seoDescription||article?.summary||page?.summary;const image=article?.hero||(page&&(mediaURL(page.cover)||page.legacyImage));return {title,description,alternates:{canonical:'/'+slug.join('/')+'/'},openGraph:{title,description,type:article?'article':'website',images:image?[{url:image}]:undefined}};}
export default async function Page({params}:Args){const {slug}=await params;const {article,page}=await resolve(slug);if(article)return <ArticlePageView article={article}/>;if(page)return <ManagedPage doc={page}/>;notFound();}
