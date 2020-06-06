import React from 'react';

import Button from './Button/Button';

import { Notification } from '../types';

function NotificationOptions({
  notificationData,
  index,
  handleNotificationChange,
  handleNotificationDelete
}: {
  notificationData: Notification;
  index: number;
  handleNotificationChange: (data: Notification, index: number) => void;
  handleNotificationDelete: (index: number) => void;
}) {
  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newNotification = { ...notificationData };
    newNotification.type = event.target.value as 'EXCEEDS' | 'RESETS';
    handleNotificationChange(newNotification, index);
  }
  function handleDelete() {
    handleNotificationDelete(index);
  }

  function handleYearsChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newNotification = { ...notificationData };

    if (newNotification.type === 'RESETS') {
      return;
    }

    if (Number(event.target.value) >= 0) {
      newNotification.years = Number(event.target.value);
      handleNotificationChange(newNotification, index);
    }
  }
  function handleDaysChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newNotification = { ...notificationData };

    if (newNotification.type === 'RESETS') {
      return;
    }

    if (Number(event.target.value) >= 0 && Number(event.target.value) < 365) {
      newNotification.days = Number(event.target.value);
      handleNotificationChange(newNotification, index);
    }

    handleNotificationChange(newNotification, index);
  }
  function handleHoursChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newNotification = { ...notificationData };

    if (newNotification.type === 'RESETS') {
      return;
    }

    if (Number(event.target.value) >= 0 && Number(event.target.value) < 24) {
      newNotification.hours = Number(event.target.value);
      handleNotificationChange(newNotification, index);
    }

    handleNotificationChange(newNotification, index);
  }
  function handleMinutesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newNotification = { ...notificationData };

    if (newNotification.type === 'RESETS') {
      return;
    }

    if (Number(event.target.value) >= 0 && Number(event.target.value) < 60) {
      newNotification.minutes = Number(event.target.value);
      handleNotificationChange(newNotification, index);
    }

    handleNotificationChange(newNotification, index);
  }
  function handleSecondsChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newNotification = { ...notificationData };

    if (newNotification.type === 'RESETS') {
      return;
    }

    if (Number(event.target.value) >= 0 && Number(event.target.value) < 60) {
      newNotification.seconds = Number(event.target.value) - 0;
      handleNotificationChange(newNotification, index);
    }

    handleNotificationChange(newNotification, index);
  }

  return (
    <div style={{ margin: '0.5em 0px' }}>
      <span>Remind me when the counter </span>
      <select value={notificationData.type} onChange={handleTypeChange}>
        <option value='EXCEEDS'>Exceeds</option>
        <option value='RESETS'>Resets</option>
      </select>
      <button onClick={handleDelete} style={{ marginLeft: '0.5em' }}>
        Delete
      </button>

      {notificationData.type === 'EXCEEDS' && (
        <ul>
          <li>
            Years{' '}
            <input type='number' value={notificationData.years} onChange={handleYearsChange} />
          </li>
          <li>
            Days <input type='number' value={notificationData.days} onChange={handleDaysChange} />
          </li>
          <li>
            Hours{' '}
            <input type='number' value={notificationData.hours} onChange={handleHoursChange} />
          </li>
          <li>
            Minutes{' '}
            <input type='number' value={notificationData.minutes} onChange={handleMinutesChange} />
          </li>
          <li>
            Seconds{' '}
            <input type='number' value={notificationData.seconds} onChange={handleSecondsChange} />
          </li>
        </ul>
      )}
    </div>
  );
}

export default NotificationOptions;
