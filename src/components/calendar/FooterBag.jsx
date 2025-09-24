import React, { useState, useEffect } from 'react';
import { Draggable } from '@fullcalendar/interaction';

const MAX_SLOTS = 10;

let draggableInstance = null; // 중복 생성을 막기 위한 전역 변수

export default function FooterBag() {
  const [isOpen, setIsOpen] = useState(false);
  const [bagItems, setBagItems] = useState([]);

  const syncBag = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('calendarBag') || '[]');
      if (Array.isArray(stored)) {
        setBagItems(stored.slice(0, MAX_SLOTS));
      } else {
        setBagItems([]);
      }
    } catch {
      setBagItems([]);
    }
  };

  useEffect(() => {
    syncBag();
    const onStorage = (e) => {
      if (e.key === 'calendarBag') syncBag();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const container = document.getElementById('my-footer-bag-slot');
    if (!container) return;

    if (draggableInstance) {
      draggableInstance.destroy();
      draggableInstance = null;
    }

    draggableInstance = new Draggable(container, {
      itemSelector: '.bag-slot',
      eventData: (el) => {
        const { id, name, image } = el.dataset;
        if (!id || !image) {
          console.warn('⚠️ 드래그 대상 누락: ', el.dataset);
          return null;
        }

        return {
          title: '',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: 'transparent',
          id: `sticker-${id}-${Date.now()}`,
          extendedProps: {
            type: 'STICKER',
            stickerId: id,
            name,
            image,
            align: 'center',     
            position: 'bottom',
          },
        };
      },
    });

    return () => {
      if (draggableInstance) {
        draggableInstance.destroy();
        draggableInstance = null;
      }
    };
  }, [bagItems, isOpen]);

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 100}}>
      <button
  onClick={() => setIsOpen(!isOpen)}
  style={{
    background: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '50%',
    width: 56,
    height: 56,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isOpen ? 'scale(1.05)' : 'scale(1)',
    WebkitTapHighlightColor: 'transparent', // 모바일 클릭 하이라이트 제거
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  }}
  title={isOpen ? '가방 닫기' : '가방 열기'}
>
  🎒
</button>


      <div
        style={{
          maxHeight: isOpen ? 320 : 0,
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.4s ease',
          marginTop: isOpen ? 12 : 0,
        }}
      >
        <div
          id="my-footer-bag-slot"
          style={{
            background: '#fff',
            padding: 12,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            maxWidth: 340,
          }}
        >
          {Array.from({ length: MAX_SLOTS }).map((_, idx) => {
            const item = bagItems[idx];
            return (
              <div
                key={idx}
                className="bag-slot"
                data-id={item?.id}
                data-name={item?.name}
                data-image={item?.image}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: 'linear-gradient(#ffffff, #f1f1f1)',
                  boxShadow: 'inset 0 0 0 1px #ddd, 0 1px 3px rgba(0,0,0,0.08)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  cursor: item ? 'grab' : 'default',
                  transition: 'box-shadow 0.2s',
                }}
                title={item ? item.name : ''}
              >
                {item ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: '#aaa' }}>{idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
