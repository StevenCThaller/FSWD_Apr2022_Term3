import { useState } from 'react';
import './AvatarPicker.scss';


const AvatarPicker = ({ imgs, selected, setSelected }) => {

  return (
    <div className="avatar-picker">
      {
        imgs.map(img => (
          <img
            key={img}
            className={`selectable-avatar ${selected.includes(img) ? 'selected' : ''}`}
            onClick={() => setSelected(`/${img}`)}
            src={`/${img}`}
            alt={img} />
        ))
      }
    </div>
  )
}

export default AvatarPicker