async function checkBoard(name, ghId, leverId, ashbyId) {
  let found = null;
  if (ashbyId) {
    try {
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${ashbyId}`);
      if (res.ok) {
        const d = await res.json();
        if (d.jobs?.length > 0) return { ats: 'ashby', boardId: ashbyId, count: d.jobs.length, sample: d.jobs[0] };
      }
    } catch {}
  }
  if (ghId) {
    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${ghId}/jobs`);
      if (res.ok) {
        const d = await res.json();
        if (d.jobs?.length > 0) return { ats: 'greenhouse', boardId: ghId, count: d.jobs.length, sample: d.jobs[0] };
      }
    } catch {}
  }
  if (leverId) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${leverId}`);
      if (res.ok) {
        const d = await res.json();
        if (d?.length > 0) return { ats: 'lever', boardId: leverId, count: d.length, sample: d[0] };
      }
    } catch {}
  }
  return null;
}

const targets = [
  { name: 'Postman', slug: 'postman' },
  { name: 'Hasura', slug: 'hasura' },
  { name: 'InVideo', slug: 'invideo' },
  { name: 'Sarvam AI', slug: 'sarvam' },
  { name: 'OpenAI', slug: 'openai' },
  { name: 'Anthropic', slug: 'anthropic' },
  { name: 'Stripe', slug: 'stripe' },
  { name: 'Linear', slug: 'linear' },
  { name: 'Vercel', slug: 'vercel' },
  { name: 'Supabase', slug: 'supabase' },
  { name: 'Scale AI', slug: 'scaleai' },
  { name: 'Figma', slug: 'figma' },
  { name: 'Mistral AI', slug: 'mistral' },
  { name: 'DeepL', slug: 'deepl' },
  { name: 'Synthesia', slug: 'synthesia' },
  { name: 'Lovable', slug: 'lovable' },
  { name: 'Monzo', slug: 'monzo' },
  { name: 'Revolut', slug: 'revolut' },
  { name: 'Klarna', slug: 'klarna' },
  { name: 'Wise', slug: 'wise' },
  { name: 'Cursor', slug: 'anysphere' },
  { name: 'Cognition AI', slug: 'cognition' },
  { name: 'Mercari', slug: 'mercari' },
];

async function main() {
  for (const t of targets) {
    const res = await checkBoard(t.name, t.slug, t.slug, t.slug);
    if (res) {
      console.log(`✅ ${t.name}: ${res.ats} (${res.boardId}) -> ${res.count} jobs. Sample apply: ${res.sample.absolute_url || res.sample.applyUrl || res.sample.hostedUrl || res.sample.jobUrl}`);
    } else {
      console.log(`❌ ${t.name}: no direct board found for slug '${t.slug}'`);
    }
  }
}
main();
