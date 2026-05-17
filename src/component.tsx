/* MIT License

Copyright (c) 2025 Moremi Vannak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
import { cn } from "@rinn7e/tea-cup-prelude";
import { pipe } from "fp-ts/lib/function";
import React, { memo } from "react";

import { type Props, mkPropsEq } from "./type";

export const PaginationComponent = <Item, ItemMsg, Err>({
  model,
  dispatch,
  config,
}: Props<Item, ItemMsg, Err>) => {
  const { page, pageAmount } = model;

  return (
    <div className="flex flex-col">
      {config.renderItems(model.items, (item, msg) => {
        dispatch({ _tag: "ItemMsg", item, msg });
      })}

      {renderPagination(page, pageAmount, (p) =>
        dispatch({ _tag: "ChangePage", page: p }),
      )}
    </div>
  );
};

const renderPagination = (
  currentPage: number,
  pageAmount: number,
  onPageChange: (page: number) => void,
) => {
  if (pageAmount <= 1) {
    return null;
  } else {
    const pages: ReadonlyArray<number | string> = pipe(pageAmount, (amount) => {
      if (amount <= 7) {
        return Array.from({ length: amount }, (_, i) => i + 1);
      } else if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "...", amount];
      } else if (currentPage >= amount - 3) {
        return [
          1,
          "...",
          amount - 4,
          amount - 3,
          amount - 2,
          amount - 1,
          amount,
        ];
      } else {
        return [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          amount,
        ];
      }
    });

    return (
      <nav className="my-[24px]" data-test="pagination-nav">
        <ul className="flex w-fit flex-wrap rounded-md border border-gray-200">
          {pages.map((p, index) => {
            if (p === "...") {
              return (
                <li
                  key={`ellipsis-${index}`}
                  className="border-r border-gray-200 last:border-r-0"
                >
                  <span className="flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm text-gray-500">
                    ...
                  </span>
                </li>
              );
            } else {
              const pageNum = p as number;
              return (
                <li
                  key={pageNum}
                  className="border-r border-gray-200 last:border-r-0"
                  data-test="pagination-item"
                >
                  <button
                    type="button"
                    className={cn(
                      "flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm transition-colors duration-200 hover:bg-gray-100 focus:outline-none",
                      pageNum === currentPage
                        ? "bg-gray-200 font-medium text-gray-700"
                        : "text-green-600",
                    )}
                    aria-current={pageNum === currentPage ? "page" : undefined}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    );
  }
};

export const PaginationMemo = memo(PaginationComponent, (prev, next) => {
  const propEq = mkPropsEq(prev.itemEq, prev.errEq);
  return propEq.equals(prev, next);
}) as <Item, ItemMsg, Err>(
  props: Props<Item, ItemMsg, Err>,
) => React.ReactElement;
