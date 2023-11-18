import { ReactNode } from 'react';

const navigationCountsVariants: Array<number> = [5, 10, 15, 25, 50, 100];

export default function Navigation({
  page,
  count,
  wholeObjectsAmount,
  onSetPage,
}: {
  page: number;
  count: number;
  wholeObjectsAmount?: number;
  onSetPage: (page: number, count: number) => void;
}): ReactNode {
  const maxPages = wholeObjectsAmount
    ? Math.floor(wholeObjectsAmount / count)
    : undefined;

  const toFirstPageContent =
    page > 1 ? (
      <button role={'navigation_to_first'} onClick={() => onSetPage(0, count)}>
        {'<<'}
      </button>
    ) : (
      <></>
    );

  const toPreviousPageContent =
    page > 0 ? (
      <button
        role={'navigation_to_previous'}
        onClick={() => onSetPage(page - 1, count)}
      >
        {'<'}
      </button>
    ) : (
      <></>
    );

  const toNextPageContent =
    maxPages && maxPages > page ? (
      <button
        role={'navigation_to_next'}
        onClick={() => onSetPage(page + 1, count)}
      >
        {'>'}
      </button>
    ) : (
      <></>
    );

  const toLatestPageContent =
    maxPages && maxPages > page + 1 ? (
      <button
        role={'navigation_to_last'}
        onClick={() => onSetPage(maxPages, count)}
      >
        {'>>'}
      </button>
    ) : (
      <></>
    );

  return (
    <div>
      {toFirstPageContent}
      {toPreviousPageContent}
      <span>
        <select
          value={count}
          role={'navigation_count_select'}
          onChange={(event) => onSetPage(0, parseInt(event.target.value))}
        >
          {navigationCountsVariants.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </select>
      </span>
      {toNextPageContent}
      {toLatestPageContent}
    </div>
  );
}
