"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

let recaptchaScriptPromise = null;

/**
 * Safely loads Google reCAPTCHA explicit script once across the application lifecycle.
 */
function loadRecaptchaScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cannot load reCAPTCHA in SSR"));
  }

  if (window.grecaptcha?.render) {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
    if (existingScript) {
      if (window.grecaptcha?.render) {
        resolve(window.grecaptcha);
        return;
      }
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (window.grecaptcha?.render) {
          clearInterval(interval);
          resolve(window.grecaptcha);
        } else if (Date.now() - startTime > 10000) {
          clearInterval(interval);
          reject(new Error("Timeout waiting for existing reCAPTCHA script to initialize"));
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha?.ready) {
        window.grecaptcha.ready(() => {
          resolve(window.grecaptcha);
        });
      } else {
        resolve(window.grecaptcha);
      }
    };

    script.onerror = (err) => {
      recaptchaScriptPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

/**
 * Reusable Google reCAPTCHA v2 Checkbox client component.
 */
const ReCaptcha = forwardRef(function ReCaptcha(
  { onVerify, onExpire, theme = "dark", className },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Determine effective theme (supports "dark", "light", or "auto" to match dark mode)
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (theme === "auto") {
      if (typeof document !== "undefined") {
        const isDark =
          document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark";
        return isDark ? "dark" : "light";
      }
      return "dark";
    }
    return theme;
  });

  // Keep callback refs fresh
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Handle dynamic theme changes and match dark mode if theme is "auto"
  useEffect(() => {
    if (theme !== "auto") {
      setResolvedTheme(theme);
      return;
    }

    const updateThemeFromDom = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";
      setResolvedTheme(isDark ? "dark" : "light");
    };

    updateThemeFromDom();

    const observer = new MutationObserver(updateThemeFromDom);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, [theme]);

  // Warn in dev if site key is missing
  useEffect(() => {
    if (!siteKey && process.env.NODE_ENV !== "production") {
      console.warn(
        "reCAPTCHA warning: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing. reCAPTCHA widget will not render."
      );
    }
  }, [siteKey]);

  // Expose imperative API for reset and cleanup
  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch (e) {
            console.error("Error resetting reCAPTCHA:", e);
          }
        }
      },
      getResponse: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          return window.grecaptcha.getResponse(widgetIdRef.current);
        }
        return "";
      },
      getWidgetId: () => widgetIdRef.current,
      cleanup: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      },
    }),
    []
  );

  // Initialize and render reCAPTCHA
  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let isMounted = true;

    loadRecaptchaScript()
      .then((grecaptcha) => {
        if (!isMounted || !containerRef.current) return;

        // Clean container before render (especially on theme change or strict mode remount)
        if (widgetIdRef.current !== null) {
          try {
            grecaptcha.reset(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }
        containerRef.current.innerHTML = "";

        const widgetId = grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: resolvedTheme,
          callback: (token) => {
            onVerifyRef.current?.(token);
          },
          "expired-callback": () => {
            onExpireRef.current?.();
          },
        });

        widgetIdRef.current = widgetId;
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load Google reCAPTCHA:", error);
        }
      });

    return () => {
      isMounted = false;
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [siteKey, resolvedTheme]);

  // Render fallback if site key is missing
  if (!siteKey) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "flex h-[78px] w-[304px] items-center justify-center rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 px-4 text-center text-xs text-amber-400 select-none",
          className
        )}
      >
        <span>reCAPTCHA (Site key missing)</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("inline-block min-h-[78px] min-w-[304px]", className)}
    />
  );
});

export default ReCaptcha;
