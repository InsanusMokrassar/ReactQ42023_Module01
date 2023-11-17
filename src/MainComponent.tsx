import { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import App from './App';

export default function MainComponent({}: object): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageString = searchParams.get('page');
  let page = 0;
  if (pageString != null && !isNaN(parseInt(pageString))) {
    page = parseInt(pageString);
    if (page < 0) {
      page = 0;
    }
  }

  const countString = searchParams.get('count');
  let count = 10;
  if (countString != null && !isNaN(parseInt(countString))) {
    count = parseInt(countString);
    if (count < 1) {
      count = 1;
    }
  }

  return (
    <App
      page={page}
      count={count}
      onSetPageAndCount={(page, count) => {
        setSearchParams((params) => {
          params.set('page', page.toString());
          params.set('count', count.toString());

          return params;
        });
      }}
    />
  );
}
