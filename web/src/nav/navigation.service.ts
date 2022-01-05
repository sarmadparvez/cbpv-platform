import { Injectable } from '@angular/core';
import { Route } from '@angular/router';

export class Page {
  title: string;
  isChild: boolean;
  constructor(title, isChild) {
    this.title = title;
    this.isChild = isChild;
  }
}

export interface NavRoute extends Route {
  path?: string;
  icon?: string;
  group?: string;
  groupedNavRoutes?: NavRoute[];
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly navigationItems: NavRoute[];
  private selectedNavigationItem: NavRoute = {} as NavRoute;
  private activePage: Page;
  private navigationStack: Array<Array<string>> = [];

  constructor() {}

  public getNavigationItems(): NavRoute[] {
    return this.navigationItems;
  }

  public selectNavigationItemByPath(path: string) {
    this.selectedNavigationItem = this.navigationItems
      .reduce((flatList, navItem) => {
        if (navItem.groupedNavRoutes) {
          navItem.groupedNavRoutes.forEach(route => {
            flatList.push(route);
          });
        } else {
          flatList.push(navItem);
        }
        return flatList;
      }, [])
      .find(navItem => navItem.path === path);
  }

  public getSelectedNavigationItem(): NavRoute {
    return this.selectedNavigationItem;
  }

  public getActivePage(): Page {
    return this.activePage;
  }

  public resetStack(url: string[]) {
    this.navigationStack = [url];
  }

  public pushToStack(url: string[]) {
    this.navigationStack.push(url);
  }

  public popFromStack() {
    this.navigationStack.pop();
  }

  public getPreviousUrl(): string[] {
    return this.navigationStack
      .slice(0, -1)
      .reduce((flatUrl, urlSegment) => [...flatUrl, ...urlSegment], []);
  }

  public getCurrentUrl(): string[] {
    return this.navigationStack.reduce(
      (flatUrl, urlSegment) => [...flatUrl, ...urlSegment],
      [],
    );
  }

  public setActivePage(
    title: string,
    url?: string[],
    isChild: boolean = false,
  ) {
    if (url?.length > 0) {
      isChild ? this.pushToStack(url) : this.resetStack(url);
    }
    this.activePage = new Page(title, isChild);
  }
}
