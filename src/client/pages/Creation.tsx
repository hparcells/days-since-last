import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { submitDsl } from '../logic/dsl';
import Button from '../components/Button/Button';

function Creation({ token }: { token: string }) {
  const history = useHistory();

  const [name, setName] = useState<string>('Incident');
  const [error, setError] = useState<string>(null as any);
  const [canSubmit, setCanSubmit] = useState<boolean>(true);

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null as any);
    setName(event.target.value);
    setCanSubmit(true);
  }
  async function handleSubmit() {
    setCanSubmit(false);

    if (name.trim().length > 50) {
      setError('Name must be 50 characters or less.');
      setCanSubmit(true);
      return;
    }
    if (name.trim().length === 0) {
      setError('Name is required.');
      setCanSubmit(true);
      return;
    }

    const response = await submitDsl(name.trim(), token);
    if (response.data.status === 'SUCCESS') {
      setCanSubmit(true);
      history.push(`/dsl/${response.data.id}`);
    } else {
      setError('Something went wrong. Try again.');
      setCanSubmit(true);
    }
  }

  return token ? (
    <div>
      <h1>Create a New Counter</h1>
      <div style={{ maxWidth: '900px', margin: 'auto' }}>
        <span>
          Name: <input value={name} onChange={handleNameChange} />
        </span>

        <p>Will be displayed as:</p>
        <p style={{ margin: '1em' }}>
          It Has Been 2 Days 15 Hours 23 Seconds Since The Last {name}
        </p>

        <Button onClick={handleSubmit} disabled={!canSubmit}>
          Submit
        </Button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  ) : (
    <p style={{ color: 'red' }}>You need to be logged in to do that.</p>
  );
}

export default Creation;
