import { BasePresenter, BaseView } from '../contracts';

export abstract class BasePresenterImpl<V extends BaseView> implements BasePresenter<V> {
  protected view: V | null = null;

  attachView(view: V): void {
    this.view = view;
  }

  detachView(): void {
    this.view = null;
  }

  isViewAttached(): boolean {
    return this.view !== null;
  }

  protected getView(): V | null {
    return this.view;
  }
}