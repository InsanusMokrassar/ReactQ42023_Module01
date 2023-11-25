import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { GithubRepository } from '../../../models/GithubRepository';
import { DefaultGitHubAPI } from '../../../utils/api/GithubApi';
import {
  PageResponse as IndexPageResponse,
  getServerSideProps as indexGetServerSideProps,
  default as IndexPage,
  DetailsRequest,
  DetailsResponse,
} from '../../index';
import { GithubErrorResponse } from '../../../models/GithubErrorResponse';

export const getServerSideProps = (async (context) => {
  const pageRequest = context.params as DetailsRequest;
  const basePageProps = await indexGetServerSideProps(context);
  const response = await DefaultGitHubAPI().get(
    pageRequest.username,
    pageRequest.repo
  );
  const asError = response as GithubErrorResponse;
  const asResponse = response as GithubRepository;
  return {
    props: {
      ...basePageProps.props,
      details: {
        request: pageRequest,
        response: {
          details: asError.message ? null : asResponse,
          error: asError.message ? asError : null,
        } as DetailsResponse,
      },
    },
  };
}) satisfies GetServerSideProps<IndexPageResponse>;

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return IndexPage(props);
}
