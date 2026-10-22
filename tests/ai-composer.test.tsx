import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AssistantWorkbench } from '../components/cms/AssistantWorkbench';

test('inline assistant does not nest a form inside the Payload editor form', () => {
  const html = renderToStaticMarkup(createElement('form', { id: 'payload-editor' },
    createElement(AssistantWorkbench, { fixed: { collection: 'articles', id: 6 } })));
  assert.equal((html.match(/<form(?:\s|>)/g) || []).length, 1);
  assert.equal((html.match(/<\/form>/g) || []).length, 1);
  assert.match(html, /role="group" aria-label="Demande à l’assistant"/);
});

test('assistant buttons cannot submit the surrounding CMS form', () => {
  const html = renderToStaticMarkup(createElement(AssistantWorkbench, {
    fixed: { collection: 'pages', id: 1 },
  }));
  const buttons = html.match(/<button\b[^>]*>/g) || [];
  assert.ok(buttons.length > 0);
  for (const button of buttons) assert.match(button, /type="button"/);
  assert.match(html, /htmlFor="ai-page-prompt"|for="ai-page-prompt"/);
  assert.match(html, /<textarea id="ai-page-prompt"/);
});

test('standalone assistant also renders valid form-free composer markup', () => {
  const html = renderToStaticMarkup(createElement(AssistantWorkbench));
  assert.doesNotMatch(html, /<form(?:\s|>)/);
  assert.match(html, /<textarea id="ai-global-prompt"/);
});
