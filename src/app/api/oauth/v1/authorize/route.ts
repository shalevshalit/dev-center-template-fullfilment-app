import { type NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { wixAppClient } from '@/app/utils/wix-sdk.app';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log('app install requested');
  const token = searchParams.get('token');
  if (!token) {
    return new Response(`Cannot perform authorize with no token query param`, {
      status: 403,
    });
  }
  const stateObject = JSON.parse(searchParams.get('state') || '{}');
  // the state object allows you to transfer information throughout the installation flow
  stateObject.testKey = 'test value';

  // process.env.URL is used in Netlify since request.nextUrl.href might include an invalid port number in Next 14
  // see https://answers.netlify.com/t/error-x-forwarded-host-header-with-value-example-netlify-app-80-does-not-match-origin-header-with-value-example-netlify-app-from-a-forwarded-server-actions-request/106736
  const baseUrl = process.env.URL || request.nextUrl.href.split('/api/oauth/')[0];

  return redirect(
    wixAppClient.auth.getInstallUrl({
      token,
      state: stateObject,
      redirectUrl: `${baseUrl}/api/oauth/v1/signup`,
    }),
  );
}
