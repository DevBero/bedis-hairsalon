import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

export type IncrementTabNumberI = {
  searchParams: ReadonlyURLSearchParams;
  router: AppRouterInstance;
  pathname: string;
  currentTab: number;
};

export const incrementTabNumer = ({
  searchParams,
  router,
  pathname,
  currentTab,
}: IncrementTabNumberI) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("t", `${currentTab + 1}`);

  router.push(`${pathname}?${params.toString()}`);
};

export const decrementTabNumer = ({
  searchParams,
  router,
  pathname,
  currentTab,
}: IncrementTabNumberI) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("t", `${currentTab - 1}`);

  router.push(`${pathname}?${params.toString()}`);
};
