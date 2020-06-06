import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { plural } from '@reverse/string';
import axios from 'axios';
import { formatDate } from '@reverse/date';
import { removeAt } from '@reverse/array';

import { fetchDsl } from '../logic/dsl';

import Counter from '../components/Counter';

import { TimeData, Notification } from '../types';
import Button from '../components/Button/Button';
import NotificationOptions from '../components/NotificationOptions';

let updateInterval: NodeJS.Timeout;

function DaysSinceLast({ userId, token }: { userId: string; token: string }) {
  const { dslId } = useParams();

  const [dslData, setDslData] = useState(null as any);
  const [timeData, setTimeData] = useState<TimeData>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 10,
    seconds: 0
  });
  const [canReset, setCanReset] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function getDslData() {
    fetchDsl(dslId).then((response) => {
      setDslData(response.data);
    });
  }
  function updateTimeData() {
    if (!dslData) {
      return;
    }

    let totalSeconds = (Date.now() - dslData.lastTrigger) / 1000;

    const years = Math.floor(totalSeconds / 31536000);
    totalSeconds -= years * 31536000;
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
    const minutes = Math.floor(totalSeconds / 60);
    totalSeconds -= minutes * 60;

    setTimeData({ years, days, hours, minutes, seconds: Math.round(totalSeconds) });
  }
  async function handleResetClick() {
    setCanReset(false);

    const response = await axios.post('/api/dsl/reset', {
      token,
      id: dslData.id
    });

    if (response.data === 'SUCCESS') {
      clearInterval(updateInterval);
      getDslData();
    } else {
      setCanReset(true);
    }
  }
  function handleNewNotification() {
    window.Notification.requestPermission();

    const newNotifications = [...notifications];

    newNotifications.push({
      type: 'EXCEEDS',
      sent: false,
      years: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 30
    } as Notification);

    setNotifications(newNotifications);
  }
  function handleNotificationChange(data: Notification, index: number) {
    const newNotifications = [...notifications];

    newNotifications[index] = data;
    newNotifications[index].sent = false;

    setNotifications(newNotifications);
  }
  function handleNotificationDelete(index: number) {
    let newNotifications = [...notifications];

    newNotifications = removeAt(newNotifications, index);

    setNotifications(newNotifications);
  }

  useEffect(() => {
    getDslData();
  }, []);
  useEffect(() => {
    updateTimeData();
    setCanReset(true);

    updateInterval = setInterval(() => {
      updateTimeData();
    }, 1000);
  }, [dslData]);
  useEffect(() => {
    let hasSendResetNotification = false;
    notifications.forEach((notification) => {
      if (
        notification.type === 'RESETS' &&
        timeData.years === 0 &&
        timeData.days === 0 &&
        timeData.hours === 0 &&
        timeData.minutes === 0 &&
        timeData.seconds === 0
      ) {
        if (!hasSendResetNotification) {
          new window.Notification(`'Time Since Last ${dslData.name}' has been reset.`, {
            icon: `${location.origin}/icon/favicon-310.png`
          });
          hasSendResetNotification = true;
        }
        return;
      }

      if (!notification.sent && notification.type === 'EXCEEDS') {
        const elapsedTime = (Date.now() - dslData.lastTrigger) / 1000;
        const triggerTime =
          notification.years * 31536000 +
          notification.days * 86400 +
          notification.hours * 3600 +
          notification.minutes * 60 +
          notification.seconds;

        if (elapsedTime > triggerTime) {
          new window.Notification(
            `'Time Since Last ${dslData.name}' has exceeded it's notification threshold.`,
            {
              icon: `${location.origin}/icon/favicon-310.png`
            }
          );

          notification.sent = true;
        }
      }
    });
  }, [timeData]);

  return (
    <div style={{ marginTop: '1em' }}>
      {dslData ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '36px', textAlign: 'center' }}>It Has Been</span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '0.5em'
            }}
          >
            <div style={{ display: 'flex' }}>
              {timeData.years ? <Counter value={timeData.years} label='Years' /> : null}
              <Counter value={timeData.days} label='Days' />
            </div>
            <div style={{ display: 'flex', marginTop: '0.5em' }}>
              <Counter value={timeData.hours} label='Hours' />
              <Counter value={timeData.minutes} label='Minutes' />
              <Counter value={timeData.seconds} label='Seconds' />
            </div>
          </div>
          <span style={{ fontSize: '36px', textAlign: 'center', marginTop: '0.5em' }}>
            Since The Last {dslData.name}
          </span>

          <p>
            This counter has been reset {dslData.triggers} {plural(dslData.triggers, 'time')} since{' '}
            {formatDate(new Date(dslData.createdOn))}.
          </p>

          {dslData.createdBy === userId && (
            <Button onClick={handleResetClick} disabled={!canReset}>
              Reset to 0
            </Button>
          )}

          <h2>Notifications</h2>

          {notifications.map((notification, index) => {
            return (
              <NotificationOptions
                key={index}
                notificationData={notification}
                index={index}
                handleNotificationChange={handleNotificationChange}
                handleNotificationDelete={handleNotificationDelete}
              />
            );
          })}

          <Button onClick={handleNewNotification}>New Notification</Button>
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default DaysSinceLast;
