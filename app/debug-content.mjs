// Simulate the logic
const storeContent = [
  {
    type: 'paragraph',
    children: [{ text: 'Willkommen bei MasterDoc. Beginne hier zu tippen...' }],
  }
];

const defaultContent = [
  { type: 'paragraph', children: [{ text: 'Willkommen bei MasterDoc. Beginne hier zu tippen...' }] }
];

const content = Array.isArray(storeContent) && storeContent.length > 0 ? storeContent : defaultContent;

console.log('storeContent:', JSON.stringify(storeContent, null, 2));
console.log('defaultContent:', JSON.stringify(defaultContent, null, 2));
console.log('content:', JSON.stringify(content, null, 2));
console.log('content is undefined?', content === undefined);
console.log('content is array?', Array.isArray(content));
