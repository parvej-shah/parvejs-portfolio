import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decodeInlineImage,
  InlineImageError,
  INLINE_IMAGE_MAX_BYTES,
  sniffImageContentType,
} from "@/lib/services/inlineImage";

/** Smallest byte sequences that carry each format's signature. */
const PNG = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(8),
]);
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(12)]);
const GIF = Buffer.concat([Buffer.from("GIF89a", "latin1"), Buffer.alloc(12)]);
const WEBP = Buffer.concat([
  Buffer.from("RIFF", "latin1"),
  Buffer.alloc(4),
  Buffer.from("WEBP", "latin1"),
  Buffer.alloc(4),
]);
const AVIF = Buffer.concat([
  Buffer.alloc(4),
  Buffer.from("ftypavif", "latin1"),
  Buffer.alloc(4),
]);

describe("image format sniffing", () => {
  it("identifies each supported format from its bytes", () => {
    assert.equal(sniffImageContentType(PNG), "image/png");
    assert.equal(sniffImageContentType(JPEG), "image/jpeg");
    assert.equal(sniffImageContentType(GIF), "image/gif");
    assert.equal(sniffImageContentType(WEBP), "image/webp");
    assert.equal(sniffImageContentType(AVIF), "image/avif");
  });

  it("does not mistake other ISO base media files for AVIF", () => {
    // An MP4 shares the ftyp box header; only the brand separates them.
    const mp4 = Buffer.concat([Buffer.alloc(4), Buffer.from("ftypisom", "latin1"), Buffer.alloc(4)]);
    assert.equal(sniffImageContentType(mp4), null);
  });

  it("returns null for data that is not an image", () => {
    assert.equal(sniffImageContentType(Buffer.from("<!doctype html><html></html>")), null);
    assert.equal(sniffImageContentType(Buffer.from([0x00, 0x01])), null);
  });
});

describe("inline image decoding", () => {
  it("accepts raw base64 and reports the sniffed type", () => {
    const result = decodeInlineImage(PNG.toString("base64"));
    assert.equal(result.contentType, "image/png");
    assert.deepEqual(result.buffer, PNG);
  });

  it("accepts a base64 data URL", () => {
    const result = decodeInlineImage(`data:image/png;base64,${PNG.toString("base64")}`);
    assert.equal(result.contentType, "image/png");
    assert.deepEqual(result.buffer, PNG);
  });

  it("ignores the line wrapping clients add to long base64", () => {
    const wrapped = JPEG.toString("base64").replace(/(.{4})/g, "$1\n");
    assert.equal(decodeInlineImage(wrapped).contentType, "image/jpeg");
  });

  it("ignores a declared type that contradicts the bytes", () => {
    // The declared type is a claim about content the server is about to decode.
    const result = decodeInlineImage(`data:image/jpeg;base64,${PNG.toString("base64")}`);
    assert.equal(result.contentType, "image/png");
  });

  it("rejects a non-base64 data URL", () => {
    assert.throws(() => decodeInlineImage("data:image/png,%89PNG"), InlineImageError);
  });

  it("rejects malformed base64 rather than decoding it lossily", () => {
    // Buffer.from would silently drop the bad characters and yield a corrupt image.
    assert.throws(() => decodeInlineImage("!!!!not base64!!!!"), InlineImageError);
    assert.throws(() => decodeInlineImage("iVBORw0KGgoAAAANSUhEUg"), InlineImageError);
  });

  it("rejects an empty payload", () => {
    assert.throws(() => decodeInlineImage(""), InlineImageError);
    assert.throws(() => decodeInlineImage("   \n  "), InlineImageError);
  });

  it("rejects valid base64 that is not an image", () => {
    const html = Buffer.from("<!doctype html><html></html>").toString("base64");
    assert.throws(() => decodeInlineImage(html), InlineImageError);
  });

  it("refuses an oversized payload from its encoded length, before decoding", () => {
    const oversized = "A".repeat(Math.ceil((INLINE_IMAGE_MAX_BYTES * 4) / 3 / 4) * 4 + 4);
    assert.throws(() => decodeInlineImage(oversized), /limit/);
  });

  it("keeps the ceiling well under the remote fetch limit", () => {
    // Inline bytes cross the model's context; remote ones do not, so this path
    // is capped tighter than remoteImage's 5MB on purpose.
    assert.ok(INLINE_IMAGE_MAX_BYTES <= 2 * 1024 * 1024);
  });
});
