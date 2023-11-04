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
  const toFirstPageContent =
    page > 1 ? (
      <button onClick={() => onSetPage(0, count)}>{'<<'}</button>
    ) : (
      <></>
    );

  const toPreviousPageContent =
    page > 0 ? (
      <button onClick={() => onSetPage(page - 1, count)}>{'<'}</button>
    ) : (
      <></>
    );

  const toNextPageContent =
    wholeObjectsAmount && wholeObjectsAmount > page * count ? (
      <button onClick={() => onSetPage(page + 1, count)}>{'>'}</button>
    ) : (
      <></>
    );

  const toLatestPageContent =
    wholeObjectsAmount && wholeObjectsAmount > page * count + count ? (
      <button
        onClick={() => onSetPage(Math.floor(wholeObjectsAmount / count), count)}
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
          onChange={(event) => onSetPage(page, parseInt(event.target.value))}
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
