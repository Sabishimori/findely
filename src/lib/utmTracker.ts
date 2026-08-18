"use client";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
}

export function captureUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utm: UTMParams = {};

    const keys: (keyof UTMParams)[] = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ref",
    ];

    let hasUTM = false;
    keys.forEach((key) => {
      const val = urlParams.get(key);
      if (val) {
        utm[key] = val;
        hasUTM = true;
      }
    });

    if (hasUTM) {
      sessionStorage.setItem("findely_utm", JSON.stringify(utm));
    } else {
      const saved = sessionStorage.getItem("findely_utm");
      if (saved) {
        return JSON.parse(saved);
      }
    }

    return utm;
  } catch (e) {
    return {};
  }
}
