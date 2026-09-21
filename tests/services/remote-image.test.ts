import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertFetchableUrl, isDisallowedAddress, RemoteImageError } from "@/lib/services/remoteImage";

describe("remote image URL rules", () => {
  it("accepts a public https image URL", () => {
    assert.doesNotThrow(() => assertFetchableUrl("https://cdn.example.com/photo.png"));
  });

  it("rejects plaintext http, which a network position could swap in transit", () => {
    assert.throws(() => assertFetchableUrl("http://cdn.example.com/photo.png"), RemoteImageError);
  });

  it("rejects schemes that are not fetches we ever want to make", () => {
    for (const url of [
      "file:///etc/passwd",
      "data:image/png;base64,iVBORw0KGgo=",
      "gopher://example.com/",
      "ftp://example.com/x.png",
    ]) {
      assert.throws(() => assertFetchableUrl(url), RemoteImageError, `should reject ${url}`);
    }
  });

  it("rejects a relative or malformed URL", () => {
    assert.throws(() => assertFetchableUrl("/images/photo.png"), RemoteImageError);
    assert.throws(() => assertFetchableUrl("not a url"), RemoteImageError);
  });
});

describe("address filtering", () => {
  it("blocks the cloud metadata endpoint", () => {
    // The address that turns an image fetcher into a credential leak.
    assert.equal(isDisallowedAddress("169.254.169.254"), true);
  });

  it("blocks loopback", () => {
    assert.equal(isDisallowedAddress("127.0.0.1"), true);
    assert.equal(isDisallowedAddress("127.1.2.3"), true);
    assert.equal(isDisallowedAddress("::1"), true);
  });

  it("blocks every RFC 1918 private range", () => {
    for (const address of ["10.0.0.1", "10.255.255.255", "172.16.0.1", "172.31.255.1", "192.168.1.1"]) {
      assert.equal(isDisallowedAddress(address), true, `${address} must be blocked`);
    }
  });

  it("blocks link-local, carrier-grade NAT, multicast and 0.0.0.0", () => {
    assert.equal(isDisallowedAddress("169.254.1.1"), true);
    assert.equal(isDisallowedAddress("100.64.0.1"), true);
    assert.equal(isDisallowedAddress("224.0.0.1"), true);
    assert.equal(isDisallowedAddress("0.0.0.0"), true);
  });

  it("blocks IPv6 unique-local and link-local", () => {
    assert.equal(isDisallowedAddress("fd00::1"), true);
    assert.equal(isDisallowedAddress("fc00::1"), true);
    assert.equal(isDisallowedAddress("fe80::1"), true);
  });

  it("judges IPv4-mapped IPv6 by its IPv4 value, not its prefix", () => {
    // ::ffff:169.254.169.254 reaches metadata just as well as the bare address.
    assert.equal(isDisallowedAddress("::ffff:169.254.169.254"), true);
    assert.equal(isDisallowedAddress("::ffff:127.0.0.1"), true);
    assert.equal(isDisallowedAddress("::ffff:8.8.8.8"), false);
  });

  it("allows ordinary public addresses", () => {
    for (const address of ["8.8.8.8", "1.1.1.1", "93.184.216.34", "2606:4700:4700::1111"]) {
      assert.equal(isDisallowedAddress(address), false, `${address} should be allowed`);
    }
  });

  it("treats anything that is not an IP literal as disallowed", () => {
    // Callers resolve hostnames first; a non-IP reaching here is a bug, and the
    // safe answer to "is this address public?" for a non-address is no.
    assert.equal(isDisallowedAddress("example.com"), true);
    assert.equal(isDisallowedAddress(""), true);
  });

  it("does not over-block neighbours of private ranges", () => {
    assert.equal(isDisallowedAddress("172.15.0.1"), false);
    assert.equal(isDisallowedAddress("172.32.0.1"), false);
    assert.equal(isDisallowedAddress("192.167.1.1"), false);
    assert.equal(isDisallowedAddress("11.0.0.1"), false);
  });
});
