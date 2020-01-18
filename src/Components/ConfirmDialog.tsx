import React, { PureComponent } from 'react';

export interface ConfirmDialogProps {
  title: string;
  text: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isModal?: boolean;
}

class ConfirmDialog extends PureComponent<ConfirmDialogProps> {
  rootElement = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const options = {
      opacity: this.props.isModal ? 0.7 : 0.5,
      dismissible: !this.props.isModal
    };

    M.Modal.init(this.rootElement.current, options);
  }

  componentWillUnmount() {
    const modalInstance = M.Modal.getInstance(this.rootElement.current);
    modalInstance.destroy();
  }

  public show() {
    const modalInstance = M.Modal.getInstance(this.rootElement.current);
    modalInstance.open();
  }

  public render() {
    const confirmButtonText = this.props.confirmButtonText || 'Ok';
    const cancelButtonText = this.props.cancelButtonText || 'Cancel';

    return (
      <div ref={this.rootElement} id="modal1" className="modal bottom-sheet">
        <div className="modal-content">
          <h5>{this.props.title}</h5>
          <p>{this.props.text}</p>
        </div>
        <div className="modal-footer">
          <a 
            href="#" 
            className="modal-close waves-effect waves-blue btn-flat"
            onClick={this.props.onConfirm}
          >{confirmButtonText}</a>
          <a 
            href="#" 
            onClick={this.props.onCancel}
            className="modal-close waves-effect waves-red btn-flat"
          >{cancelButtonText}</a>
        </div>
      </div>
    );
  }
}

export default ConfirmDialog;
