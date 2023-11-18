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

  return (
    <App
      page={page}
      onSetPageAndCount={(page) => {
        setSearchParams((params) => {
          params.set('page', page.toString());

          return params;
        });
      }}
    />
  );
}
