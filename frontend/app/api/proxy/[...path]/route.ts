import { NextRequest, NextResponse } from 'next/server';

async function proxyRequest(
  method: string,
  path: string,
  body?: unknown
): Promise<Response> {
  const backendUrl = `${process.env.BACKEND_URL}${path}`;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error('API_KEY not set in environment');
    return NextResponse.json(
      { message: 'Server configuration error' },
      { status: 500 }
    );
  }

  if (!process.env.BACKEND_URL) {
    console.error('BACKEND_URL not set in environment');
    return NextResponse.json(
      { message: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const fetchInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
      fetchInit.body = JSON.stringify(body);
    }

    console.log(`Proxying ${method} ${backendUrl}`);
    const res = await fetch(backendUrl, fetchInit);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend error: ${res.status}`, errorText);
      try {
        const error = JSON.parse(errorText);
        return NextResponse.json(error, { status: res.status });
      } catch {
        return NextResponse.json(
          { message: `Backend error: ${res.status}` },
          { status: res.status }
        );
      }
    }

    const data = await res.json();
    const statusCode = method === 'POST' ? 201 : 200;
    return NextResponse.json(data, { status: statusCode });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to proxy request',
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = `/${pathArray.join('/')}`;
  return proxyRequest('GET', path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const path = `/${pathArray.join('/')}`;
    const body = await req.json().catch(() => undefined);
    return proxyRequest('POST', path, body);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { message: 'Failed to parse request' },
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const path = `/${pathArray.join('/')}`;
    const body = await req.json().catch(() => undefined);
    return proxyRequest('PATCH', path, body);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { message: 'Failed to parse request' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = `/${pathArray.join('/')}`;
  return proxyRequest('DELETE', path);
}
