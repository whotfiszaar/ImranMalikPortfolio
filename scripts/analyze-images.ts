import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = '/home/z/my-project/upload';
const files = ['1.JPG', '11.jpg', '12.JPG', '15.JPG', '17.JPG', '19.jpg', '13.JPG', 'i1.jpg', 'i6.jpg'];

async function main() {
  const zai = await ZAI.create();
  const results: Record<string, string> = {};

  for (const file of files) {
    try {
      const filePath = path.join(UPLOAD_DIR, file);
      const buffer = fs.readFileSync(filePath);
      const base64 = buffer.toString('base64');
      const mime = file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

      const response = await zai.chat.completions.createVision({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this photo in 1-2 short sentences: what setting is shown (retail store interior, beauty store, airport store, office, event, team photo, portrait of a man, etc), and any visible brand names or logos (like Tira, IKEA, Kama Ayurveda, Forest Essentials).'
              },
              {
                type: 'image_url',
                image_url: { url: `data:${mime};base64,${base64}` }
              }
            ]
          }
        ],
        thinking: { type: 'disabled' }
      } as any);

      const content = response.choices[0]?.message?.content ?? 'No description';
      results[file] = content;
      console.log(`\n=== ${file} ===`);
      console.log(content);
    } catch (err: any) {
      console.log(`\n=== ${file} === ERROR: ${err.message}`);
      results[file] = `ERROR: ${err.message}`;
    }
  }

  fs.writeFileSync('/home/z/my-project/scripts/image-analysis.json', JSON.stringify(results, null, 2));
  console.log('\nDone. Results saved.');
}

main().catch(console.error);
