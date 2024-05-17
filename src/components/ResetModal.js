import React from 'react';
import './style/ResetModal.css';

function ResetModal({ confirmReset, cancelReset }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>Resetしますか？</h1>
        <div className="modal-buttons">
          <button className="button confirm" onClick={confirmReset}>はい</button>
          <button className="button cancel" onClick={cancelReset}>いいえ</button>
        </div>
      </div>
    </div>
  );
}

export default ResetModal;
