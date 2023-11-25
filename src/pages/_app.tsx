import '../App.css';
import '../components/Result.css';
import '../index.css';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  return { ...ctx };
};

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  return { ...ctx };
};
