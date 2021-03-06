import * as React from 'react';
import * as classnames from 'classnames';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { Toolbar, Markdown, AppMaxWidth } from './ui';
import { GitHubIcon, MenuIcon, HomeIcon, IssuesIcon } from './icons';
import { Switch, Route } from 'react-router-dom';
import { IArticleMap } from './article';

const Style = require('./app.scss');

export interface IAppProps extends RouteComponentProps<any> {
    source: IArticleMap;
}

class App extends React.Component<IAppProps, any> {
    state = {
        menuOpened: false
    };

    private _toggleMenu = () => {
        this.setState({ menuOpened: !this.state.menuOpened });
    }

    private _hideMenu = () => {
        this.setState({ menuOpened: false });
    }

    private _renderNavigation() {
        const { source } = this.props;
        return (
            <nav
                className={classnames(Style.navigation, {
                    [Style.navigationOpened]: this.state.menuOpened
                })}
            >
                {source.map((item) => {
                    if (!item.url) {
                        return null;
                    }

                    const url = `/${item.url}`;

                    if (item.isGroup) {
                        return (
                            <div key={url}>
                                {item.caption}
                            </div>
                        );
                    }

                    return (
                        <NavLink exact to={url} key={url} onClick={this._hideMenu}>
                            <span style={{ '--nav-deep': item.deep } as any}>
                                {item.caption}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>
        );
    }

    private _renderRoutes() {
        const { source } = this.props;
        return source.map((item) => {
            if (item.isGroup) {
                return null;
            }

            const url = `/${item.url}`;

            return (
                <Route exact path={url} key={url}>
                    <article
                        className={classnames(Style.articleBody, {
                            [Style.articleBlur]: this.state.menuOpened
                        })}
                    >
                        <Markdown
                            className={Style.articleChunk}
                            source={item.body}
                        />
                    </article>
                </Route>
            );
        });
    }

    public componentDidUpdate(prev: IAppProps) {
        if (this.props.location !== prev.location) {
            const { hash } = this.props.location;

            if (!hash) {
                window.scrollTo({ top: 0 });
            } else {
                let e = document.body.querySelectorAll(`a[name="${hash.slice(1)}"]`)[0];
                if (e) {
                    e.scrollIntoView();
                }
            }
        }
    }

    public render() {
        return (
            <>
                <Toolbar>
                    <div>
                        <div
                            className={classnames(Style.menu, {
                                [Style.menuOpened]: this.state.menuOpened
                                })}
                            >
                            <MenuIcon
                                onClick={this._toggleMenu}
                            />
                        </div>
                        <NavLink exact to="/" onClick={this._hideMenu} title="Home">
                            <HomeIcon />
                        </NavLink>
                        <a target="blank" rel="noopener" href={process.env.GITHUB_URL} title="GitHub page">
                            <GitHubIcon size={20} />
                        </a>
                        <a target="blank" rel="noopener" href={process.env.GITHUB_URL + '/issues'} title="Issues">
                            <IssuesIcon />
                        </a>
                    </div>
                </Toolbar>
                <main className={Style.main}>
                    <AppMaxWidth classNameLayer={Style.content}>
                        {this._renderNavigation()}
                        <Switch>
                            {this._renderRoutes()}
                            <Route>
                                <div
                                    className={classnames(Style.articleBody, {
                                        [Style.articleBlur]: this.state.menuOpened
                                    })}
                                >
                                    <div>
                                        Page not found.
                                    </div>
                                </div>
                            </Route>
                        </Switch>
                    </AppMaxWidth>
                </main>
                <footer className={Style.footer}>
                    <AppMaxWidth classNameLayer={Style.footerContent}>
                    </AppMaxWidth>
                </footer>
            </>
        );
    }
}

export default (withRouter as any)(App);
