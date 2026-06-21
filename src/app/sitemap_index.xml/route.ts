import { GET as getIndex } from '../sitemap.xml/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  return getIndex();
}
