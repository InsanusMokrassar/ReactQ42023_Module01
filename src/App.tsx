import React, { Component, ReactNode } from 'react';
import './App.css';
import Search from './components/Search';
import SearchPanel from './components/SearchPanel';
import { defaultSearchHistoryWrapper } from './utils/SearchHistoryWrapper';
import { GithubRepository, DefaultGitHubAPI } from './utils/api/github_api';
import Results from './components/Result';
import ErrorBoundary from './ErrorBoundary';
import ErrorThrower from './ErrorThrower';

export default class App extends Component {
  private recentSearches: Array<string> = [];
  private searchState: string = '';
  private results: Array<GithubRepository> = [];
  private _isMounted: boolean = false;
  private throwError: boolean = false;

  private doSearch(query: string = this.searchState) {
    defaultSearchHistoryWrapper.add(query);
    this.updateRecentSearches();
    DefaultGitHubAPI.search(query).then((result) => this.setResults(result));
  }

  constructor(params: object = {}) {
    super(params);
    this.updateRecentSearches();
    this.searchStateChange(
      this.searchState.length > 0
        ? this.searchState
        : this.recentSearches.length > 0
        ? this.recentSearches[this.recentSearches.length - 1]
        : ''
    );
    this.doSearch(this.searchState);
    this.state = { throwError: false };
  }

  private doRefresh() {
    if (this._isMounted) {
      this.forceUpdate();
    }
  }

  private searchStateChange(newSearchState: string) {
    this.searchState = newSearchState;
    this.doRefresh();
  }

  private updateRecentSearches() {
    this.recentSearches = defaultSearchHistoryWrapper.getHistory();
    this.doRefresh();
  }

  private setResults(newResults: Array<GithubRepository>) {
    this.results = newResults;
    this.doRefresh();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  private setErrorToThrow(throwError: boolean) {
    this.throwError = throwError;
    if (throwError) {
      this.doRefresh();
    }
  }

  private ErrorLogger({}: object): ReactNode {
    if (ErrorBoundary.LatestError === undefined) {
      return <></>;
    } else {
      return (
        <div>
          <p>{ErrorBoundary.LatestError.name}</p>
          <p>{ErrorBoundary.LatestError.message}</p>
          <p>{ErrorBoundary.LatestError.stack}</p>
        </div>
      );
    }
  }

  render() {
    const { searchState, results, throwError } = this;
    return (
      <ErrorBoundary fallback={() => this.ErrorLogger({})}>
        <div className="main_container">
          <div className="main_content">
            <SearchPanel onSubmit={() => this.doSearch()}>
              <Search
                state={searchState}
                onChange={(newState) => this.searchStateChange(newState)}
              />
            </SearchPanel>
            <Results state={results} />
            <ErrorThrower
              throwError={throwError}
              onSetErrorToThrow={(toThrow) => this.setErrorToThrow(toThrow)}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
