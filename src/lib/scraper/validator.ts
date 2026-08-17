/**
 * Findely Job Deep-Link Liveness & Title Validator
 * Sends non-destructive GET requests to apply_url to verify:
 * 1. HTTP 200 OK
 * 2. Presence of the job title in page body/metadata (guards against generic careers homepage redirects)
 * Automatically updates last_validated, tracks failure streaks, and deactivates listings after 3 failures.
 */

import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq, and, sql, asc } from "drizzle-orm";

export interface JobToValidate {
  id: string;
  title: string;
  apply_url: string | null;
  validation_failures?: number | null;
  validation_status?: string | null;
  last_validated?: Date | null;
  is_active?: boolean | null;
}

export interface ValidationResult {
  jobId: string;
  title: string;
  applyUrl: string;
  isValid: boolean;
  httpStatus?: number;
  titleMatched: boolean;
  failureCount: number;
  deactivated: boolean;
  reason?: string;
}

/**
 * Normalizes title strings for fuzzy matching across rendered HTML/meta tags.
 * e.g. "Senior Software Engineer - Infrastructure (Remote)" -> checks for core keywords
 */
function checkTitleMatch(bodyText: string, jobTitle: string): boolean {
  if (!bodyText || !jobTitle) return false;
  const lowerBody = bodyText.toLowerCase();
  const cleanTitle = jobTitle.toLowerCase().trim();

  // 1. Direct exact title match
  if (lowerBody.includes(cleanTitle)) {
    return true;
  }

  // 2. Clean parentheticals (e.g. "(Remote)", "(Hybrid)", "[US/EU]")
  const strippedTitle = cleanTitle
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[-–—|/].*$/g, "")
    .trim();

  if (strippedTitle.length > 3 && lowerBody.includes(strippedTitle)) {
    return true;
  }

  // 3. Keyword token matching (all core title words must appear in proximity/document)
  const tokens = strippedTitle
    .split(/\s+/)
    .filter((t) => t.length > 2 && !["and", "the", "for", "with"].includes(t));

  if (tokens.length >= 2) {
    const allTokensPresent = tokens.every((t) => lowerBody.includes(t));
    if (allTokensPresent) return true;
  }

  return false;
}

/**
 * Validates a single job by fetching its apply_url and verifying 200 OK + title presence
 */
export async function validateJobApplyUrl(job: JobToValidate): Promise<ValidationResult> {
  const applyUrl = job.apply_url?.trim();
  const currentFailures = job.validation_failures || 0;

  if (!applyUrl || !applyUrl.startsWith("http")) {
    const newFailures = currentFailures + 1;
    const deactivated = newFailures >= 3;
    await db
      .update(jobs)
      .set({
        last_validated: new Date(),
        validation_failures: newFailures,
        validation_status: deactivated ? "failed" : "flagged",
        is_active: !deactivated,
      })
      .where(eq(jobs.id, job.id));

    return {
      jobId: job.id,
      title: job.title,
      applyUrl: applyUrl || "",
      isValid: false,
      titleMatched: false,
      failureCount: newFailures,
      deactivated,
      reason: "Missing or invalid apply_url format",
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(applyUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const newFailures = currentFailures + 1;
      const deactivated = newFailures >= 3;
      await db
        .update(jobs)
        .set({
          last_validated: new Date(),
          validation_failures: newFailures,
          validation_status: deactivated ? "failed" : "flagged",
          is_active: !deactivated,
        })
        .where(eq(jobs.id, job.id));

      return {
        jobId: job.id,
        title: job.title,
        applyUrl,
        isValid: false,
        httpStatus: res.status,
        titleMatched: false,
        failureCount: newFailures,
        deactivated,
        reason: `HTTP ${res.status} returned by ATS portal`,
      };
    }

    const html = await res.text();
    const titleFound = checkTitleMatch(html, job.title);

    if (!titleFound) {
      const newFailures = currentFailures + 1;
      const deactivated = newFailures >= 3;
      await db
        .update(jobs)
        .set({
          last_validated: new Date(),
          validation_failures: newFailures,
          validation_status: deactivated ? "failed" : "flagged",
          is_active: !deactivated,
        })
        .where(eq(jobs.id, job.id));

      return {
        jobId: job.id,
        title: job.title,
        applyUrl,
        isValid: false,
        httpStatus: res.status,
        titleMatched: false,
        failureCount: newFailures,
        deactivated,
        reason: "Job title not found in response body (likely redirected to generic homepage)",
      };
    }

    // Success: URL returns 200 and matches role title
    if (!job.id.startsWith("test_") && !job.id.startsWith("temp") && !job.id.startsWith("founder_sub_")) {
      try {
        await db
          .update(jobs)
          .set({
            last_validated: new Date(),
            validation_failures: 0,
            validation_status: "valid",
            is_active: true,
          })
          .where(eq(jobs.id, job.id));
      } catch (dbErr) {
        console.warn("[Validator] DB update notice:", dbErr);
      }
    }

    return {
      jobId: job.id,
      title: job.title,
      applyUrl,
      isValid: true,
      httpStatus: 200,
      titleMatched: true,
      failureCount: 0,
      deactivated: false,
    };
  } catch (err: any) {
    const newFailures = currentFailures + 1;
    const deactivated = newFailures >= 3;
    if (!job.id.startsWith("test_") && !job.id.startsWith("temp") && !job.id.startsWith("founder_sub_")) {
      try {
        await db
          .update(jobs)
          .set({
            last_validated: new Date(),
            validation_failures: newFailures,
            validation_status: deactivated ? "failed" : "flagged",
            is_active: !deactivated,
          })
          .where(eq(jobs.id, job.id));
      } catch (dbErr) {
        console.warn("[Validator] DB update notice:", dbErr);
      }
    }

    return {
      jobId: job.id,
      title: job.title,
      applyUrl,
      isValid: false,
      titleMatched: false,
      failureCount: newFailures,
      deactivated,
      reason: err.name === "AbortError" ? "Request timed out (10s)" : err.message,
    };
  }
}

/**
 * Validates a batch of jobs in FIFO order of validation age
 */
export async function validateBatchJobs(options?: {
  limit?: number;
  companyId?: string;
  concurrency?: number;
}): Promise<{
  totalChecked: number;
  validCount: number;
  flaggedCount: number;
  deactivatedCount: number;
  results: ValidationResult[];
}> {
  const limit = options?.limit || 30;
  const concurrency = options?.concurrency || 5;

  let query = db
    .select({
      id: jobs.id,
      title: jobs.title,
      apply_url: jobs.apply_url,
      validation_failures: jobs.validation_failures,
      validation_status: jobs.validation_status,
      last_validated: jobs.last_validated,
      is_active: jobs.is_active,
    })
    .from(jobs)
    .where(eq(jobs.is_active, true))
    .orderBy(asc(jobs.last_validated))
    .limit(limit);

  const pendingJobs = await query;

  const results: ValidationResult[] = [];
  let validCount = 0;
  let flaggedCount = 0;
  let deactivatedCount = 0;

  // Process in chunks for controlled concurrency
  for (let i = 0; i < pendingJobs.length; i += concurrency) {
    const chunk = pendingJobs.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map((j) => validateJobApplyUrl(j)));

    for (const r of chunkResults) {
      results.push(r);
      if (r.isValid) validCount++;
      else if (r.deactivated) deactivatedCount++;
      else flaggedCount++;
    }
  }

  return {
    totalChecked: pendingJobs.length,
    validCount,
    flaggedCount,
    deactivatedCount,
    results,
  };
}
