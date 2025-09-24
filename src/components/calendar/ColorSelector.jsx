// import React, { useState } from 'react';
// import { CirclePicker } from 'react-color';

// const ColorSelector = () => {
//     const [color, setColor] = useState('#ff6900');
  
//     return (
//       <div>
//         <CirclePicker
//           color={color}
//           onChangeComplete={(color) => setColor(color.hex)}
//           colors={['#ff6900', '#fcb900', '#7bdcb5', '#00d084', '#8ed1fc', '#0693e3']}
//         />
//       </div>
//     );
//   };

// export default ColorSelector;

import React, { useState, useRef, useEffect } from 'react';

// const colorOptions = [
//   '#4285F4', '#3367D6', '#174EA6', '#DB4437', '#FF4081',
//   '#F4B400', '#0F9D58', '#34A853', '#AECBFA', '#00BCD4',
//   '#AB47BC', '#9C27B0', '#7E57C2', '#FFA000', '#795548', '#9E9E9E'
// ];

const colorOptions = [
    '#FFB3BA', 
    '#FFDFBA', 
    '#FFFFBA', 
    '#BAFFC9', 
    '#BAE1FF', 
    '#CBA6FF', 
    '#F3C7F3'  
  ];

const ColorSelector = ({ selectedColor, onSelectColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      {/* 버튼 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: '5px'
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: selectedColor,
            border: '1px solid #aaa'
          }}
        />
        <div style={{ fontSize: 10 }}>▼</div>
      </div>

      {/* 드롭다운 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '120%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: 8,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 24px)',
            gap: 8,
            zIndex: 999
          }}
        >
          {colorOptions.map((color) => (
            <div
              key={color}
              onClick={() => {
                onSelectColor(color);
                setIsOpen(false);
              }}
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: color,
                cursor: 'pointer',
                border: color === selectedColor ? '2px solid #000' : '1px solid #ccc'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
