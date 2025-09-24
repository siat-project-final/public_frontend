import React from 'react';

const StickerCard = ({ sticker, onPurchase, purchased, disabled }) => {
  return (
    <div className="card h-100 text-center shadow-sm">
      <img
        src={sticker.image}
        alt={sticker.name}
        className="card-img-top"
        style={{ height: '160px', objectFit: 'contain', padding: '1rem' }}
      />
      <div className="card-body">
        <h5 className="card-title">{sticker.name}</h5>
        <p className="card-text">💰 {sticker.cost}P</p>
        {purchased ? (
          <button className="btn btn-secondary" disabled>
            구매 완료
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => onPurchase(sticker)}
            disabled={disabled}
            style={{ backgroundColor: '#84cc16', border: '1px solid #84cc16' }}
          >
            구매하기
          </button>
        )}
      </div>
    </div>
  );
};

export default StickerCard;
