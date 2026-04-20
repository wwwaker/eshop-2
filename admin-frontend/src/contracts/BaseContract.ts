export interface BaseView {
  showLoading(): void;
  hideLoading(): void;
  showError(message: string): void;
}

export interface BasePresenter<V extends BaseView> {
  attachView(view: V): void;
  detachView(): void;
  isViewAttached(): boolean;
}