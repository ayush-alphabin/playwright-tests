type RouteHandler = () => void;

export class Router {
  private routes: Record<string, RouteHandler>;
  private container: HTMLElement;

  constructor(container: HTMLElement, routes: Record<string, RouteHandler>) {
    this.container = container;
    this.routes = routes;
  }

  start(): void {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  }

  private resolve(): void {
    const path = window.location.hash.slice(1) || '/';
    const handler = this.routes[path];

    if (handler) {
      this.container.innerHTML = '';
      handler();
    } else {
      this.container.innerHTML = '<div class="empty-state"><h1>404</h1><p>Page not found</p></div>';
    }
  }
}
