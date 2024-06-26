export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) { }
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
      element.classList.toggle(className, force);
    }
    protected setText(element: HTMLElement, value: string): void {
      if (element) {
        element.textContent = String(value);
      }
    }
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
    setDisabled(element: HTMLElement, state: boolean): void {
      if (state) element.setAttribute('disabled', 'disabled');
      else element.removeAttribute('disabled');
    }
    protected setHidden(element: HTMLElement): void {
      element.style.display = 'none';
    }
    protected setVisible(element: HTMLElement): void {
      element.style.removeProperty('display');
    }
    render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
    }
  }