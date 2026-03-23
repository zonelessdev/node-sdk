import * as crypto from 'crypto';
import { Event } from '../types/Event';

/**
 * Error thrown when webhook signature verification fails.
 */
export class WebhookSignatureVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookSignatureVerificationError';
  }
}

/**
 * Webhooks utility for verifying webhook signatures and constructing events.
 */
export class Webhooks {
  private static readonly DEFAULT_TOLERANCE = 300;

  /**
   * Constructs and verifies the event from the webhook payload and signature.
   * Throws an error if the signature is invalid or the timestamp is out of tolerance.
   *
   * @param payload - The raw body of the request (must be a string or Buffer)
   * @param header - The 'Zoneless-Signature' header value
   * @param secret - The webhook signing secret (whsec_...)
   * @param tolerance - Time tolerance in seconds (default 300s / 5 minutes)
   * @returns The parsed and verified event object
   */
  constructEvent(
    payload: string | Buffer,
    header: string,
    secret: string,
    tolerance: number = Webhooks.DEFAULT_TOLERANCE
  ): Event {
    const payloadString = payload.toString();
    this.Verify(payloadString, header, secret, tolerance);
    return JSON.parse(payloadString) as Event;
  }

  private Verify(payload: string, header: string, secret: string, tolerance: number): void {
    const details = this.ParseHeader(header);

    if (!details.t || !details.v1) {
      throw new WebhookSignatureVerificationError(
        'Unable to extract timestamp and signatures from header'
      );
    }

    const timestampStr = Array.isArray(details.t) ? details.t[0] : details.t;
    const timestamp = parseInt(timestampStr, 10);
    const now = Math.floor(Date.now() / 1000);

    if (tolerance > 0 && now - timestamp > tolerance) {
      throw new WebhookSignatureVerificationError('Timestamp outside the tolerance zone');
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    const signatures = Array.isArray(details.v1) ? details.v1 : [details.v1];
    const match = signatures.some((sig) => {
      const bufferA = Buffer.from(sig);
      const bufferB = Buffer.from(expectedSignature);
      if (bufferA.length !== bufferB.length) return false;
      return crypto.timingSafeEqual(bufferA, bufferB);
    });

    if (!match) {
      throw new WebhookSignatureVerificationError(
        'No signatures found matching the expected signature for payload'
      );
    }
  }

  private ParseHeader(header: string): Record<string, string | string[]> {
    return header.split(',').reduce(
      (acc, item) => {
        const [key, value] = item.split('=');
        if (key && value) {
          if (acc[key]) {
            if (Array.isArray(acc[key])) {
              (acc[key] as string[]).push(value);
            } else {
              acc[key] = [acc[key] as string, value];
            }
          } else {
            acc[key] = value;
          }
        }
        return acc;
      },
      {} as Record<string, string | string[]>
    );
  }
}
