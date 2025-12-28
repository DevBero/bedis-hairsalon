import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

export type IncrementTabNumberI = {
  searchParams: ReadonlyURLSearchParams;
  router: AppRouterInstance;
  pathname: string;
};

export const incrementTabNumer = ({
  searchParams,
  router,
  pathname,
}: IncrementTabNumberI) => {
  const params = new URLSearchParams(searchParams.toString());
  const current = Number(params.get("t") ?? "0");
  params.set("t", String(current + 1));

  router.push(`${pathname}?${params.toString()}`);
};

export const decrementTabNumer = ({
  searchParams,
  router,
  pathname,
}: IncrementTabNumberI) => {
  const params = new URLSearchParams(searchParams.toString());
  const current = Number(params.get("t") ?? "0");
  const next = Math.max(0, current - 1);
  params.set("t", String(next));

  router.push(`${pathname}?${params.toString()}`);
};
