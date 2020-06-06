import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchDsl } from '../logic/dsl';

import Counter from '../components/Counter';

import { TimeData } from '../types';

function DaysSinceLast() {
  const { dslId } = useParams();

  const [dslData, setDslData] = useState(null as any);
  const [timeData, setTimeData] = useState<TimeData>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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

  useEffect(() => {
    fetchDsl(dslId).then((response) => {
      setDslData(response.data);

      updateTimeData();
      setInterval(() => {
        updateTimeData();
      }, 1000);
    });
  }, [dslData]);

  return (
    <div style={{ marginTop: '1em' }}>
      {dslData ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            Since Last {dslData.name}
          </span>
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default DaysSinceLast;
