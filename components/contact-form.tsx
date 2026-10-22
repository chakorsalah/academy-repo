"use client";
import { useState } from 'react';
export function ContactForm({ email }: { email: string }) {
 const [message,setMessage]=useState('');
 return <form onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);window.location.href=`mailto:${email}?subject=${encodeURIComponent(String(data.get('subject')||'Contact Académie'))}&body=${encodeURIComponent(`${data.get('name')} <${data.get('email')}>\n\n${data.get('message')}`)}`;setMessage('Votre application email va s’ouvrir avec le message préparé.');}}>
  <label>Nom complet<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Sujet<input name="subject" required /></label><label>Message<textarea name="message" rows={6} required /></label><button type="submit">Préparer l’email ↗</button><p aria-live="polite">{message || 'Ce formulaire prépare votre message dans votre application email.'}</p>
 </form>;
}
