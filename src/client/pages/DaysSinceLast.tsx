import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchDsl } from '../logic/dsl';

import { TimeData } from '../types';

function DaysSinceLast() {
  const { dslId } = useParams();

  const [dslData, setDslData] = useState(null as any);
  const [timeData, setTimeData] = useState<TimeData>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  function updateTimeData() {
    if (!dslData) {
      return;
    }

    let totalSeconds = (Date.now() - dslData.lastTrigger) / 1000;

    const days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
    const minutes = Math.floor(totalSeconds / 60);
    totalSeconds -= minutes * 60;

    setTimeData({ days, hours, minutes, seconds: Math.round(totalSeconds) });
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

  return <div>{dslData ? <p>{JSON.stringify(timeData)}</p> : 'Loading...'}</div>;
}

export default DaysSinceLast;
